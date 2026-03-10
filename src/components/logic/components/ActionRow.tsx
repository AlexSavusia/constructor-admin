import type {ActionNode} from "../type.ts";
import type {ChangeEvent} from "react";

export type ActionRowProps = {
    node: ActionNode;
    onChange: (next: ActionNode) => void;
    onDelete: () => void;
}

const onChangeHandler = (e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>, node: ActionNode, onChange: ActionRowProps['onChange']) => {
    const type = e.target.value;

    if (type === "showField") {
        onChange({
            id: node.id,
            enabled: node.enabled,
            type: "showField",
            fieldId: "",
        });
        return;
    }

    if (type === "hideField") {
        onChange({
            id: node.id,
            enabled: node.enabled,
            type: "hideField",
            fieldId: "",
        });
        return;
    }

    if (type === "setRequired") {
        onChange({
            id: node.id,
            enabled: node.enabled,
            type: "setRequired",
            fieldId: "",
            value: true,
        });
        return;
    }

    if (type === "setVariable") {
        onChange({
            id: node.id,
            enabled: node.enabled,
            type: "setVariable",
            variableId: "",
            value: { kind: "const", value: "" },
        });
    }
}

export default function ActionRow({node, onChange, onDelete}: ActionRowProps) {
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
            <input
                type="checkbox"
                checked={node.enabled}
                onChange={(e) => onChange({ ...node, enabled: e.target.checked } as ActionNode)}
            />

            <select
                value={node.type}
                onChange={(e) => onChangeHandler(e, node, onChange)}
            >
                <option value="showField">Show Field</option>
                <option value="hideField">Hide Field</option>
                <option value="setRequired">Set Required</option>
                <option value="setVariable">Set Variable</option>
            </select>

            {(node.type === "showField" ||
                node.type === "hideField" ||
                node.type === "setRequired") && (
                <select
                    value={node.fieldId}
                    onChange={(e) => onChange({ ...node, fieldId: e.target.value } as ActionNode)}
                >
                    <option value="">-- select field --</option>
                    <option value="passportNumber">Passport Number (TODO make context)</option>
                    <option value="region">Region (TODO make context)</option>
                </select>
            )}

            {node.type === "setRequired" && (
                <select
                    value={String(node.value)}
                    onChange={(e) =>
                        onChange({
                            ...node,
                            value: e.target.value === "true",
                        })
                    }
                >
                    <option value="true">true</option>
                    <option value="false">false</option>
                </select>
            )}

            {node.type === "setVariable" && (
                <>
                    <select
                        value={node.variableId}
                        onChange={(e) => onChange({ ...node, variableId: e.target.value })}
                    >
                        <option value="">-- variable --</option>
                        <option value="rateMultiplier">rateMultiplier (TODO make context)</option>
                    </select>

                    <input
                        value={String(node.value.kind === "const" ? node.value.value : "")}
                        onChange={(e) =>
                            onChange({
                                ...node,
                                value: { kind: "const", value: Number(e.target.value) },
                            })
                        }
                    />
                </>
            )}

            <button onClick={onDelete}>delete</button>
        </div>
    );
}