import { type ObjPath, objPathFromString, objPathToString } from './Programs/editor/EditorContext.tsx';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
import { createStore, type StoreApi, useStore } from 'zustand';
import type { FormDefinition, Key } from '../logic/type.ts';
import { ReactGridLayout, useContainerWidth } from 'react-grid-layout';
import type { FieldDefinition } from '../logic/field.ts';
import InputUI from '../components/ui/fieldsUI/Input/Input.tsx';
import type { ActionExpression, Rule } from '../components/logic/types.ts';
import type { BooleanExpression, ValueExpression } from '../logic/expression.ts';
import { useShallow } from 'zustand/react/shallow';
import RadioButtons, { type RadioItem } from '../components/ui/fieldsUI/RadioButtons/RadioButtons.tsx';
import SelectUI, { type Option } from '../components/ui/fieldsUI/Select/Select.tsx';
import InputDate from '../components/ui/fieldsUI/InputDate/InputDate.tsx';

const getValueExpressionDependentPaths = (valExpr: ValueExpression): ObjPath => {
    switch (valExpr.__typ) {
        case 'ref': {
            switch (valExpr.refType) {
                case 'const':
                    return ['constants', ...valExpr.path];
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

type InputValuePropType = string | number | readonly string[] | undefined;

type FormContextValue = {
    currentStep: Key;
    form: FormDefinition;
    useByPath: <T = unknown>(path: ObjPath) => T | null;
    useByPaths: (paths: ObjPath[]) => unknown[] | null;
    getDeps: (path: ObjPath) => ObjPath[];
    fieldsValues: Record<string, unknown>;
    fieldsErrors: Record<string, string>;
    updateFieldValue: (path: ObjPath, value: unknown) => void;
    fieldsDeps: Record<string, ObjPath[]>;
    evalCondition: (rule: Rule) => boolean;
    evalAction: (action: ActionExpression, fieldKey: Key) => void;
    clearFieldErrors: (fieldKey: Key) => void;
    fieldRequired: Record<string, boolean>;
    fieldEnabled: Record<string, boolean>;
    setFieldRequired: (fieldKey: Key, value: boolean) => void;
    setFieldEnabled: (fieldKey: Key, value: boolean) => void;
};

function getByPath<T = unknown>(obj: unknown, path: ObjPath): T {
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
                return context.form.constants[objPathToString(value.path)].value as T;
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

const createFormContext = (initialState: FormDefinition): StoreApi<FormContextValue> => {
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

                const dependentPaths = [];

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
    return createStore<FormContextValue>((set, get) => ({
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
        useByPath: function <T>(path: ObjPath) {
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
                    (fieldKey, propertyKey) => {
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
    }));
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
    const pathString = objPathToString(path);
    const updateFieldValue = useFormContext((s) => s.updateFieldValue);
    const depPaths = useFormContext(useShallow((s) => s.fieldsDeps[pathString] ?? []));
    const deps = useFormContext(useShallow((state) => depPaths.map((depPath) => state.fieldsValues[objPathToString(depPath)])));
    const selfValue = useFormContext((s) => s.fieldsValues[pathString]);

    const evalCondition = useFormContext((s) => s.evalCondition);
    const evalAction = useFormContext((s) => s.evalAction);
    const clearFieldErrors = useFormContext((s) => s.clearFieldErrors);
    const selfError = useFormContext((s) => s.fieldsErrors[field.key]);
    const selfRequired = useFormContext((s) => s.fieldRequired[objPathToString(path)]);
    const selfEnabled = useFormContext((s) => s.fieldEnabled[objPathToString(path)]);
    const setFieldRequired = useFormContext((s) => s.setFieldRequired);
    const setFieldEnabled = useFormContext((s) => s.setFieldEnabled);

    function handleFieldUpdate(value: unknown) {
        updateFieldValue(path, value);
    }

    useEffect(() => {
        const { logic } = field;

        if (logic) {
            if (logic.validation) {
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
                setFieldRequired(field.key, evalRes);
            }
            if (logic.enabled && logic.enabled.rule.condition.type != 'noop') {
                const evalRes = evalCondition(logic.enabled.rule);
                setFieldEnabled(field.key, evalRes);
            }
        }

        console.log(pathString, deps);
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
            ) {
                case 'input': {
                    return (
                        <div>
                            <p>{field.key as string}</p>
                            <InputUI
                                required={selfRequired}
                                value={selfValue as InputValuePropType}
                                onChange={(e) => handleFieldUpdate(e.target.value)}
                                label={field.settingsValues['label'] as string}
                            />
                            {selfError && !!selfValue && <p>{selfError}</p>}
                        </div>
                    );
                }
                case 'description':
                    return (
                        <div>
                            <p>{field.key as string}</p>
                            <p>{field.settingsValues['text'] as string}</p>
                        </div>
                    );
                case 'radio':
                    return (
                        <div>
                            <p>{field.key as string}</p>
                            <RadioButtons
                                currentValue={selfValue as string | number | undefined}
                                name={field.settingsValues['name'] as string}
                                data={field.settingsValues['options'] as RadioItem[]}
                                onChange={(e) => handleFieldUpdate(e)}
                            />
                        </div>
                    );
                case 'select':
                    return (
                        <div>
                            <p>{field.key as string}</p>
                            <SelectUI
                                label={field.settingsValues['label'] as string}
                                options={field.settingsValues['options'] as Option[]}
                                value={selfValue as InputValuePropType}
                                onChange={(e) => handleFieldUpdate(e.target.value)}
                            />
                        </div>
                    );
                case 'date':
                    return (
                        <div>
                            <p>{field.key as string}</p>
                            <InputDate
                                label={field.settingsValues['label'] as string}
                                value={selfValue as string}
                                onChange={(e) => handleFieldUpdate(e)}
                            />
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
        <div>
            <p>{field.key}</p>
            <p>{path.join('.')}</p>
        </div>
    );
}

function OutputFieldRenderer({ field, path }: FieldRendererProps) {
    return (
        <div>
            <p>{field.key}</p>
            <p>{path.join('.')}</p>
        </div>
    );
}

function FormRenderer() {
    const cols = 3;
    const rowHeight = 25; // 11.5;
    const currentStepKey = useFormContext((s) => s.currentStep);
    const currentStep = useFormContext((s) => s.form.steps[currentStepKey]);
    const { width, containerRef, mounted } = useContainerWidth();
    const fields = useMemo(() => Object.entries(currentStep.fields).map((v) => v[1]), [currentStep]);
    const fieldsLayout = useMemo(() => fields.map((f) => f.layout), [fields]);

    return (
        <div ref={containerRef} className="card-body w-100">
            {mounted && (
                <div className="position-relative rounded">
                    <ReactGridLayout
                        width={width}
                        gridConfig={{ cols, rowHeight }}
                        dragConfig={{ enabled: false }}
                        // compactor={verticalCompactor}
                        layout={fieldsLayout}
                    >
                        {fields.map((item) => (
                            <div key={item.key}>
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
                </div>
            )}
        </div>
    );
}
export const TEST: FormDefinition = {
    firstStepKey: 'start',
    steps: {
        start: {
            key: 'start',
            title: 'First step',
            fields: {
                '15c5848e-3d4f-4c34-be8b-3436578234fc': {
                    capabilities: {
                        canBeVisible: false,
                        canBeEnabled: false,
                        canBeRequired: false,
                        canBeSetValue: false,
                    },
                    control: 'input',
                    fieldType: 'input',
                    valueType: 'unknown',
                    logic: {
                        visibility: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '49f15f84-bd2b-4219-8168-186ee8d9fa60',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        enabled: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '6a3bd1f5-72ae-4e40-866c-bbd03f97a1d1',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        required: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '7691cfb7-0605-4675-950f-ccff32265f3e',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                    },
                    __typ: 'field',
                    key: '15c5848e-3d4f-4c34-be8b-3436578234fc',
                    descriptorKey: 'radio',
                    settingsValues: {
                        label: 'Тип рассчеиа',
                        fieldType: 'radio',
                        name: 'calcType',
                        required: false,
                        visible: false,
                        disabled: false,
                        theme: 'param',
                        options: [
                            {
                                label: 'По СС',
                                value: 'sum',
                            },
                            {
                                label: 'По премии',
                                value: 'premium',
                            },
                        ],
                    },
                    layout: {
                        i: '15c5848e-3d4f-4c34-be8b-3436578234fc',
                        x: 0,
                        y: 0,
                        w: 2,
                        h: 3,
                        minW: 1,
                        moved: false,
                        static: false,
                        resizeHandles: ['e', 'w'],
                    },
                },
                'a671a831-1094-483c-b20f-8d7fbf86d80b': {
                    capabilities: {
                        canBeVisible: false,
                        canBeEnabled: false,
                        canBeRequired: false,
                        canBeSetValue: false,
                    },
                    control: 'input',
                    fieldType: 'input',
                    valueType: 'unknown',
                    logic: {
                        visibility: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '3bbfbced-59f9-4018-b464-29a74b384a85',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        enabled: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '6146319a-6076-49c3-a0b5-597a91ecf01b',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        required: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '64a703a7-9867-417e-a432-dc1a4a996bd6',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                    },
                    __typ: 'field',
                    key: 'a671a831-1094-483c-b20f-8d7fbf86d80b',
                    descriptorKey: 'radio',
                    settingsValues: {
                        label: 'Тип выплаты',
                        fieldType: 'radio',
                        name: 'paymentType',
                        required: false,
                        visible: false,
                        disabled: false,
                        theme: 'param',
                        options: [
                            {
                                label: 'Отложенная',
                                value: 'delayed',
                            },
                            {
                                label: 'Немедленная',
                                value: 'instant',
                            },
                        ],
                    },
                    layout: {
                        i: 'a671a831-1094-483c-b20f-8d7fbf86d80b',
                        x: 0,
                        y: 3,
                        w: 2,
                        h: 3,
                        minW: 1,
                        moved: false,
                        static: false,
                        resizeHandles: ['e', 'w'],
                    },
                },
                'f1cf2101-9ef1-4dff-bfe8-8687884755e5': {
                    capabilities: {
                        canBeVisible: false,
                        canBeEnabled: false,
                        canBeRequired: false,
                        canBeSetValue: false,
                    },
                    control: 'input',
                    fieldType: 'input',
                    valueType: 'unknown',
                    logic: {
                        visibility: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: 'daa483d5-0223-44a9-9ddb-dd797fb55513',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        enabled: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '28cc0744-22e9-4ff3-be9a-058d00f0b534',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        required: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '96e517a9-2903-419f-892a-33928397e3f4',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        validation: {
                            condition: {
                                id: 'fdbf837e-1d57-4186-9bbe-e65af88b3e58',
                                type: 'or',
                                items: [
                                    {
                                        id: 'e55c5aab-b588-4242-9718-94b20a5d6e53',
                                        type: 'isEmpty',
                                        item: {
                                            __typ: 'ref',
                                            path: ['start', 'fields', 'f1cf2101-9ef1-4dff-bfe8-8687884755e5'],
                                            refType: 'field',
                                        },
                                    },
                                    {
                                        id: 'e78ef8db-5d59-4456-a90f-2b4d7c4dbb33',
                                        type: 'lt',
                                        left: {
                                            __typ: 'ref',
                                            path: ['start', 'fields', 'f1cf2101-9ef1-4dff-bfe8-8687884755e5'],
                                            refType: 'field',
                                        },
                                        right: {
                                            __typ: 'const',
                                            value: 5,
                                            valueType: 'number',
                                        },
                                    },
                                    {
                                        id: '21c833eb-e15d-4bfd-b13b-fa1a54d62f68',
                                        type: 'gt',
                                        left: {
                                            __typ: 'ref',
                                            path: ['start', 'fields', 'f1cf2101-9ef1-4dff-bfe8-8687884755e5'],
                                            refType: 'field',
                                        },
                                        right: {
                                            __typ: 'const',
                                            value: 40,
                                            valueType: 'number',
                                        },
                                    },
                                    {
                                        id: '11dabb3b-9932-4d2d-8d4d-0fd928b3d86e',
                                        type: 'eq',
                                        left: {
                                            __typ: 'ref',
                                            path: ['start', 'fields', 'dddcaaaa-2c84-4812-a5ce-233b0f05f1ce'],
                                            refType: 'field',
                                        },
                                        right: {
                                            __typ: 'const',
                                            value: 1,
                                            valueType: 'number',
                                        },
                                    },
                                ],
                            },
                            actions: [
                                {
                                    type: 'setFieldError',
                                    text: 'Диапазон 5 40',
                                },
                            ],
                        },
                    },
                    __typ: 'field',
                    key: 'f1cf2101-9ef1-4dff-bfe8-8687884755e5',
                    descriptorKey: 'field',
                    settingsValues: {
                        mask: '',
                        fieldType: 'input',
                        label: 'Срок действия, лет',
                        name: 'years',
                        required: true,
                        visible: false,
                        disabled: false,
                        placeholder: '',
                        inputType: 'text',
                        checked: false,
                        options: [
                            {
                                label: 'Вариант 1',
                                value: 'var1',
                            },
                            {
                                label: 'Вариант 2',
                                value: 'var2',
                            },
                        ],
                        multiple: true,
                        accept: 'jpg,jpeg,heic,png,pdf',
                        maxFileSizeMb: '20',
                    },
                    layout: {
                        i: 'f1cf2101-9ef1-4dff-bfe8-8687884755e5',
                        x: 0,
                        y: 6,
                        w: 1,
                        h: 3,
                        minW: 1,
                        moved: false,
                        static: false,
                        resizeHandles: ['e', 'w'],
                    },
                },
                'dddcaaaa-2c84-4812-a5ce-233b0f05f1ce': {
                    capabilities: {
                        canBeVisible: false,
                        canBeEnabled: false,
                        canBeRequired: false,
                        canBeSetValue: false,
                    },
                    control: 'input',
                    fieldType: 'input',
                    valueType: 'unknown',
                    logic: {
                        visibility: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: 'ab9c3342-7a31-43e2-9453-5e5ca2e3fc78',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        enabled: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '586c772d-a251-4377-bfbf-834a7bd6dd90',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        required: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '61756689-c1c5-45ce-80ab-e96af4158614',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                    },
                    __typ: 'field',
                    key: 'dddcaaaa-2c84-4812-a5ce-233b0f05f1ce',
                    descriptorKey: 'field',
                    settingsValues: {
                        mask: '',
                        fieldType: 'input',
                        label: 'Срок уплаты взносов',
                        name: 'paymentPeriod',
                        required: true,
                        visible: false,
                        disabled: false,
                        placeholder: '',
                        inputType: 'text',
                        checked: false,
                        options: [
                            {
                                label: 'Вариант 1',
                                value: 'var1',
                            },
                            {
                                label: 'Вариант 2',
                                value: 'var2',
                            },
                        ],
                        multiple: true,
                        accept: 'jpg,jpeg,heic,png,pdf',
                        maxFileSizeMb: '20',
                    },
                    layout: {
                        i: 'dddcaaaa-2c84-4812-a5ce-233b0f05f1ce',
                        x: 1,
                        y: 6,
                        w: 1,
                        h: 3,
                        minW: 1,
                        moved: false,
                        static: false,
                        resizeHandles: ['e', 'w'],
                    },
                },
                '7abf3482-cb8e-4542-909a-00c0b5597b8e': {
                    capabilities: {
                        canBeVisible: false,
                        canBeEnabled: false,
                        canBeRequired: false,
                        canBeSetValue: false,
                    },
                    control: 'input',
                    fieldType: 'input',
                    valueType: 'unknown',
                    logic: {
                        visibility: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '5e8762de-9326-4911-ab6c-6074d14c318a',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        enabled: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '9b0b78af-1337-4fca-9813-ff3c450dc3aa',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        required: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '8858000d-61cd-48b0-a642-cc35f6d76310',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        validation: {
                            condition: {
                                id: '4859376d-9f34-498b-9fbc-125fd4fc481e',
                                type: 'and',
                                items: [
                                    {
                                        id: 'f0903dda-fb50-48d6-9a2e-c9fc13e76c96',
                                        type: 'lte',
                                        left: {
                                            __typ: 'ref',
                                            path: ['start', 'fields', '7abf3482-cb8e-4542-909a-00c0b5597b8e'],
                                            refType: 'field',
                                        },
                                        right: {
                                            __typ: 'const',
                                            value: 100,
                                            valueType: 'number',
                                        },
                                    },
                                ],
                            },
                            actions: [
                                {
                                    type: 'setFieldError',
                                    text: 'must be greater than 100',
                                },
                            ],
                        },
                    },
                    __typ: 'field',
                    key: '7abf3482-cb8e-4542-909a-00c0b5597b8e',
                    descriptorKey: 'field',
                    settingsValues: {
                        mask: '',
                        fieldType: 'input',
                        label: 'Страховая сумма',
                        name: 'ins_sum',
                        required: true,
                        visible: false,
                        disabled: false,
                        placeholder: '',
                        inputType: 'text',
                        checked: false,
                        options: [
                            {
                                label: 'Вариант 1',
                                value: 'var1',
                            },
                            {
                                label: 'Вариант 2',
                                value: 'var2',
                            },
                        ],
                        multiple: true,
                        accept: 'jpg,jpeg,heic,png,pdf',
                        maxFileSizeMb: '20',
                    },
                    layout: {
                        i: '7abf3482-cb8e-4542-909a-00c0b5597b8e',
                        x: 0,
                        y: 9,
                        w: 2,
                        h: 3,
                        minW: 1,
                        moved: false,
                        static: false,
                        resizeHandles: ['e', 'w'],
                    },
                },
                'e295cf27-925a-47ef-821d-e1afd21207b9': {
                    capabilities: {
                        canBeVisible: false,
                        canBeEnabled: false,
                        canBeRequired: false,
                        canBeSetValue: false,
                    },
                    control: 'input',
                    fieldType: 'input',
                    valueType: 'unknown',
                    logic: {
                        visibility: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: 'f9c9cdf3-9023-4dc0-b1dc-cd032ede5767',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        enabled: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '90cff997-935a-46ed-b66b-8ba89ac3c8f9',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        required: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '1f5525c4-9bc9-4c61-9293-1f9b35dff76a',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                    },
                    __typ: 'field',
                    key: 'e295cf27-925a-47ef-821d-e1afd21207b9',
                    descriptorKey: 'field',
                    settingsValues: {
                        mask: '',
                        fieldType: 'select',
                        label: 'Периодичность уплаты',
                        name: 'period',
                        required: true,
                        visible: false,
                        disabled: false,
                        placeholder: '',
                        inputType: 'text',
                        checked: false,
                        options: [
                            {
                                label: 'Ежегодно',
                                value: '12',
                            },
                        ],
                        multiple: true,
                        accept: 'jpg,jpeg,heic,png,pdf',
                        maxFileSizeMb: '20',
                    },
                    layout: {
                        i: 'e295cf27-925a-47ef-821d-e1afd21207b9',
                        x: 0,
                        y: 12,
                        w: 2,
                        h: 3,
                        minW: 1,
                        moved: false,
                        static: false,
                        resizeHandles: ['e', 'w'],
                    },
                },
                'a5d9549b-489c-4e09-9cf8-e560283a98af': {
                    capabilities: {
                        canBeVisible: false,
                        canBeEnabled: false,
                        canBeRequired: false,
                        canBeSetValue: false,
                    },
                    control: 'input',
                    fieldType: 'input',
                    valueType: 'unknown',
                    logic: {
                        visibility: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '544cef93-36f4-48ec-929f-a63c6a208235',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        enabled: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: 'c035bd6f-4c38-4f50-93d6-e5cf42a24ab4',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        required: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '4437eb73-e28d-4dd3-abad-26465b965f30',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                    },
                    __typ: 'field',
                    key: 'a5d9549b-489c-4e09-9cf8-e560283a98af',
                    descriptorKey: 'description',
                    settingsValues: {
                        text: 'Застрахованный',
                        fieldType: 'description',
                    },
                    layout: {
                        i: 'a5d9549b-489c-4e09-9cf8-e560283a98af',
                        x: 0,
                        y: 15,
                        w: 3,
                        h: 3,
                        minW: 1,
                        moved: false,
                        static: false,
                        resizeHandles: ['e', 'w'],
                    },
                },
                '139d147d-19d9-4e39-af43-4e150469d388': {
                    capabilities: {
                        canBeVisible: false,
                        canBeEnabled: false,
                        canBeRequired: false,
                        canBeSetValue: false,
                    },
                    control: 'input',
                    fieldType: 'input',
                    valueType: 'unknown',
                    logic: {
                        visibility: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '417c2932-7a76-44e0-9cfe-da942342a3dd',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        enabled: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '8a07bf58-c50c-43d6-807d-055cf4cb261b',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        required: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '9a07fbd3-bd5e-42db-b147-411948d58248',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                    },
                    __typ: 'field',
                    key: '139d147d-19d9-4e39-af43-4e150469d388',
                    descriptorKey: 'field',
                    settingsValues: {
                        mask: '',
                        fieldType: 'date',
                        label: 'Дата рождения',
                        name: 'birthdate',
                        required: true,
                        visible: false,
                        disabled: true,
                        placeholder: '',
                        inputType: 'text',
                        checked: false,
                        options: [
                            {
                                label: 'Вариант 1',
                                value: 'var1',
                            },
                            {
                                label: 'Вариант 2',
                                value: 'var2',
                            },
                        ],
                        multiple: true,
                        accept: 'jpg,jpeg,heic,png,pdf',
                        maxFileSizeMb: '20',
                    },
                    layout: {
                        i: '139d147d-19d9-4e39-af43-4e150469d388',
                        x: 0,
                        y: 18,
                        w: 1,
                        h: 3,
                        minW: 1,
                        moved: false,
                        static: false,
                        resizeHandles: ['e', 'w'],
                    },
                },
                '6a224b46-b6bd-431d-8b2e-ddb533c1e7f9': {
                    capabilities: {
                        canBeVisible: false,
                        canBeEnabled: false,
                        canBeRequired: false,
                        canBeSetValue: false,
                    },
                    control: 'input',
                    fieldType: 'input',
                    valueType: 'unknown',
                    logic: {
                        visibility: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: '15886bcb-99ba-4347-87bd-956f0ae658ca',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        enabled: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: 'e4137d3d-7d77-437c-9a1f-e8f0bae7729a',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                        required: {
                            defaultValue: true,
                            rule: {
                                condition: {
                                    id: 'c2356999-9403-41c6-8339-eb82f241e836',
                                    type: 'noop',
                                    items: [],
                                },
                                actions: [],
                            },
                        },
                    },
                    __typ: 'field',
                    key: '6a224b46-b6bd-431d-8b2e-ddb533c1e7f9',
                    descriptorKey: 'radio',
                    settingsValues: {
                        label: 'Пол',
                        fieldType: 'radio',
                        name: 'gender',
                        required: true,
                        visible: false,
                        disabled: false,
                        theme: 'param',
                        options: [
                            {
                                label: 'Мужчина',
                                value: 'male',
                            },
                            {
                                label: 'Женщина',
                                value: 'female',
                            },
                        ],
                    },
                    layout: {
                        i: '6a224b46-b6bd-431d-8b2e-ddb533c1e7f9',
                        x: 1,
                        y: 18,
                        w: 1,
                        h: 3,
                        minW: 1,
                        moved: false,
                        static: false,
                        resizeHandles: ['e', 'w'],
                    },
                },
            },
            transition: {
                rules: [],
            },
        },
    },
    lookups: {},
    constants: {
        name: {
            __typ: 'constant',
            key: 'name',
            label: 'Form name',
            valueType: 'string',
            value: 'simple name',
        },
        enabled: {
            __typ: 'constant',
            key: 'enabled',
            label: 'Form enabled',
            valueType: 'boolean',
            value: true,
        },
    },
    variables: {},
    interactions: [],
};
export default function HomePage() {
    return (
        <FormProvider initialState={TEST}>
            <FormRenderer />
        </FormProvider>
    );
}
