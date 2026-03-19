import type { Rule } from '../types.ts';
import { type ObjPath, objPathToString, useEditorContext } from '../../../pages/Programs/editor/EditorContext.tsx';
import type { BooleanPropertyLogicDefinition, StepTransitionRule } from '../../../logic/logic.ts';
import ActionRow from './ActionRow.tsx';
import { useShallow } from 'zustand/react/shallow';

export default function ThenEditor() {
    const editingRule = useEditorContext((s) => s.editingRule)!;
    const updateEditingRule = useEditorContext((s) => s.updateEditingRule)!;
    const stepKeys = useEditorContext(
        useShallow((state) => {
            return Object.entries(state.form.steps)
                .map(([key, value]) => [key, value.title])
                .reduce<Record<string, string>>((acc, item) => {
                    acc[item[0]] = item[1];
                    return acc;
                }, {});
        })
    );
    let rule: Rule | null = null;

    if (editingRule.scope === 'FIELD_SCOPE_PROPERTY') {
        rule = (editingRule.rule as BooleanPropertyLogicDefinition).rule;
    } else if (editingRule.scope === 'FIELD_SCOPE_DECISION') {
        rule = editingRule.rule as Rule;
    } else if (editingRule.scope === 'STEP_TRANSITION_SCOPE') {
        //@ts-expect-error error
        rule = editingRule.rule as StepTransitionRule;
    } else {
        throw new Error(`Invalid scope "${editingRule.scope}"`);
    }

    let path: ObjPath | null = null;
    switch (editingRule.scope) {
        default:
            path = ['actions'];
            break;
    }

    const addAction = () => {
        if (editingRule.scope != 'STEP_TRANSITION_SCOPE') {
            updateEditingRule([...path, rule?.actions?.length ?? 0], {
                type: 'noop',
            });
        } else {
            //@ts-expect-error basically sets targetStep to Object.entries(stepKeys)[0][0]
            updateEditingRule(['targetStep'], Object.entries(stepKeys)[0][0]);
        }
    };

    return (
        <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="sticky top-0 z-10 rounded-t-2xl border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold tracking-tight text-slate-900">THEN</h3>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mx-auto max-w-6xl">
                    {editingRule.scope != 'STEP_TRANSITION_SCOPE' && (
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                            {rule?.actions &&
                                rule?.actions?.map((action, idx) => (
                                    <ActionRow key={objPathToString([...path, idx])} action={action} path={[...path, idx]} />
                                ))}
                            <button onClick={addAction}>+ Add action</button>
                        </div>
                    )}
                    {editingRule.scope == 'STEP_TRANSITION_SCOPE' && (
                        <div className="mb-3 form-check flex items-center gap-2">
                            <select
                                className="form-control form-control-sm"
                                style={{ width: 220 }}
                                value={(editingRule.rule as StepTransitionRule).targetStep}
                                onChange={(e) => {
                                    //@ts-expect-error basically sets targetStep to Object.entries(stepKeys)[0][0]
                                    updateEditingRule(['targetStep'], e.target.value);
                                }}
                            >
                                {Object.entries(stepKeys).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
