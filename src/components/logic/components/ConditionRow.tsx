import type {CompareOp, ConditionNode, ValueSource} from "../type.ts";

export type ConditionRowProps = {
    node: ConditionNode;
    onChange: (node: ConditionNode) => void;
    onDelete: () => void;
}

export default function ConditionRow({node, onChange, onDelete}: ConditionRowProps) {
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }}>
            <input
                type="checkbox"
                checked={node.enabled}
                onChange={(e) => onChange({ ...node, enabled: e.target.checked })}
            />

            <select
                value={node.left.kind}
                onChange={(e) =>
                    onChange({
                        ...node,
                        left: { ...node.left, kind: e.target.value as "field" | "variable" },
                    })
                }
            >
                <option value="field">Field</option>
                <option value="variable">Variable</option>
            </select>

            <select
                value={node.left.id}
                onChange={(e) =>
                    onChange({
                        ...node,
                        left: { ...node.left, id: e.target.value },
                    })
                }
            >
                <option value="">-- select --</option>
                <option value="driverAge">Driver Age</option>
                <option value="carPower">Car Power</option>
                <option value="region">Region</option>
                <option value="hasDiscount">hasDiscount</option>
            </select>

            <select
                value={node.operator}
                onChange={(e) =>
                    onChange({
                        ...node,
                        operator: e.target.value as CompareOp,
                    })
                }
            >
                <option value="eq">is equal</option>
                <option value="ne">is not equal</option>
                <option value="gt">is greater than</option>
                <option value="gte">is greater or equal</option>
                <option value="lt">is lower than</option>
                <option value="lte">is lower or equal</option>
                <option value="isTrue">is true</option>
                <option value="isFalse">is false</option>
            </select>

            {!["isTrue", "isFalse", "isEmpty", "notEmpty"].includes(node.operator) && (
                <>
                    <select
                        value={node.right?.kind ?? "const"}
                        onChange={(e) =>
                            onChange({
                                ...node,
                                right: { kind: e.target.value as "const" | "field" | "variable", value: "" } as ValueSource,
                            })
                        }
                    >
                        <option value="const">Const</option>
                        <option value="field">Field</option>
                        <option value="variable">Variable</option>
                    </select>

                    {node.right?.kind === "const" && (
                        <input
                            value={String((node.right).value ?? "")}
                            onChange={(e) =>
                                onChange({
                                    ...node,
                                    right: { kind: "const", value: e.target.value },
                                })
                            }
                        />
                    )}

                    {node.right?.kind === "field" && (
                        <select
                            value={(node.right).fieldId ?? ""}
                            onChange={(e) =>
                                onChange({
                                    ...node,
                                    right: { kind: "field", fieldId: e.target.value },
                                })
                            }
                        >
                            <option value="">-- select field --</option>
                            <option value="driverAge">Driver Age</option>
                            <option value="carPower">Car Power</option>
                            <option value="region">Region</option>
                        </select>
                    )}

                    {node.right?.kind === "variable" && (
                        <select
                            value={(node.right).variableId ?? ""}
                            onChange={(e) =>
                                onChange({
                                    ...node,
                                    right: { kind: "variable", variableId: e.target.value },
                                })
                            }
                        >
                            <option value="">-- select variable --</option>
                            <option value="hasDiscount">hasDiscount</option>
                        </select>
                    )}
                </>
            )}

            <button onClick={onDelete}>delete</button>
        </div>
    );
}