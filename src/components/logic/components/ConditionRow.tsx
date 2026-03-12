import {
    type AndExpression,
    type Boolean2OperandExpression,
    type BooleanExpression,
    isTwoOperandMode, isTwoOperandModeType, type NotEmptyExpression, type NotExpression, type OrExpression
} from "../../../logic/expression.ts";
import {
    type ObjPath,
    objPathFromString,
    objPathToString,
    useEditorContext
} from "../../../pages/Programs/editor/EditorContext.tsx";

export type ConditionRowProps = {
    rule: BooleanExpression
    path: ObjPath
}

const OPERATORS_LABELS: Record<Exclude<BooleanExpression["type"], "and" | "or">, string> = {
    "eq": "equals",
    "ne": "not equals",
    "gt": "greater than",
    "gte": "greater than or equals",
    "lt": "less than",
    "lte": "less than or equals",
    "isEmpty": "isEmpty",
    "notEmpty": "nnot empty",
    "not": "not",
    "in": "in"
}

type StupidFuck = Exclude<BooleanExpression, Boolean2OperandExpression | AndExpression | OrExpression | NotEmptyExpression | NotExpression>
export default function ConditionRow({rule, path}: ConditionRowProps) {
    const { scope} = useEditorContext(s=>s.editingRule)!
    // const editingRule = 'defaultValue' in editingRuleUnknown ? (editingRuleUnknown as BooleanPropertyLogicDefinition).rule
    //     : (editingRuleUnknown as Rule);
    const updateEditingRule = useEditorContext(s=>s.updateEditingRule)
    const getAllContextVariables = useEditorContext(s=>s.getAllContextVariables)
    const twoOperand = isTwoOperandMode(rule)

    const resolveVariableDisplayString = (p: ObjPath) => {
        return objPathToString(p)
    }

    const firstArg = twoOperand
        ? (rule as Boolean2OperandExpression).left
        : (rule as StupidFuck).item

    const secondArg = twoOperand ? (rule as Boolean2OperandExpression).right : null

    const contextVariablePaths = getAllContextVariables(scope)
    const allFields = [
        ...contextVariablePaths.fields,
        ...contextVariablePaths.variables,
        ...contextVariablePaths.constants
    ]

    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
            <select
                value={objPathToString(firstArg)}
                onChange={e=> {
                    const np = objPathFromString(e.target.value) as ObjPath;
                    if(twoOperand) {
                        updateEditingRule(path, {
                            ...rule as Boolean2OperandExpression,
                            left: np
                        });
                    }
                    else {
                        updateEditingRule(path, {
                            ...rule as StupidFuck,
                            item: np
                        });
                    }
                }}
            >
                {allFields.map(p => (
                    <option key={objPathToString(p)} value={objPathToString(p)}>{resolveVariableDisplayString(p)}</option>
                ))}
            </select>
            <select
                value={rule.type}
                onChange={e=> {
                    if(twoOperand) {
                        // @ts-expect-error no error
                        if(isTwoOperandModeType(e.target.value)){
                            // @ts-expect-error no error
                            updateEditingRule(path, { ...rule, type: e.target.value })
                        } else {
                            const nr = {
                                ...rule,
                                type: e.target.value,
                                // @ts-expect-error no error
                                item: rule.left
                            }
                            // @ts-expect-error no error
                            delete nr.left
                            // @ts-expect-error no error
                            updateEditingRule(path, nr)
                        }

                    } else {
                        // @ts-expect-error no error
                        if(!isTwoOperandModeType(e.target.value)){
                            // @ts-expect-error no error
                            updateEditingRule(path, { ...rule, type: e.target.value })
                        } else {
                            const nr = {
                                ...rule,
                                type: e.target.value,
                                // @ts-expect-error no error
                                left: rule.item
                            }
                            // @ts-expect-error no error
                            delete nr.item
                            // @ts-expect-error no error
                            updateEditingRule(path, nr)
                        }
                    }
                }}
            >
                {Object.entries(OPERATORS_LABELS).map(([op, lbl]) => (
                    <option key={op} value={op}>{lbl}</option>
                ))}
            </select>
            {(twoOperand) &&
                <select
                    value={secondArg ? objPathToString(secondArg) : undefined}
                    onChange={e=> {
                        const np = objPathFromString(e.target.value) as ObjPath;
                        updateEditingRule(path, {
                            ...rule as Boolean2OperandExpression,
                            right: np
                        });
                    }}
                >
                    {allFields.map(p => (
                        <option key={objPathToString(p)} value={objPathToString(p)}>{resolveVariableDisplayString(p)}</option>
                    ))}
                </select>
            }
        </div>
    )
}