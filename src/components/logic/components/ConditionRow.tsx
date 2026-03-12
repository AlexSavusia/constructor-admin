import type {Boolean2OperandExpression, BooleanExpression} from "../../../logic/expression.ts";
import {type ObjPath, useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";

export type ConditionRowProps = {
    rule: BooleanExpression
    path: ObjPath
}
//TODO remove partial
const OPERATORS_LABELS: Partial<Record<BooleanExpression["type"], string>> = {
    "eq": "equals",
    "ne": "not equals",
    "gt": "greater than",
    "gte": "greater than or equals",
    "lt": "less than",
    "lte": "less than or equals",
    "boolConst": "boolConst",

}

const TWO_OPERAND_OPERATORS: Boolean2OperandExpression["type"][] = [
    'eq', 'ne', 'gt', 'gte', 'lt', 'lte'
]

export default function ConditionRow({rule, path}: ConditionRowProps) {
    return null
    // const editingRule = useEditorContext(s=>s.editingRule)
    // const currentExpr = find
    //
    //
    // const resolveVariableDisplayString = (varPath: NodePath) => {
    //     const definition = getDefinitionByPath(varPath);
    //     if(!definition) return "null";
    //
    //     if(definition.__typ == "constant") {
    //         return `Const ${definition.label}`
    //     }
    //
    //     if(definition.__typ == "variable") {
    //         return `Var ${definition.label}`
    //     }
    //
    //     if(definition.__typ == "field") {
    //         return `Field TAKE FROM SETTINGS`
    //     }
    //     return `unknown definition __typ ${definition}`
    // }
    //
    // // const firstOperandValue = useMemo(() =>{
    // //     if(manyOperandMode) {
    // //         return (rule as Boolean2OperandExpression).left;
    // //     } else {
    // //         return (rule as {value: ValueExpression}).value;
    // //     }
    // // }, [rule, manyOperandMode])
    // //
    // // const secondOperandValue = useMemo(() =>{
    // //     if(manyOperandMode) {
    // //         return (rule as Boolean2OperandExpression).right;
    // //     }
    // //     return null;
    // // }, [rule, manyOperandMode])
    //
    // const contextVariablePaths = useMemo<NodePath[]>(() => {
    //     const res: NodePath[] = [];
    //     let selfKey: string | null = null;
    //     if(editorState.scope == "FIELD_SCOPE"){
    //         const self = getSelfByNodePath(path)
    //         if(self == null)
    //             throw new Error("self is null in field scope")
    //         selfKey = self.key!
    //         const fieldPaths = getFieldPaths(selfKey)
    //         res.push(...fieldPaths)
    //     }
    //
    //
    //     const constants = Object.entries(formEditorState.constants).map(v=>["constants", v[0]])
    //     const variables = Object.entries(formEditorState.variables).map(v=>["variables", v[0]])
    //
    //     res.push(...variables)
    //     res.push(...constants)
    //     return res;
    // }, [editorState, path, getFieldPaths, getSelfByNodePath, getVariablePaths, getConstantPaths, formEditorState]);
    //
    //
    //
    // return (
    //     <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
    //         <select
    //             value={firstPath.join(".")}
    //             onChange={e=> {
    //                 const np = e.target.value.split(".") as NodePath;
    //                 patchCondition(firstPath, {type: "ref", ref: np}) // TODO determine type by np value first
    //             }}
    //         >
    //             {contextVariablePaths.map(p => (
    //                 <option key={p.join(".")} value={p.join(".")}>{resolveVariableDisplayString(p)}</option>
    //             ))}
    //         </select>
    //         <select
    //             value={rule.type}
    //             onChange={e=> {
    //                 patchCondition(path, {type: e.target.value as BooleanExpression['type']})
    //             }}
    //         >
    //             {Object.entries(OPERATORS_LABELS).map(([op, lbl]) => (
    //                 <option key={op} value={op}>{lbl}</option>
    //             ))}
    //         </select>
    //         {(secondPath || manyOperandMode) &&
    //             <select
    //                 value={secondPath?.join(".") ?? undefined}
    //                 onChange={e=> {
    //                     const np = e.target.value.split(".") as NodePath;
    //                     patchCondition(np, {type: "ref", ref: np}) // TODO determine type by np value first
    //                 }}
    //             >
    //                 {contextVariablePaths.map(p => (
    //                     <option key={p.join(".")} value={p.join(".")}>{resolveVariableDisplayString(p)}</option>
    //                 ))}
    //             </select>
    //         }
    //     </div>
    // )
}