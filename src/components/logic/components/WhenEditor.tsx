import GroupEditor from './GroupEditor.tsx';
import { type ObjPath, useEditorContext } from '../../../pages/Programs/editor/EditorContext.tsx';
import type { BooleanPropertyLogicDefinition, StepTransitionRule } from '../../../logic/logic.ts';
import type { Rule } from '../types.ts';

export default function WhenEditor() {
    const editingRule = useEditorContext((s) => s.editingRule)!;
    //const ruleType = "defaultValue" in editingRule.rule ? "property" : "expression"

    let rule: Rule | null = null;

    if (editingRule.scope === 'FIELD_SCOPE_PROPERTY') {
        rule = (editingRule.rule as BooleanPropertyLogicDefinition).rule;
    } else if (editingRule.scope === 'FIELD_SCOPE_DECISION') {
        rule = editingRule.rule as Rule;
    } else if (editingRule.scope === 'STEP_TRANSITION_SCOPE') {
        rule = {
            condition: (editingRule.rule as StepTransitionRule).when,
            actions: [],
        };
    } else if(editingRule.scope === 'LOOKUP_ROW_SCOPE') {
        rule = editingRule.rule as Rule
    } else {
        throw new Error(`Invalid scope "${editingRule.scope}"`);
    }

    let path: ObjPath | null;
    switch (editingRule.scope) {
        case 'STEP_TRANSITION_SCOPE':
            path = ['when'];
            break;
        default:
            path = ['condition'];
            break;
    }

    if (rule.condition.type !== 'and' && rule.condition.type !== 'or' && rule.condition.type !== 'noop') {
        throw new Error(`Invalid group rule`);
    }

    return (
        <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="sticky top-0 z-10 rounded-t-2xl border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold tracking-tight text-slate-900">WHEN</h3>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                        <GroupEditor rule={rule.condition} path={path} />
                    </div>
                </div>
            </div>
        </section>
    );
}
