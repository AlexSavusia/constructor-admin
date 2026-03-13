import {type ObjPath, useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";
import type {ActionExpression, SetFieldPropertyActionExpression} from "../types.ts";

export type ActionRowProps = {
    action: ActionExpression;
    path: ObjPath
}

type ActionType = ActionExpression["type"];

export default function ActionRow({action, path}: ActionRowProps) {
    const editingRule = useEditorContext(s=>s.editingRule)!
    const updateEditingRule = useEditorContext(s=>s.updateEditingRule)
    let actionTypes: Partial<Record<ActionType, string>> = {
        "noop": "Ничего не делать"
    }
    switch (editingRule.scope) {
        case "FIELD_SCOPE_PROPERTY":
            actionTypes = {
                ...actionTypes,
                "setFieldProperty": `Установить значение свойства ${editingRule.meta?.editingFieldProperty ?? ""}`
            }
            break
        default:
            throw new Error(`Unknown action scope "${editingRule.scope}"`)
    }
    return (
        <div className="my-2 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
            <select
                className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:flex-1"
                value={action.type}
                onChange={(e) => {
                    updateEditingRule(path, { ...action, type: e.target.value as ActionType } as ActionExpression)
                }}
            >
                {Object.entries(actionTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
            {action.type == "setFieldProperty" && (
                <div className="mb-3 form-check flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="form-check-input h-4 w-4 cursor-pointer"
                        checked={(action as SetFieldPropertyActionExpression).value}
                        onChange={e=>{
                            updateEditingRule(path, { ...action, value: e.target.checked } as SetFieldPropertyActionExpression)
                        }}
                    />
                    <label className="form-check-label text-sm text-slate-700">Enabled</label>
                </div>
            )}

        </div>
    );
}