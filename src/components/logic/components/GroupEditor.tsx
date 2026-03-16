import ConditionRow from './ConditionRow.tsx';
import {
    type AndExpression,
    type NoopBooleanExpression,
    type NotEmptyExpression,
    type OrExpression
} from '../../../logic/expression.ts';
import { findByPath, type ObjPath, useEditorContext } from '../../../pages/Programs/editor/EditorContext.tsx';
import type { BooleanPropertyLogicDefinition } from '../../../logic/logic.ts';
import type { Rule } from '../types.ts';
export type GroupEditorProps = {
    rule: AndExpression | OrExpression | NoopBooleanExpression;
    path: ObjPath;
};

export default function GroupEditor({ rule, path }: GroupEditorProps) {
    const { rule: editingRuleUnknown } = useEditorContext((s) => s.editingRule)!;
    const editingRule =
        'defaultValue' in editingRuleUnknown
            ? (editingRuleUnknown as BooleanPropertyLogicDefinition).rule
            : (editingRuleUnknown as Rule);
    const updateEditingRule = useEditorContext((s) => s.updateEditingRule);
    const addGroup = () => {
        const newGroup: AndExpression | OrExpression = {
            id: crypto.randomUUID(),
            type: 'and',
            items: [],
        };
        rule.items.push(newGroup);
        updateEditingRule(path, rule);
    };

    const addCondition = () => {
        const newCondition: NotEmptyExpression = {
            id: crypto.randomUUID(),
            type: 'notEmpty',
            item: {
                __typ: "ref",
                path: ['constants', 'name'],
                refType: 'const',
            },
        };
        rule.items.push(newCondition);
        updateEditingRule(path, rule);
    };
    const isRoot = path.length === 0;

    const deleteItem = (idx: number) => {
        const nr = {
            ...rule,
            items: rule.items.filter((_, i) => i !== idx),
        };
        updateEditingRule(path, nr);
    };

    // if ((rule as unknown as NoopBooleanExpression).type === "noop") {
    //     return (
    //         <div className="my-2 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
    //             <p className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-[220px] lg:flex-none">
    //                 Ничего не делать
    //             </p>
    //         </div>
    //     )
    // }

    return (
        <div className={!isRoot ? 'mt-4 border-l-2 border-slate-200 pl-4' : ''}>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="hidden h-9 w-1 rounded-full bg-slate-300 sm:block" />

                        <select
                            value={rule.type}
                            onChange={(e) => {
                                const fuck = path.length == 1 ? [] : path.slice(1, path.length);
                                updateEditingRule(path, {
                                    ...(findByPath(editingRule.condition, fuck) as AndExpression | OrExpression),
                                    type: e.target.value as 'or' | 'and' | 'noop',
                                });
                            }}
                            className="min-w-[220px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="and">ALL conditions are met</option>
                            <option value="or">ANY of the following</option>
                            <option value="noop">Select condition</option>
                        </select>
                        <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
                            {rule.type != 'noop' ? rule?.items?.length : 0} item{(rule.type != 'noop'  && rule?.items?.length === 1) ? '' : 's'}
                        </span>
                    </div>
                </div>
                <div className="space-y-3">
                    {rule.type != 'noop' && rule.items.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                            No conditions yet. Add a condition or nested group.
                        </div>
                    )}
                    {rule.type != 'noop' && rule.items.map((child, index) =>
                        child.type !== 'and' && child.type !== 'or' ? (
                            <div key={child.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <ConditionRow rule={child} path={[...path, 'items', index]} />
                                <button onClick={() => deleteItem(index)}>Delete condition</button>
                            </div>
                        ) : (
                            <div key={child.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                                <GroupEditor rule={child} path={[...path, 'items', index]} />
                                <div className="mt-3 flex justify-end">
                                    <button type="button" onClick={() => deleteItem(index)}>
                                        Delete group
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                    <button
                        disabled={rule.type == 'noop'}
                        type="button"
                        onClick={addCondition}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
                    >
                        + Add condition
                    </button>

                    <button
                        disabled={rule.type == 'noop'}
                        type="button"
                        onClick={addGroup}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
                    >
                        + Add group
                    </button>
                </div>
            </div>
        </div>
    );
}
