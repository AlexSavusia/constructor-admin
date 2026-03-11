import ConditionRow from "./ConditionRow.tsx";
import type {AndExpression, BoolConstExpression, OrExpression} from "../../../logic/expression.ts";
import type {NodePath} from "./reducer.ts";
import {useEditorActions} from "./EditorContext.tsx";

export type GroupEditorProps = {
    rule: AndExpression | OrExpression
    path: NodePath
}

export default function GroupEditor({rule, path}: GroupEditorProps) {
    const { updateCondition, patchCondition } = useEditorActions()

    const addGroup = () => {
        const newGroup: AndExpression | OrExpression = {
            id: crypto.randomUUID(),
            type: "and",
            items: [],
        };
        rule.items.push(newGroup);
        updateCondition(path, rule)
    };

    const addCondition = () => {
        const newCondition: BoolConstExpression = {
            id: crypto.randomUUID(),
            type: "boolConst",
            value: true
        };
        rule.items.push(newCondition);
        updateCondition(path, rule)
    };

    return (
        <div style={{ borderLeft: "2px solid #d9d9d9", paddingLeft: 12, marginBottom: 12 }}>
            <div>
                <select
                    value={rule.type}
                    onChange={(e) =>{
                        debugger
                        patchCondition(path, {
                            type: e.target.value as "or" | "and",
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
                            path={[...path, "items", index]}
                        />
                    ) : (
                        <div key={child.id}>
                            <GroupEditor
                                rule={child}
                                path={[...path, "items", index]}
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