import type {Boolean2OperandExpression, BooleanExpression} from "../../../logic/expression.ts";
import type {NodePath} from "./reducer.ts";
import {useMemo} from "react";
import {useEditor, useEditorActions, useEditorSelectors} from "./EditorContext.tsx";

export type ConditionRowProps = {
    rule: BooleanExpression
    path: NodePath
}
//TODO remove partial
const OPERATORS_LABELS: Partial<Record<BooleanExpression["type"], string>> = {
    "eq": "equals",
    "ne": "not equals",
    "gt": "greater than",
    "gte": "greater than or equals",
    "lt": "less than",
    "lte": "less than or equals",

}

const TWO_OPERAND_OPERATORS: Boolean2OperandExpression["type"][] = [
    'eq', 'ne', 'gt', 'gte', 'lt', 'lte'
]

export default function ConditionRow({rule, path}: ConditionRowProps) {
    const {state: editorState} = useEditor()
    const { patchCondition } = useEditorActions();
    const {getFieldPaths, getVariablePaths, getConstantPaths, getSelfByNodePath, getDefinitionByPath} = useEditorSelectors()
    const manyOperandMode = useMemo(()=>TWO_OPERAND_OPERATORS.includes(rule.type as Boolean2OperandExpression["type"]), [rule])

    const firstPath = useMemo(()=>manyOperandMode ? [...path, "left"] : [...path, "value"], [path, manyOperandMode])
    const secondPath = useMemo(()=>manyOperandMode ? [...path, "right"] : null, [path, manyOperandMode])


    const resolveVariableDisplayString = (varPath: NodePath) => {
        const definition = getDefinitionByPath(varPath);
        if(!definition) return "null";

        if(definition.__typ == "constant") {
            return `Const ${definition.label}`
        }

        if(definition.__typ == "variable") {
            return `Var ${definition.label}`
        }

        if(definition.__typ == "field") {
            return `Field TAKE FROM SETTINGS`
        }
        return `unknown definition __typ ${definition}`
    }

    // const firstOperandValue = useMemo(() =>{
    //     if(manyOperandMode) {
    //         return (rule as Boolean2OperandExpression).left;
    //     } else {
    //         return (rule as {value: ValueExpression}).value;
    //     }
    // }, [rule, manyOperandMode])
    //
    // const secondOperandValue = useMemo(() =>{
    //     if(manyOperandMode) {
    //         return (rule as Boolean2OperandExpression).right;
    //     }
    //     return null;
    // }, [rule, manyOperandMode])

    const contextVariablePaths = useMemo<NodePath[]>(() => {
        const res: NodePath[] = [];
        let selfKey: string | null = null;
        if(editorState.scope == "FIELD_SCOPE"){
            const self = getSelfByNodePath(path)
            if(self == null)
                throw new Error("self is null in field scope")
            selfKey = self.key!
            const fieldPaths = getFieldPaths(selfKey)
            res.push(...fieldPaths)
        }
        res.push(...getVariablePaths())
        res.push(...getConstantPaths())
        return res;
    }, [editorState, path, getFieldPaths, getSelfByNodePath, getVariablePaths, getConstantPaths])



    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
            <select
                value={firstPath.join(".")}
                onChange={e=> {
                    const np = e.target.value.split(".") as NodePath;
                    patchCondition(firstPath, {type: "ref", ref: np}) // TODO determine type by np value first
                }}
            >
                {contextVariablePaths.map(p => (
                    <option key={p.join(".")} value={p.join(".")}>{resolveVariableDisplayString(p)}</option>
                ))}
            </select>
            <select
                value={rule.type}
                onChange={e=> {
                    patchCondition(path, {type: e.target.value as BooleanExpression['type']})
                }}
            >
                {Object.entries(OPERATORS_LABELS).map(([op, lbl]) => (
                    <option key={op} value={op}>{lbl}</option>
                ))}
            </select>
            {secondPath &&
                <select
                    value={secondPath.join(".")}
                    onChange={e=> {
                        const np = e.target.value.split(".") as NodePath;
                        patchCondition(secondPath, {type: "ref", ref: np}) // TODO determine type by np value first
                    }}
                >
                    {contextVariablePaths.map(p => (
                        <option key={p.join(".")} value={p.join(".")}>{resolveVariableDisplayString(p)}</option>
                    ))}
                </select>
            }
        </div>
    )


    // const [dataSource, setDataSource] = useState<"field" | "variable" | "const">("field")
    // const [currField, setCurrField] = useState<string[] | null>()
    //
    // const {getFieldPaths, getVariablePaths, getConstantPaths, getSelfByNodePath} = useEditorSelectors()
    // const self = getSelfByNodePath(path)
    // if (!self) {
    //     throw new Error(`getSelfByNodePath(${path}) returned null`)
    // }
    // //simply in switch render one or two operands (depends on bool expr type) and single operator selector

    //
    // switch (rule.type){
    //     case "boolConst":
    //         return <p>TODO always true/false</p>
    //     case "eq":
    //     case "ne":
    //     case "gt":
    //     case "gte":
    //     case "lt":
    //     case "lte":
    //         return (
    //             <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
    //                 <select
    //                     value={getValueExpressionLabel(rule.left)} // here i have to parse valueExpression before rendering it
    //                     onChange={(e) =>
    //                         //here i should call patchCondition
    //                     }
    //                 >
    //                     {/*this comes from context values depending on selected field type (combine const var field paths into single array and display here)*/}
    //                 </select>
    //                 {/*<select>Operator selector</select>*/}
    //                 {/*<select>right operand selector</select>*/}
    //             </div>
    //         )
    //     case "isEmpty":
    //     case "notEmpty":
    //         return <p>1</p>
    //     default:
    //         throw new Error(`Unknown BooleanExpression type ${rule.type}`)
    //
    // }
    //
    //
    // return (
    //     <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
    //         <select
    //             value={dataSource}
    //             onChange={(e) =>
    //                 setDataSource(e.target.value as "field" | "variable" | "const")
    //             }
    //         >
    //             <option value="field">Field</option>
    //             <option value="variable">Variable</option>
    //             <option value="const">Constant</option>
    //         </select>
    //
    //         <select
    //             value={currField ? currField.join(".") : undefined}
    //             onChange={(e) =>
    //                 setCurrField(e.target.value.split("."))
    //             }
    //         >
    //             <option value="">-- select --</option>
    //             {dataSource === "field" && (fieldPaths.map(p=>(
    //                 <option value={p}>Field value {p}</option>
    //             )))}
    //             {dataSource === "variable" && (variablePaths.map(p=>(
    //                 <option value={p}>Variable value {p}</option>
    //             )))}
    //             {dataSource === "const" && (constPaths.map(p=>(
    //                 <option value={p}>Constant value {p}</option>
    //             )))}
    //         </select>
    //
    //         <select
    //             value={node.operator}
    //             onChange={(e) =>
    //                 onChange({
    //                     ...node,
    //                     operator: e.target.value as CompareOp,
    //                 })
    //             }
    //         >
    //             <option value="eq">is equal</option>
    //             <option value="ne">is not equal</option>
    //             <option value="gt">is greater than</option>
    //             <option value="gte">is greater or equal</option>
    //             <option value="lt">is lower than</option>
    //             <option value="lte">is lower or equal</option>
    //             <option value="isTrue">is true</option>
    //             <option value="isFalse">is false</option>
    //         </select>
    //
    //         {!["isTrue", "isFalse", "isEmpty", "notEmpty"].includes(node.operator) && (
    //             <>
    //                 <select
    //                     value={node.right?.kind ?? "const"}
    //                     onChange={(e) =>
    //                         onChange({
    //                             ...node,
    //                             right: { kind: e.target.value as "const" | "field" | "variable", value: "" } as ValueSource,
    //                         })
    //                     }
    //                 >
    //                     <option value="const">Const</option>
    //                     <option value="field">Field</option>
    //                     <option value="variable">Variable</option>
    //                 </select>
    //
    //                 {node.right?.kind === "const" && (
    //                     <input
    //                         value={String((node.right).value ?? "")}
    //                         onChange={(e) =>
    //                             onChange({
    //                                 ...node,
    //                                 right: { kind: "const", value: e.target.value },
    //                             })
    //                         }
    //                     />
    //                 )}
    //
    //                 {node.right?.kind === "field" && (
    //                     <select
    //                         value={(node.right).fieldId ?? ""}
    //                         onChange={(e) =>
    //                             onChange({
    //                                 ...node,
    //                                 right: { kind: "field", fieldId: e.target.value },
    //                             })
    //                         }
    //                     >
    //                         <option value="">-- select field --</option>
    //                         <option value="driverAge">Driver Age</option>
    //                         <option value="carPower">Car Power</option>
    //                         <option value="region">Region</option>
    //                     </select>
    //                 )}
    //
    //                 {node.right?.kind === "variable" && (
    //                     <select
    //                         value={(node.right).variableId ?? ""}
    //                         onChange={(e) =>
    //                             onChange({
    //                                 ...node,
    //                                 right: { kind: "variable", variableId: e.target.value },
    //                             })
    //                         }
    //                     >
    //                         <option value="">-- select variable --</option>
    //                         <option value="hasDiscount">hasDiscount</option>
    //                     </select>
    //                 )}
    //             </>
    //         )}
    //
    //         <button onClick={onDelete}>delete</button>
    //     </div>
    // );
}