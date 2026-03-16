import {
    type AndExpression,
    type Boolean2OperandExpression,
    type BooleanExpression,
    isTwoOperandMode,
    isTwoOperandModeType,
    type NoopBooleanExpression,
    type NotEmptyExpression,
    type NotExpression,
    type OrExpression,
    type RefValueExpression,
} from '../../../logic/expression.ts';
import { type ObjPath, useEditorContext } from '../../../pages/Programs/editor/EditorContext.tsx';
import InputAutocomplete from '../../../components/ui/fieldsUIAdmin/InputSelect/InputSelect.tsx';
import { valueExpressionToString } from '../../ui/fieldsUIAdmin/InputSelect/parser.ts';
import { useState } from 'react';

export type ConditionRowProps = {
    rule: BooleanExpression;
    path: ObjPath;
};

const OPERATORS_LABELS: Record<Exclude<BooleanExpression['type'], 'and' | 'or'>, string> = {
    eq: 'equals',
    ne: 'not equals',
    gt: 'greater than',
    gte: 'greater than or equals',
    lt: 'less than',
    lte: 'less than or equals',
    isEmpty: 'isEmpty',
    notEmpty: 'nnot empty',
    not: 'not',
    in: 'in',
    noop: 'select operator',
};

type StupidFuck = Exclude<
    BooleanExpression,
    Boolean2OperandExpression | AndExpression | OrExpression | NotEmptyExpression | NotExpression | NoopBooleanExpression
>;
export default function ConditionRow({ rule, path }: ConditionRowProps) {
    const { scope } = useEditorContext((s) => s.editingRule)!;
    const updateEditingRule = useEditorContext((s) => s.updateEditingRule);
    const getAllContextVariables = useEditorContext((s) => s.getAllContextVariables);
    const twoOperand = isTwoOperandMode(rule);

    const firstArg = twoOperand ? (rule as Boolean2OperandExpression).left : (rule as StupidFuck).item;
    const [rawFirstArg, setRawFirstArg] = useState<string>(valueExpressionToString(firstArg));

    const secondArg = twoOperand ? (rule as Boolean2OperandExpression).right : null;
    const [rawSecondArg, setRawSecondArg] = useState<string>(secondArg ? valueExpressionToString(secondArg) : '');

    const contextVariablePaths = getAllContextVariables(scope);
    const allFields = {
        ...contextVariablePaths.fields,
        ...contextVariablePaths.variables,
        ...contextVariablePaths.constants,
    };
    const refTypeMap: Record<string, RefValueExpression['refType']> = {};
    for (const fk of Object.keys(contextVariablePaths.fields)) {
        refTypeMap[fk] = 'field';
    }
    for (const vk of Object.keys(contextVariablePaths.variables)) {
        refTypeMap[vk] = 'variable';
    }
    for (const ck of Object.keys(contextVariablePaths.constants)) {
        refTypeMap[ck] = 'const';
    }

    if (rule.type === 'noop') {
        return (
            <div className="my-2 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
                <p className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-[220px] lg:flex-none">
                    Ничего не делать
                </p>
            </div>
        );
    }

    return (
        <div className="my-2 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
            <InputAutocomplete
                referenceTypeMap={refTypeMap}
                className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:flex-1"
                placeholder="Пиши текст..."
                value={rawFirstArg}
                options={allFields}
                onChange={(ast, raw) => {
                    setRawFirstArg(raw);
                    if (ast) {
                        updateEditingRule(path, {
                            ...(rule as Boolean2OperandExpression),
                            left: ast,
                        });
                    }
                    console.log('onChange:', ast, raw);
                }}
            />
            <select
                className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-[220px] lg:flex-none"
                value={rule.type}
                onChange={(e) => {
                    if (twoOperand) {
                        // @ts-expect-error no error
                        if (isTwoOperandModeType(e.target.value)) {
                            // @ts-expect-error no error
                            updateEditingRule(path, { ...rule, type: e.target.value });
                        } else {
                            const nr = {
                                ...rule,
                                type: e.target.value,
                                // @ts-expect-error no error
                                item: rule.left,
                            };
                            // @ts-expect-error no error
                            delete nr.left;
                            // @ts-expect-error no error
                            updateEditingRule(path, nr);
                        }
                    } else {
                        // @ts-expect-error no error
                        if (!isTwoOperandModeType(e.target.value)) {
                            // @ts-expect-error no error
                            updateEditingRule(path, { ...rule, type: e.target.value });
                        } else {
                            const nr = {
                                ...rule,
                                type: e.target.value,
                                // @ts-expect-error no error
                                left: rule.item,
                            };
                            // @ts-expect-error no error
                            delete nr.item;
                            // @ts-expect-error no error
                            updateEditingRule(path, nr);
                        }
                    }
                }}
            >
                {Object.entries(OPERATORS_LABELS).map(([op, lbl]) => (
                    <option key={op} value={op}>
                        {lbl}
                    </option>
                ))}
            </select>
            {twoOperand && (
                <InputAutocomplete
                    referenceTypeMap={refTypeMap}
                    className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:flex-1"
                    placeholder="Пиши текст..."
                    value={rawSecondArg}
                    options={allFields}
                    onChange={(ast, raw) => {
                        setRawSecondArg(raw);
                        if (ast) {
                            updateEditingRule(path, {
                                ...(rule as Boolean2OperandExpression),
                                right: ast,
                            });
                        }
                        console.log('onChange:', ast, raw);
                    }}
                />
            )}
        </div>
    );
}
