import type {ConditionNode, GroupNode} from "../type.ts";
import ConditionRow from "./ConditionRow.tsx";

export type GroupEditorProps = {
    isRoot?: boolean;
    group: GroupNode
    onChange: (node: GroupNode) => void
}

export default function GroupEditor({group, onChange, isRoot}: GroupEditorProps) {
    const updateChild = (childId: string, nextChild: GroupNode | ConditionNode) => {
        onChange({
            ...group,
            children: group.children.map((c) => (c.id === childId ? nextChild : c)),
        });
    };

    const removeChild = (childId: string) => {
        onChange({
            ...group,
            children: group.children.filter((c) => c.id !== childId),
        });
    };

    const addCondition = () => {
        const newCondition: ConditionNode = {
            id: crypto.randomUUID(),
            type: "condition",
            enabled: true,
            left: { kind: "field", id: "" },
            operator: "eq",
            right: { kind: "const", value: "" },
        };

        onChange({
            ...group,
            children: [...group.children, newCondition],
        });
    };

    const addGroup = () => {
        const newGroup: GroupNode = {
            id: crypto.randomUUID(),
            type: "group",
            enabled: true,
            operator: "all",
            children: [],
        };

        onChange({
            ...group,
            children: [...group.children, newGroup],
        });
    };

    return (
        <div style={{ borderLeft: "2px solid #d9d9d9", paddingLeft: 12, marginBottom: 12 }}>
            <div>
                {!isRoot && (
                    <input
                        type="checkbox"
                        checked={group.enabled}
                        onChange={(e) => onChange({ ...group, enabled: e.target.checked })}
                        />
                )}
                <select
                    value={group.operator}
                    onChange={(e) =>
                        onChange({ ...group, operator: e.target.value as "all" | "any" })
                    }
                >
                    <option value="all">ALL conditions are met</option>
                    <option value="any">ANY of the following</option>
                </select>
            </div>
            <div>
                {group.children.map((child) =>
                    child.type === "condition" ? (
                        <ConditionRow
                            key={child.id}
                            node={child}
                            onChange={(next) => updateChild(child.id, next)}
                            onDelete={() => removeChild(child.id)}
                        />
                    ) : (
                        <div key={child.id}>
                            <GroupEditor
                                group={child}
                                onChange={(next) => updateChild(child.id, next)}
                            />
                            <button onClick={() => removeChild(child.id)}>Delete group</button>
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