import ConditionRow from "./ConditionRow.tsx";
import {
    type AndExpression,
    type BoolConstExpression,
    getChildrenRootPathForRule,
    type OrExpression
} from "../../../logic/expression.ts";
import {findByPath, type ObjPath, useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";
export type GroupEditorProps = {
    rule: AndExpression | OrExpression
    path: ObjPath
}

export default function GroupEditor({rule, path}: GroupEditorProps) {
    const editingRule = useEditorContext(s=>s.editingRule)!
    const updateEditingRule = useEditorContext(s=>s.updateEditingRule)
    const addGroup = () => {
        const newGroup: AndExpression | OrExpression = {
            id: crypto.randomUUID(),
            type: "and",
            items: [],
        };
        rule.items.push(newGroup);
        const npg = getChildrenRootPathForRule(path, newGroup)[1] as ObjPath;
        updateEditingRule(npg, newGroup);
    };

    const addCondition = () => {
        const newCondition: BoolConstExpression = {
            id: crypto.randomUUID(),
            type: "boolConst",
            value: true
        };
        rule.items.push(newCondition);
        const npg = getChildrenRootPathForRule(path, newCondition) as ObjPath;
        updateEditingRule(npg, newCondition);
    };

    return (
        <div style={{ borderLeft: "2px solid #d9d9d9", paddingLeft: 12, marginBottom: 12 }}>
            <div>
                <select
                    value={rule.type}
                    onChange={(e) =>{
                        // debugger
                        updateEditingRule(path, {
                            ...findByPath(editingRule.rule.condition, path) as AndExpression | OrExpression,
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
                        <ConditionRow
                            key={child.id}
                            rule={child}
                            path={[...path, index]}
                        />
                    ) : (
                        <div key={child.id}>
                            <GroupEditor
                                rule={child}
                                path={[...path, index]}
                            />
                            <button onClick={() => {}}>Delete group</button>
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