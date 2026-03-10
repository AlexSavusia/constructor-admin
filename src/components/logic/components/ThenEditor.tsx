import type {ActionNode} from "../type.ts";
import ActionRow from "./ActionRow.tsx";

export type ThenEditorProps = {
    node: ActionNode[];
    onChange: (next: ActionNode[]) => void;
}

export default function ThenEditor({node, onChange}: ThenEditorProps) {
    const update = (id: string, next: ActionNode) => {
        onChange(node.map((a) => (a.id === id ? next : a)));
    };

    const remove = (id: string) => {
        onChange(node.filter((a) => a.id !== id));
    };

    const addAction = () => {
        onChange([
            ...node,
            {
                id: crypto.randomUUID(),
                enabled: true,
                type: "showField",
                fieldId: "",
            },
        ]);
    };

    return (
        <section>
            <h3>THEN</h3>

            {node.map((action) => (
                <ActionRow
                    key={action.id}
                    node={action}
                    onChange={(next) => update(action.id, next)}
                    onDelete={() => remove(action.id)}
                />
            ))}

            <button onClick={addAction}>+ Add action</button>
        </section>
    )
}