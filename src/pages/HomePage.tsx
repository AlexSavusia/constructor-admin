import {type ObjPath, objPathFromString, objPathToString} from './Programs/editor/EditorContext.tsx';
import {createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {create, type StateCreator, useStore} from 'zustand';
import type {FormDefinition, InteractionDefinition, Key} from '../logic/type.ts';
import {ReactGridLayout, useContainerWidth} from 'react-grid-layout';
import type {FieldDefinition} from '../logic/field.ts';
import InputUI from '../components/ui/fieldsUI/Input/Input.tsx';
import type {ActionExpression, Rule} from '../components/logic/types.ts';
import type {BooleanExpression, ValueExpression} from '../logic/expression.ts';
import {useShallow} from 'zustand/react/shallow';
import RadioButtons, {type RadioItem} from '../components/ui/fieldsUI/RadioButtons/RadioButtons.tsx';
import SelectUI, {type Option} from '../components/ui/fieldsUI/Select/Select.tsx';
import SliderUI from '../components/ui/fieldsUI/Slider/SliderField.tsx';
import InputDate from '../components/ui/fieldsUI/InputDate/InputDate.tsx';
import type {StepTransitionRule} from '../logic/logic.ts';
import {TEST} from './test.ts';
import {subscribeWithSelector} from 'zustand/middleware';
import type {DictionaryRow} from "../api/types.ts";
import {getDictionaryRows} from "../api";

const getValueExpressionDependentPaths = (valExpr: ValueExpression): ObjPath => {
    switch (valExpr.__typ) {
        case 'ref': {
            switch (valExpr.refType) {
                case 'const':
                    return valExpr.path[0] == 'constants' ? valExpr.path : ['constants', ...valExpr.path];
                case 'field':
                    return ['steps', ...valExpr.path];
                case 'variable':
                    return ['variables', ...valExpr.path];
                default:
                    throw new Error(`Unknown refType ${JSON.stringify(valExpr)}`);
            }
        }
        case 'ast':
        case 'const':
        case 'func':
            return [];
        default:
            throw new Error(`Unrecognized value expression type ${JSON.stringify(valExpr)}`);
    }
};

const getBooleanExpressionDependentPaths = (expr: BooleanExpression): ObjPath[] => {
    switch (expr.type) {
        case 'and':
        case 'or':
            return expr.items.map((item) => getBooleanExpressionDependentPaths(item)).flat();
        case 'eq':
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
        case 'in':
        case 'ne':
            return [getValueExpressionDependentPaths(expr.left), getValueExpressionDependentPaths(expr.right)];
        case 'isEmpty':
            return [getValueExpressionDependentPaths(expr.item)];
        case 'not':
            return getBooleanExpressionDependentPaths(expr.item);
        case 'notEmpty':
            return [getValueExpressionDependentPaths(expr.item)];
        case 'noop':
            return [];
        default:
            throw new Error(`Unknown expr type ${JSON.stringify(expr)}`);
    }
};

const getActionExpressionDependentPaths = (expr: ActionExpression): ObjPath[] => {
    switch (expr.type) {
        case 'setValue':
            return [getValueExpressionDependentPaths(expr.value)];
        case 'setFieldProperty':
        case 'clearValue':
        case 'noop':
        case 'setFieldError':
            return [];
        default:
            throw new Error(`Unrecognized action type ${JSON.stringify(expr)}`);
    }
};

const getRuleDependentPaths = (rule: Rule): ObjPath[] => {
    const boolRes = getBooleanExpressionDependentPaths(rule.condition);
    const actionRes = rule.actions.map((a) => getActionExpressionDependentPaths(a)).flat();
    if (actionRes.length > 0) {
        return [...boolRes, ...actionRes];
    }
    return boolRes;
};

type InputValuePropType = string | number | readonly string[] | undefined | null;

export type FormContextValue = {
    currentStep: Key;
    nextStep: () => void;
    form: FormDefinition;
    useByPath: <T = unknown>(path: ObjPath) => T | null;
    useByPaths: (paths: ObjPath[]) => unknown[] | null;
    getDeps: (path: ObjPath) => ObjPath[];
    fieldsValues: Record<string, unknown>;
    variableValues: Record<string, unknown>;
    fieldsErrors: Record<string, string>;
    updateFieldValue: (path: ObjPath, value: unknown) => void;
    fieldsDeps: Record<string, ObjPath[]>;
    evalCondition: (rule: Rule) => boolean;
    evalAction: (action: ActionExpression, fieldKey: Key) => void;
    clearFieldErrors: (fieldKey: Key) => void;
    fieldRequired: Record<string, boolean>;
    submit: boolean;
    fieldEnabled: Record<string, boolean>;
    setFieldRequired: (fieldKey: Key, value: boolean) => void;
    setFieldEnabled: (fieldKey: Key, value: boolean) => void;
};

function getByPath<T>(obj: unknown, path: ObjPath): T {
    let current: unknown = obj;

    for (const key of path) {
        if (current == null) return undefined as T;
        // @ts-expect-error no error
        current = current[key];
    }

    return current as T;
}

function evalValue<T = unknown>(value: ValueExpression, context: FormContextValue): T {
    switch (value.__typ) {
        case 'const':
            return value.value as T;
        case 'ast': {
            const l = evalValue(value.left, context);
            const r = evalValue(value.left, context);
            switch (value.operator) {
                case 'add':
                    //@ts-expect-error i dont know how to deal with it for now
                    return (l + r) as T;
                case 'div':
                    //@ts-expect-error i dont know how to deal with it for now
                    return (l / r) as T;
                case 'mul':
                    //@ts-expect-error i dont know how to deal with it for now
                    return (l * r) as T;
                case 'sub':
                    //@ts-expect-error i dont know how to deal with it for now
                    return (l - r) as T;
                default:
                    throw new Error(`Unrecognized operator type ${JSON.stringify(value.left)}`);
            }
        }
        case 'ref': {
            if (value.path[0] === 'constants') {
                const p = value.path.includes('constants') ? value.path.slice(1, value.path.length) : value.path;
                return context.form.constants[objPathToString(p)].value as T;
            }
            if (value.path[0] === 'variables') {
                throw new Error('unimplemented');
                //return context.form.variables[objPathToString(value.path)].
            }
            return context.fieldsValues[objPathToString(['steps', ...value.path])] as T;
        }
        case 'func':
        default:
            throw new Error(`Unrecognized value expression ${JSON.stringify(value)}`);
    }
}

const evalCondition = (condition: BooleanExpression, context: FormContextValue): boolean => {
    switch (condition.type) {
        case 'and': {
            const results = condition.items.map((c) => evalCondition(c, context));
            return results.reduce((acc, item) => acc && item, true);
        }
        case 'or': {
            const results = condition.items.map((c) => evalCondition(c, context));
            return results.reduce((acc, item) => acc || item, false);
        }
        case 'notEmpty': {
            return !!evalValue(condition.item, context);
        }
        case 'isEmpty': {
            return !evalValue(condition.item, context);
        }
        case 'not': {
            return !evalCondition(condition.item, context);
        }
        case 'ne': {
            const l = evalValue(condition.left, context);
            const r = evalValue(condition.right, context);
            return l != r;
        }
        case 'eq': {
            const l = evalValue(condition.left, context);
            const r = evalValue(condition.right, context);
            return l == r;
        }
        case 'lte': {
            const l = evalValue<number>(condition.left, context);
            const r = evalValue<number>(condition.right, context);
            return l <= r;
        }
        case 'lt': {
            const l = evalValue<number>(condition.left, context);
            const r = evalValue<number>(condition.right, context);
            return l < r;
        }
        case 'gte': {
            const l = evalValue<number>(condition.left, context);
            const r = evalValue<number>(condition.right, context);
            return l >= r;
        }
        case 'gt': {
            const l = evalValue<number>(condition.left, context);
            const r = evalValue<number>(condition.right, context);
            return l > r;
        }
        case 'noop':
        case 'in':
        default:
            throw new Error(`Unrecognized condition type ${JSON.stringify(condition)}`);
    }
};

function evalActionExpression(
    action: ActionExpression,
    context: FormContextValue,
    selfFieldKey: Key,
    onSetError: (fieldKey: Key, text: string) => Partial<FormContextValue>,
    onSetFieldValue: (fieldKey: Key, value: unknown) => Partial<FormContextValue>,
    onClearField: (fieldKey: Key) => Partial<FormContextValue>,
    onSetFieldProperty: (
        fieldKey: Key,
        propertyKey: 'enabled' | 'visibility' | 'required' | 'value',
        value: boolean
    ) => Partial<FormContextValue>
): Partial<FormContextValue> {
    switch (action.type) {
        case 'setFieldError': {
            return onSetError(selfFieldKey, action.text);
        }
        case 'clearValue': {
            return onClearField(selfFieldKey);
        }
        case 'setValue': {
            return onSetFieldValue(selfFieldKey, evalValue(action.value, context));
        }
        case 'setFieldProperty': {
            return onSetFieldProperty(
                selfFieldKey,
                action.property as 'enabled' | 'visibility' | 'required' | 'value',
                action.value
            );
        }
        case 'noop':
        default:
            throw new Error(`Unrecognized action type ${JSON.stringify(action)}`);
    }
}

const createFormContext = (initialState: FormDefinition) => {
    const fieldsValues = Object.entries(initialState.steps)
        .map((st) => Object.entries(st[1].fields).map((f) => [objPathToString(['steps', st[0], 'fields', f[0]]), undefined]))
        .flat()
        .reduce((acc, item) => {
            // @ts-expect-error no error
            acc[item[0]] = item[1];
            return acc;
        }, {});
    const fieldsRequired = Object.entries(initialState.steps)
        .map((st) =>
            Object.entries(st[1].fields).map((f) => [
                objPathToString(['steps', st[0], 'fields', f[0]]),
                f[1].logic?.required?.defaultValue ?? false,
            ])
        )
        .flat()
        .reduce((acc, item) => {
            // @ts-expect-error no error
            acc[item[0]] = item[1];
            return acc;
        }, {});

    const fieldsEnabled = Object.entries(initialState.steps)
        .map((st) =>
            Object.entries(st[1].fields).map((f) => [
                objPathToString(['steps', st[0], 'fields', f[0]]),
                f[1].logic?.enabled?.defaultValue ?? true,
            ])
        )
        .flat()
        .reduce((acc, item) => {
            // @ts-expect-error no error
            acc[item[0]] = item[1];
            return acc;
        }, {});

    const fieldsDeps = (): Record<string, ObjPath[]> => {
        return Object.keys(fieldsValues)
            .filter((key) => {
                const path = objPathFromString(key);
                const fieldDef = getByPath<FieldDefinition>(initialState, path);
                return fieldDef?.logic != undefined; //TODO this is inefficient
            })
            .map((key) => {
                const path = objPathFromString(key);
                const fieldDef = getByPath<FieldDefinition>(initialState, path);

                const { visibility, validation, enabled, required /* value */ } = fieldDef.logic!;

                const dependentPaths: ObjPath[] = [];

                if (visibility) {
                    const r = getRuleDependentPaths(visibility.rule);
                    if (r.length) dependentPaths.push(...r);
                }

                if (validation) {
                    const r = getRuleDependentPaths(validation);
                    if (r.length) dependentPaths.push(...r);
                }

                if (enabled) {
                    const r = getRuleDependentPaths(enabled.rule);
                    if (r.length) dependentPaths.push(...r);
                }

                if (required) {
                    const r = getRuleDependentPaths(required.rule);
                    if (r.length) dependentPaths.push(...r);
                }

                if('dictId' in fieldDef.settingsValues) {
                    const lookups = initialState.lookups[fieldDef.settingsValues['dictId'] as string] ?? []
                    const lks = Object.entries(lookups).filter(lk=>lk[1].baseFilter).map(lk=>getRuleDependentPaths(lk[1]!.baseFilter!))
                    if(lks.length) dependentPaths.push(...(lks.flat()));
                }

                // TODO
                // if(value) {
                //
                // }
                return [key, dependentPaths];
            })
            .reduce((acc, [k, v]) => {
                if (v.length == 0) return acc;
                // @ts-expect-error no error
                acc[k] = v.filter((itm) => !!itm.length);
                return acc;
            }, {});
    };

    const selector: StateCreator<FormContextValue, [['zustand/subscribeWithSelector', never]], [], FormContextValue> = (
        set,
        get
    ) => ({
        variableValues: {},
        submit: false,
        fieldRequired: fieldsRequired,
        fieldEnabled: fieldsEnabled,
        setFieldEnabled: (key, value) =>
            set((state) => ({
                fieldEnabled: {
                    ...state.fieldEnabled,
                    [key]: value,
                },
            })),
        setFieldRequired: (key, value) =>
            set((state) => ({
                fieldRequired: {
                    ...state.fieldRequired,
                    [key]: value,
                },
            })),
        fieldsErrors: {},
        currentStep: initialState.firstStepKey,
        form: initialState,
        fieldsValues: fieldsValues,
        fieldsDeps: fieldsDeps(),
        useByPath: function <T = unknown>(path: ObjPath) {
            return getByPath<T>(get(), path);
        },
        useByPaths: (paths) => {
            const state = get();
            return paths.map((path) => getByPath(state, ['form', ...path]));
        },
        getDeps: (path) => {
            return get().fieldsDeps[objPathToString(path)] ?? [];
        },
        updateFieldValue: (path: ObjPath, value: unknown) => {
            // debugger
            set((state) => ({
                fieldsValues: {
                    ...state.fieldsValues,
                    [objPathToString(path)]: value,
                },
            }));
        },
        evalCondition: (rule) => {
            const st = get();
            return evalCondition(rule.condition, st);
        },
        evalAction: (action, fieldKey) =>
            set((state) => {
                return evalActionExpression(
                    action,
                    state,
                    fieldKey,
                    (fieldKey, error) => {
                        return {
                            fieldsErrors: {
                                ...state.fieldsErrors,
                                [fieldKey]: error,
                            },
                        };
                    },
                    (fieldKey, value) => {
                        return {
                            fieldsValues: {
                                ...state.fieldsValues,
                                [fieldKey]: value,
                            },
                        };
                    },
                    (fieldKey) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { [fieldKey]: _, ...rest } = state.fieldsValues;
                        return {
                            fieldsValues: rest,
                        };
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    (_fieldKey, _propertyKey) => {
                        return {};
                    }
                );
            }),
        clearFieldErrors: (fieldKey: Key) =>
            set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [fieldKey]: _, ...rest } = state.fieldsErrors;
                return {
                    fieldsErrors: rest,
                };
            }),
        nextStep: () =>
            set((state) => {
                // debugger
                const { transition } = state.form.steps[state.currentStep];
                const nextStepTarget = transition.rules.reduce<StepTransitionRule | undefined>((acc, item) => {
                    if (acc) return acc;
                    const evalRes = evalCondition(item.when, state);
                    if (evalRes) return item;
                }, undefined);
                if (nextStepTarget) {
                    return {
                        currentStep: nextStepTarget.targetStep,
                    };
                }
                // else {
                //     return {
                //         currentStep: transition.defaultStep,
                //     }
                // }
                return {
                    submit: true,
                };
            }),
    });

    return create<FormContextValue>()(subscribeWithSelector(selector));
};

const FormContext = createContext<ReturnType<typeof createFormContext> | null>(null);

type FormProvider = {
    initialState: FormDefinition;
    children: ReactNode;
};

function FormProvider({ initialState, children }: FormProvider) {
    const storeRef = useRef<ReturnType<typeof createFormContext> | null>(null);

    // eslint-disable-next-line react-hooks/refs
    if (!storeRef.current) {
        storeRef.current = createFormContext(initialState);
    }

    return (
        // eslint-disable-next-line react-hooks/refs
        <FormContext.Provider value={storeRef.current}>{children}</FormContext.Provider>
    );
}

export function useFormContext<T>(selector: (state: FormContextValue) => T) {
    const store = useContext(FormContext);
    if (!store) throw new Error('useFormContext must be used inside FormProvider');
    return useStore(store, selector);
}

type FieldRendererProps = {
    field: FieldDefinition;
    path: ObjPath;
};



function InputFieldRenderer({ field, path }: FieldRendererProps) {
    const isSelectMulti = Boolean(field.settingsValues['multiselect'] ?? false);
    const isDictSelectMulti = Boolean(field.settingsValues['multiselect'] ?? false);
    const pathString = objPathToString(path);
    const updateFieldValue = useFormContext((s) => s.updateFieldValue);
    const depPaths = useFormContext(useShallow((s) => s.fieldsDeps[pathString] ?? []));
    const deps = useFormContext(useShallow((state) => {

        return depPaths.filter(p=>p[0] != 'constants').map((depPath) => state.fieldsValues[objPathToString(depPath)])
    }));
    const selfValue = useFormContext((s) => s.fieldsValues[pathString]);

    const evalCondition = useFormContext((s) => s.evalCondition);
    const evalAction = useFormContext((s) => s.evalAction);
    const clearFieldErrors = useFormContext((s) => s.clearFieldErrors);
    const selfError = useFormContext((s) => s.fieldsErrors[field.key]);
    const selfRequired = useFormContext((s) => s.fieldRequired[objPathToString(path)]);
    const selfEnabled = useFormContext((s) => s.fieldEnabled[objPathToString(path)]);
    const setFieldRequired = useFormContext((s) => s.setFieldRequired);
    const setFieldEnabled = useFormContext((s) => s.setFieldEnabled);

    const lookups = useFormContext(s=> {
        if('dictId' in field.settingsValues) {
            return s.form.lookups[field.settingsValues['dictId'] as string]
        }
        return null;
    })

    const [selectDictOpts, setSelectDictOpts] = useState<DictionaryRow[] | null>(null)

    useEffect(() => {
        if(lookups && !selectDictOpts) {
            const dictRowKeys = Object.keys(lookups);
            getDictionaryRows({page: 1, size: 1000}, field.settingsValues['dictId'] as string)
                .then(dictRows=>setSelectDictOpts(dictRows.data.filter(x=>dictRowKeys.includes(x.id))))
        }
    }, []);
    type Opt = DictionaryRow & {label: string}
    //eslint-disable-next-line react-hooks/preserve-manual-memoization
    const availableDictSelectOptions = useCallback(() => selectDictOpts?.filter(opt =>
        {

            if(lookups[opt.id].baseFilter) {
                const evalRes = evalCondition(lookups[opt.id]!.baseFilter!)
                return evalRes
            }
            return true
        }
    ).map(opt=>({...opt, label: lookups[opt.id]!.label}) as Opt), [selectDictOpts, lookups, evalCondition, deps]);


    function handleFieldUpdate(value: unknown) {
        updateFieldValue(path, value);
    }

    useEffect(() => {
        const { logic } = field;

        if (logic) {
            if (logic.validation) {
                // debugger
                const evalRes = evalCondition(logic.validation);
                if (evalRes) {
                    logic.validation.actions.forEach((action) => {
                        evalAction(action, field.key);
                    });
                } else {
                    clearFieldErrors(field.key);
                }
            }
            if (logic.required && logic.required.rule.condition.type != 'noop') {
                const evalRes = evalCondition(logic.required.rule);
                setFieldRequired(pathString, evalRes);
            }
            if (logic.enabled && logic.enabled.rule.condition.type != 'noop') {
                const evalRes = evalCondition(logic.enabled.rule);
                setFieldEnabled(pathString, evalRes);
            }
        }
    }, [deps, selfValue, pathString, field]);

    if (!selfEnabled) {
        return null;
    }

    // debugger
    switch (field.control) {
        case 'input': {
            switch (
                field.settingsValues['fieldType'] as
                    | 'description'
                    | 'input'
                    | 'textarea'
                    | 'checkbox'
                    | 'radio'
                    | 'switch'
                    | 'date'
                    | 'select'
                    | 'file'
                    | 'agree'
                    | 'slider'
                    | 'dictSelect'
            ) {
                case 'input': {
                    return (
                        <div className="cell h-full min-w-0 px-4 py-3 ">
                            <InputUI
                                required={selfRequired}
                                value={selfValue as InputValuePropType}
                                onChange={(e) => handleFieldUpdate(e.target.value)}
                                label={field.settingsValues['label'] as string}
                            />
                            {selfError && !!selfValue && (
                                <p className="mt-1 text-sm leading-4 text-red-500 break-words">{selfError}</p>
                            )}
                        </div>
                    );
                }
                case 'slider': {
                    const min = Number(field.settingsValues['min'] ?? 0);
                    const max = Number(field.settingsValues['max'] ?? 100);
                    const step = Number(field.settingsValues['step'] ?? 1);
                    const showValue = Boolean(field.settingsValues['showValue'] ?? true);
                    const inputBox = Boolean(field.settingsValues['inputBox'] ?? false);

                    return (
                        <div className="cell h-full min-w-0 px-4 py-3 ">
                            <SliderUI
                                label={field.settingsValues['label'] as string}
                                required={selfRequired}
                                value={Number(selfValue ?? min)}
                                min={min}
                                max={max}
                                step={step}
                                showValue={showValue}
                                inputBox={inputBox}
                                onChange={(value) => handleFieldUpdate(value)}
                                disabled={!selfEnabled}
                            />
                            {selfError && selfValue !== undefined && (
                                <p className="mt-1 text-sm leading-4 text-red-500 break-words">{selfError}</p>
                            )}
                        </div>
                    );
                }
                case 'description':
                    return (
                        <div className="cell h-full min-w-0 px-4 py-3 overflow-hidden">
                            <p className="text-3xl leading-5 text-gray-600 break-words">
                                {field.settingsValues['text'] as string}
                            </p>
                        </div>
                    );
                case 'radio':
                    return (
                        <div className="cell h-full min-w-0 px-4 py-3 overflow-hidden">
                            <RadioButtons
                                currentValue={selfValue as string | number | undefined}
                                name={field.settingsValues['name'] as string}
                                data={field.settingsValues['options'] as RadioItem[]}
                                onChange={(e) => handleFieldUpdate(e)}
                                title={field.settingsValues['label'] as string}
                                theme={'param'}
                            />
                        </div>
                    );
                case 'select':
                    return (
                        <div className="cell h-full min-w-0 px-4 py-3">
                            {isSelectMulti ? (
                                <SelectUI
                                    label={field.settingsValues['label'] as string}
                                    options={field.settingsValues['options'] as Option[]}
                                    value={Array.isArray(selfValue) ? selfValue : []}
                                    onChange={(value) => handleFieldUpdate(value)}
                                    multiple={true}
                                />
                            ) : (
                                <SelectUI
                                    label={field.settingsValues['label'] as string}
                                    options={field.settingsValues['options'] as Option[]}
                                    value={(selfValue as string | number | null) ?? null}
                                    onChange={(value) => handleFieldUpdate(value)}
                                />
                            )}
                        </div>
                    );
                case 'date':
                    return (
                        <div className="cell h-full min-w-0 px-4 py-3 overflow-hidden">
                            <InputDate
                                label={field.settingsValues['label'] as string}
                                value={selfValue as string}
                                onChange={(e) => handleFieldUpdate(e)}
                            />
                        </div>
                    );
                case 'agree':
                    return (
                        <div className="cell h-full min-w-0 px-4 py-3 overflow-hidden d-flex flex-col">
                            <p className="text-gray-700 text-3xl leading-relaxed text-center">
                                {' '}
                                {field.settingsValues['text'] as string}
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {' '}
                                {field.settingsValues['description'] as string}
                            </p>
                        </div>
                    );
                case 'dictSelect':
                    return (
                        <div className="cell h-full min-w-0 px-4 py-3">
                            {isDictSelectMulti ? (
                                <SelectUI
                                    label={field.settingsValues['label'] as string}
                                    options={availableDictSelectOptions}
                                    value={Array.isArray(selfValue) ? selfValue : []}
                                    onChange={(value) => handleFieldUpdate(value)}
                                    multiple={true}
                                />
                            ) : (
                                <SelectUI
                                    label={field.settingsValues['label'] as string}
                                    options={availableDictSelectOptions}
                                    value={(selfValue as string | number | null) ?? null}
                                    onChange={(value) => handleFieldUpdate(value)}
                                />
                            )}
                        </div>
                    );
                case 'textarea':
                case 'checkbox':
                case 'switch':
                case 'file':
                default:
                    throw new Error(`Unknown field inputType ${field.settingsValues['fieldType']}`);
            }
            break;
        }
        case 'number':
        case 'select':
        case 'textarea':
        case 'multiselect':
        case 'array':
        case 'checkbox':
        default:
            throw new Error(`Unknown field control type ${field.control}`);
    }

    return (
        <div className="cell h-full min-w-0 px-4 py-3 overflow-hidden">
            <p>{field.key}</p>
            <p>{path.join('.')}</p>
        </div>
    );
}

function OutputFieldRenderer({ field, path }: FieldRendererProps) {
    return (
        <div className="cell h-full min-w-0 px-4 py-3 overflow-hidden">
            <p>{field.key}</p>
            <p>{path.join('.')}</p>
        </div>
    );
}

export function useFormStoreApi() {
    const store = useContext(FormContext);
    if (!store) throw new Error('useFormStoreApi must be used inside FormProvider');
    return store;
}

function InteractionsHandler() {
    const store = useFormStoreApi();
    const interactions = useFormContext((s) => s.form.interactions);
    const resolveDependentFields = () => {
        const paths = Object.entries(interactions)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([_key, interaction]) => Object.entries(interaction.dependentFields).map((i) => i[1]))
            .flat();
        return paths;
    };

    const handleInteraction = async (as: AbortSignal, interaction: InteractionDefinition, fields: Record<string, unknown>) => {
        const dfps = interaction.dependentFields.map((p) => objPathToString(p));
        const vals = Object.entries(fields)
            .filter((v) => dfps.includes(v[0]))
            .reduce((acc, item) => {
                // @ts-expect-error no error
                acc[item[0]] = item[1];
                return acc;
            }, {});
        return await interaction.execute(as, vals);
    };

    const shouldFireUpdate = (
        interaction: InteractionDefinition,
        current: Record<string, unknown>,
        prev: Record<string, unknown>
    ): boolean => {
        const dfps = interaction.dependentFields.map((p) => objPathToString(p));
        const prevVals = Object.entries(prev)
            .filter((v) => dfps.includes(v[0]))
            .reduce((acc, item) => {
                // @ts-expect-error no error
                acc[item[0]] = item[1];
                return acc;
            }, {});
        const currVals = Object.entries(current).filter((v) => dfps.includes(v[0]));

        for (const [key, value] of currVals) {
            if (prevVals[key] != value) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        let controller: AbortController | null = null;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        let firstPrev: Record<string, unknown>[] | null = null;
        let lastCurrent: Record<string, unknown>[] | null = null;

        const unsubscribe = store.subscribe(
            (state) => [state.fieldsValues, state.variableValues, state.form.constants],
            async (current, prev) => {
                if (!firstPrev) {
                    firstPrev = prev;
                }
                lastCurrent = current;

                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(() => {
                    if (!firstPrev || !lastCurrent) return;
                    controller?.abort();
                    controller = new AbortController();
                    const signal = controller.signal;

                    const c = { ...lastCurrent[0], ...lastCurrent[1], ...lastCurrent[2] };
                    const p = { ...firstPrev[0], ...firstPrev[1], ...firstPrev[2] };

                    firstPrev = null;
                    lastCurrent = null;

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    for (const [_, interaction] of Object.entries(interactions)) {
                        if (shouldFireUpdate(interaction, c, p)) {
                            handleInteraction(signal, interaction, c).then((data) => {
                                store.setState(data);
                            });
                        }
                    }
                }, 300);
            }
        );
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            controller?.abort();
            unsubscribe();
        };
    }, []);

    return <></>;
}

function FormRenderer() {
    const cols = 3;
    const rowHeight = 26; // 11.5;
    const currentStepKey = useFormContext((s) => s.currentStep);
    const currentStep = useFormContext((s) => s.form.steps[currentStepKey]);
    const { width, containerRef, mounted } = useContainerWidth();
    // /const s = useFormContext(s=>s)
    const fields = useMemo(() => Object.entries(currentStep.fields).map((v) => v[1]), [currentStep]);
    const fieldsLayout = useMemo(() => fields.map((f) => f.layout), [fields]);
    const fieldsValues = useFormContext((s) => s.fieldsValues);
    const nextStep = useFormContext((s) => s.nextStep);
    const shouldSubmit = useFormContext((s) => s.submit);

    useEffect(() => {
        if (!shouldSubmit) return;
    }, [shouldSubmit]);

    if (shouldSubmit) {
        return <p>form submitted</p>;
    }

    return (
        <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 py-6">
            {mounted && (
                <form
                    className="w-full"
                    onSubmit={(e) => {
                        e.preventDefault();
                        nextStep();
                    }}
                >
                    <div className="relative w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 ">
                        <ReactGridLayout
                            width={width}
                            gridConfig={{ cols, rowHeight }}
                            dragConfig={{ enabled: false }}
                            resizeConfig={{ enabled: false }}
                            // compactor={verticalCompactor}
                            layout={fieldsLayout}
                        >
                            {fields.map((item) => (
                                <div key={item.key} className="h-full min-w-0">
                                    {item.fieldType == 'input' ? (
                                        <InputFieldRenderer
                                            key={item.key}
                                            field={item}
                                            path={['steps', currentStepKey, 'fields', item.key]}
                                        />
                                    ) : (
                                        <OutputFieldRenderer
                                            key={item.key}
                                            field={item}
                                            path={['steps', currentStepKey, 'fields', item.key]}
                                        />
                                    )}
                                </div>
                            ))}
                        </ReactGridLayout>
                        <button
                            type="submit"
                            className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Next
                        </button>
                    </div>
                </form>
            )}
            <InteractionsHandler />
        </div>
    );
}

export default function HomePage() {
    return (
        <FormProvider initialState={TEST}>
            <FormRenderer />
        </FormProvider>
    );
}
