import ConditionRow from "./ConditionRow.tsx";
import {
    type AndExpression, type NotEmptyExpression,
    type OrExpression
} from "../../../logic/expression.ts";
import {findByPath, type ObjPath, useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";
import type {BooleanPropertyLogicDefinition} from "../../../logic/logic.ts";
import type {Rule} from "../types.ts";
export type GroupEditorProps = {
    rule: AndExpression | OrExpression
    path: ObjPath
}

export default function GroupEditor({rule, path}: GroupEditorProps) {
    const {rule: editingRuleUnknown} = useEditorContext(s=>s.editingRule)!
    const editingRule = 'defaultValue' in editingRuleUnknown ? (editingRuleUnknown as BooleanPropertyLogicDefinition).rule
        : (editingRuleUnknown as Rule);
    const updateEditingRule = useEditorContext(s=>s.updateEditingRule)
    const addGroup = () => {
        const newGroup: AndExpression | OrExpression = {
            id: crypto.randomUUID(),
            type: "and",
            items: [],
        };
        rule.items.push(newGroup);
        updateEditingRule(path, rule);
    };

    const addCondition = () => {
        const newCondition: NotEmptyExpression = {
            id: crypto.randomUUID(),
            type: "notEmpty",
            item: ["constants", "name"]
        };
        rule.items.push(newCondition);
        updateEditingRule(path, rule);

    };

    const deleteItem = (idx: number) => {
        const nr = {
            ...rule,
            items: rule.items.filter((_, i) => i !== idx)
        }
        updateEditingRule(path, nr);
    }
    return (
        <div style={{ borderLeft: "2px solid #d9d9d9", paddingLeft: 12, marginBottom: 12 }}>
            <div>
                <select
                    value={rule.type}
                    onChange={(e) =>{
                        const fuck = path.length == 1 ? [] : path.slice(1, path.length);
                        updateEditingRule(path, {
                            ...findByPath(editingRule.condition, fuck) as AndExpression | OrExpression,
                            type: e.target.value as "or" | "and"
                        })
                    }}
                >
                    <option value="and">ALL conditions are met</option>
                    <option value="or">ANY of the following</option>
                </select>
            </div>
            <div>
                {rule.items.map((child, index) =>
                    (child.type !== "and" && child.type !== "or") ? (
                        <div key={child.id}>
                            <ConditionRow
                                rule={child}
                                path={[...path, "items", index]}
                            />
                            <button onClick={() => deleteItem(index)}>Delete condition</button>
                        </div>
                    ) : (
                        <div key={child.id}>
                            <GroupEditor
                                rule={child}
                                path={[...path, "items", index]}
                            />
                            <button onClick={() => deleteItem(index)}>Delete group</button>
                        </div>
                    ))}
            </div>
            <div style={{ marginTop: 8 }}>
                <button onClick={addCondition}>+ Add condition</button>
                <button onClick={addGroup}>+ Add group</button>
            </div>
        </div>
    );
}