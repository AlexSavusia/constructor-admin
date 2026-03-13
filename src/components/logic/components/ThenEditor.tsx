import type {Rule} from "../types.ts";
import {type ObjPath, useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";
import type {BooleanPropertyLogicDefinition} from "../../../logic/logic.ts";
import ActionRow from "./ActionRow.tsx";



export default function ThenEditor() {
    const editingRule = useEditorContext(s=>s.editingRule)!
    const updateEditingRule = useEditorContext(s=>s.updateEditingRule)!
    let rule: Rule | null = null;

    if(editingRule.scope === "FIELD_SCOPE_PROPERTY") {
        rule = (editingRule.rule as BooleanPropertyLogicDefinition).rule
    } else if(editingRule.scope === "FIELD_SCOPE_DECISION") {
        rule = (editingRule.rule as Rule);
    } else {
        throw new Error(`Invalid scope "${editingRule.scope}"`);
    }
    let path: ObjPath | null = null;
    switch(editingRule.scope) {
        default:
            path = ["actions"];
            break;
    }

    const addAction = () => {
        updateEditingRule([...path, rule?.actions.length ?? 0], {
            type: "noop"
        })
    }

    return (
        <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="sticky top-0 z-10 rounded-t-2xl border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                            THEN
                        </h3>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                        {rule.actions.map((action, idx) => (
                            <ActionRow action={action} path={[...path, idx]}/>
                        ))}
                        <button onClick={addAction}>+ Add action</button>
                    </div>
                </div>
            </div>
        </section>
    )
}