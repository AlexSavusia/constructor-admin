import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import type {
    ConstVariableDefinition,
    ExpressionScope,
    FormDefinition,
    Key,
    RuntimeVariableDefinition,
} from '../../../logic/type.ts';
import type { StepDefinition } from '../../../logic/step.ts';
import type { FieldDefinition } from '../../../logic/field.ts';
import type { PaletteItemSettingsValues } from '../../../components/constructor/type.ts';
import type { Layout } from 'react-grid-layout';
import type { ActionExpression, Rule } from '../../../components/logic/types.ts';
import type { BooleanExpression } from '../../../logic/expression.ts';
import type { BooleanPropertyLogicDefinition, StepTransitionRule } from '../../../logic/logic.ts';
import type { DictionaryRow, DictionarySchema } from '../../../api/types.ts';

export type EditorStateValue = {
    stepKey: Key | null;
    form: FormDefinition;
    scope: ExpressionScope | null;
    editingRule?: LogicEditorContextValue;
    editingField?: FieldEditorContextValue;
    dictionaryPicker?: DictionaryPickerState | null;
};

export type ObjPath = Array<string | number>;

export const objPathToString = (r: ObjPath) => r.join('.');
export const objPathFromString = (rs: string) => rs.split('.');

export type LogicEditorContextValue = {
    path: ObjPath;
    scope: ExpressionScope;
    rule: BooleanPropertyLogicDefinition | Rule | StepTransitionRule;
    meta?: EditingRuleMeta;
};

export type FieldEditorContextValue = {
    path: ObjPath;
    key: Key;
    draft: FieldDefinition;
};

export type ContextFields = {
    fields: Record<string, string>;
    variables: Record<string, string>;
    constants: Record<string, string>;
};

export type DictionaryPickerState = {
    open: boolean;
    dictionary: DictionarySchema | null;
    rows: DictionaryRow[];
    tempSelectedFieldIds: string[];
};
export type EditingRuleMeta = {
    editingFieldProperty?: 'visibility' | 'enabled' | 'required' | 'validation';
    dictionaryRowFilter?: {
        dictId: Key;
        rowId: Key;
        label: string;
    };
};

export type EditorActions = {
    setStepKey: (stepKey: Key | null) => void;

    addStep: (step: StepDefinition) => void;
    removeStep: (stepKey: Key) => void;

    addField: (stepKey: Key, field: FieldDefinition) => void;
    updateFieldSettings: (stepKey: Key, fieldKey: Key, settings: PaletteItemSettingsValues) => void;
    removeField: (stepKey: Key, fieldKey: Key) => void;
    addConst: (constDef: ConstVariableDefinition) => void;
    removeConst: (constKey: Key) => void;
    updateConst: (constDef: ConstVariableDefinition) => void;
    updateConstValue: (constKey: Key, value: unknown) => void;
    updateStepLayout: (stepKey: Key, layout: Layout) => void;
    addVariable: (variable: RuntimeVariableDefinition) => void;
    removeVariable: (variableKey: Key) => void;

    setEditingRule: (path: ObjPath, scope: ExpressionScope, meta?: EditingRuleMeta) => void;
    updateEditingRule: (path: ObjPath, expr: BooleanExpression | ActionExpression) => void;
    persistEditingRule: () => void;
    resetEditingRule: () => void;

    setEditingField: (stepKey: Key, fieldKey: Key) => void;
    persistEditingField: () => void;
    updateEditingFieldSettings: (settings: PaletteItemSettingsValues) => void;
    resetEditingField: () => void; // resets editing object (not field reset)

    getAllContextVariables: (scope: ExpressionScope) => ContextFields;
    addStepTransitionRule: (stepKey: Key, transition: StepTransitionRule) => void;
    removeStepTransitionRule: (stepKey: Key, idx: number) => void;

    openDictionaryPicker: (payload: { dictionary: DictionarySchema; rows: DictionaryRow[]; selectedFieldIds: string[] }) => void;
    closeDictionaryPicker: () => void;
    toggleDictionaryPickerField: (fieldId: string) => void;
    saveDictionaryPickerSelection: () => void;
};

export type EditorState = EditorStateValue & EditorActions;

export function findByPath<T>(object: object, path: ObjPath): T | null {
    return path.reduce((acc: object, key) => {
        if (acc == null) return acc;
        // @ts-expect-error no error. i swear
        return acc[key];
    }, object) as T | null;
}

function setByPath<T, V>(object: T, path: ObjPath, value: V): T {
    if (path.length === 0) {
        return object;
    }

    const [key, ...rest] = path;

    if (rest.length === 0) {
        if (Array.isArray(object)) {
            const copy = [...object];
            copy[Number(key)] = value;
            return copy as T;
        }

        return {
            ...(object as Record<string, unknown>),
            [key]: value,
        } as T;
    }

    if (Array.isArray(object)) {
        const copy = [...object];
        const index = Number(key);

        copy[index] = setByPath(copy[index], rest, value);

        return copy as T;
    }

    return {
        ...(object as Record<string, unknown>),
        [key]: setByPath((object as Record<string, unknown>)[String(key)], rest, value),
    } as T;
}

export function createContextStore(initialState?: FormDefinition) {
    return createStore<EditorState>((set, get) => {
        const EDITOR_ACTIONS: EditorActions = {
            getAllContextVariables: (_scope: ExpressionScope) => {
                const { form } = get();
                const { steps, variables, constants } = form;

                return {
                    constants: Object.entries(constants)
                        .map((v) => [objPathToString(['constants', v[0]]), v[1].label] as const)
                        .reduce<Record<string, string>>((acc, item) => {
                            acc[item[0]] = item[1];
                            return acc;
                        }, {}),
                    variables: Object.entries(variables)
                        .map((v) => [objPathToString(['variables', v[0]]), v[1].label] as const)
                        .reduce<Record<string, string>>((acc, item) => {
                            acc[item[0]] = item[1];
                            return acc;
                        }, {}),
                    fields: Object.entries(steps)
                        .flatMap(([stepKey, step]) =>
                            Object.entries(step.fields).map(
                                ([fieldKey, field]) =>
                                    [
                                        objPathToString([stepKey, 'fields', fieldKey]),
                                        String(field.settingsValues['name'] ?? ''),
                                    ] as const
                            )
                        )
                        .reduce<Record<string, string>>((acc, item) => {
                            acc[item[0]] = item[1];
                            return acc;
                        }, {}),
                };
            },

            setEditingField: (stepKey, fieldKey) =>
                set((state) => {
                    const path: ObjPath = ['form', 'steps', stepKey, 'fields', fieldKey];
                    const field = state.form.steps[stepKey]?.fields[fieldKey];

                    if (!field) return {};

                    return {
                        editingField: {
                            path,
                            key: fieldKey,
                            draft: structuredClone(field),
                        },
                    };
                }),

            persistEditingField: () =>
                set((state) => {
                    // debugger
                    if (!state.editingField) return {};

                    const oldField = findByPath<FieldDefinition>(state.form, state.editingField.path.slice(1));

                    if (!oldField) return {};

                    const mergedDraft: FieldDefinition = {
                        ...state.editingField.draft,
                        logic: oldField.logic,
                    };

                    const newForm = setByPath(state.form, state.editingField.path.slice(1), mergedDraft);

                    return {
                        form: newForm,
                        editingField: undefined,
                        editingRule: undefined,
                        dictionaryPicker: null,
                    };
                }),

            resetEditingField: () =>
                set(() => ({
                    editingField: undefined,
                    dictionaryPicker: null,
                })),

            persistEditingRule: () =>
                set((state) => {
                    if (!state.editingRule) return {};
                    if(state.editingRule.scope == "LOOKUP_ROW_SCOPE") {
                        const updatedState = setByPath(state, [...state.editingRule.path, state.editingRule.meta!.dictionaryRowFilter!.rowId], {
                            key: state.editingRule.meta?.dictionaryRowFilter?.dictId,
                            rowId: state.editingRule.meta?.dictionaryRowFilter?.rowId,
                            label: state.editingRule.meta?.dictionaryRowFilter?.label,
                            baseFilter: state.editingRule.rule,
                        });
                        updatedState.editingRule = undefined;
                        return updatedState;
                    }

                    const updatedState = setByPath(state, state.editingRule.path, state.editingRule.rule);
                    updatedState.editingRule = undefined;
                    return updatedState;
                }),

            updateEditingRule: (path, expr) =>
                set((state) => {
                    const editingRule = state.editingRule;
                    if (!editingRule) return {};

                    switch (editingRule.scope) {
                        case 'FIELD_SCOPE_DECISION': {
                            const r = setByPath(editingRule.rule as Rule, path, expr);
                            return {
                                editingRule: {
                                    ...editingRule,
                                    rule: r,
                                },
                                editingField: {
                                    ...state.editingField,
                                },
                            };
                        }

                        case 'FIELD_SCOPE_PROPERTY': {
                            const r = setByPath((editingRule.rule as BooleanPropertyLogicDefinition).rule, path, expr);
                            return {
                                editingRule: {
                                    ...editingRule,
                                    rule: {
                                        ...editingRule.rule,
                                        rule: r,
                                    },
                                },
                            };
                        }
                        case "LOOKUP_ROW_SCOPE":
                        case 'STEP_TRANSITION_SCOPE': {
                            // debugger
                            const r = setByPath(editingRule.rule as StepTransitionRule, path, expr);
                            return {
                                editingRule: {
                                    ...editingRule,
                                    rule: r,
                                },
                            };
                        }

                        default:
                            throw new Error(`Unknown scope ${editingRule.scope}`);
                    }
                }),

            setEditingRule: (path: ObjPath, scope: ExpressionScope, meta) =>
                set((state) => {
                    debugger
                    let ruleObj = scope == "LOOKUP_ROW_SCOPE" ? findByPath<Rule>(state, [...path, meta!.dictionaryRowFilter!.rowId])
                        : findByPath<Rule>(state, path)
                    if (ruleObj == null) {
                        ruleObj = {
                            condition: {
                                id: crypto.randomUUID(),
                                type: 'and',
                                items: [],
                            },
                            actions: [],
                        };
                    }

                    return {
                        editingRule: {
                            rule: ruleObj,
                            scope,
                            path,
                            meta,
                        },
                    };
                }),

            resetEditingRule: () =>
                set(() => ({
                    editingRule: undefined,
                })),

            setStepKey: (stepKey) => set({ stepKey }),

            addStep: (step) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        steps: {
                            ...state.form.steps,
                            [step.key]: step,
                        },
                    },
                })),

            removeStep: (stepKey) =>
                set((state) => {
                    const { [stepKey]: _, ...rest } = state.form.steps;
                    return {
                        form: {
                            ...state.form,
                            steps: rest,
                        },
                    };
                }),

            addConst: (constDef) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        constants: {
                            ...state.form.constants,
                            [constDef.key]: constDef,
                        },
                    },
                })),

            removeConst: (constKey: Key) =>
                set((state) => {
                    const { [constKey]: _, ...rest } = state.form.constants;
                    return {
                        form: {
                            ...state.form,
                            constants: rest,
                        },
                    };
                }),

            updateConst: (constDef) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        constants: {
                            ...state.form.constants,
                            [constDef.key]: constDef,
                        },
                    },
                })),

            updateConstValue: (constKey, value) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        constants: {
                            ...state.form.constants,
                            [constKey]: {
                                ...state.form.constants[constKey],
                                value,
                            },
                        },
                    },
                })),

            updateStepLayout: (stepKey: Key, layout: Layout) =>
                set((state) => {
                    const { fields } = state.form.steps[stepKey];

                    const updatedFields = Object.entries(fields).map(([, f]) => {
                        const fieldLayout = layout.find((fl) => fl.i === f.key);
                        return {
                            ...f,
                            layout: fieldLayout ?? f.layout,
                        } as FieldDefinition;
                    });

                    return {
                        form: {
                            ...state.form,
                            steps: {
                                ...state.form.steps,
                                [stepKey]: {
                                    ...state.form.steps[stepKey],
                                    fields: updatedFields.reduce<Record<string, FieldDefinition>>((acc, item) => {
                                        acc[item.key] = item;
                                        return acc;
                                    }, {}),
                                },
                            },
                        },
                    };
                }),

            addField: (stepKey, field) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        steps: {
                            ...state.form.steps,
                            [stepKey]: {
                                ...state.form.steps[stepKey],
                                fields: {
                                    ...state.form.steps[stepKey].fields,
                                    [field.key]: field,
                                },
                            },
                        },
                    },
                })),

            removeField: (stepKey, fieldKey) =>
                set((state) => {
                    const { [fieldKey]: _, ...rest } = state.form.steps[stepKey].fields;
                    return {
                        form: {
                            ...state.form,
                            steps: {
                                ...state.form.steps,
                                [stepKey]: {
                                    ...state.form.steps[stepKey],
                                    fields: rest,
                                },
                            },
                        },
                    };
                }),

            updateFieldSettings: (stepKey, fieldKey, settings) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        steps: {
                            ...state.form.steps,
                            [stepKey]: {
                                ...state.form.steps[stepKey],
                                fields: {
                                    ...state.form.steps[stepKey].fields,
                                    [fieldKey]: {
                                        ...state.form.steps[stepKey].fields[fieldKey],
                                        settingsValues: {
                                            ...state.form.steps[stepKey].fields[fieldKey].settingsValues,
                                            ...settings,
                                        },
                                    },
                                },
                            },
                        },
                    },
                })),

            updateEditingFieldSettings: (settings) =>
                set((state) => {
                    if (!state.editingField) return {};

                    return {
                        editingField: {
                            ...state.editingField,
                            draft: {
                                ...state.editingField.draft,
                                settingsValues: {
                                    ...state.editingField.draft.settingsValues,
                                    ...settings,
                                },
                            },
                        },
                    };
                }),

            addVariable: (variable) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        variables: {
                            ...state.form.variables,
                            [variable.key]: variable,
                        },
                    },
                })),

            removeVariable: (variableKey) =>
                set((state) => {
                    const { [variableKey]: _, ...rest } = state.form.variables;
                    return {
                        form: {
                            ...state.form,
                            variables: rest,
                        },
                    };
                }),

            addStepTransitionRule: (stepKey, rule) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        steps: {
                            ...state.form.steps,
                            [stepKey]: {
                                ...state.form.steps[stepKey],
                                transition: {
                                    ...state.form.steps[stepKey].transition,
                                    rules: [...state.form.steps[stepKey].transition.rules, rule],
                                },
                            },
                        },
                    },
                })),

            removeStepTransitionRule: (stepKey, idx) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        steps: {
                            ...state.form.steps,
                            [stepKey]: {
                                ...state.form.steps[stepKey],
                                transition: {
                                    ...state.form.steps[stepKey].transition,
                                    rules: state.form.steps[stepKey].transition.rules.filter((_, i) => i !== idx),
                                },
                            },
                        },
                    },
                })),

            openDictionaryPicker: ({ dictionary, rows, selectedFieldIds }) =>
                set(() => ({
                    dictionaryPicker: {
                        open: true,
                        dictionary,
                        rows,
                        tempSelectedFieldIds: [...selectedFieldIds],
                    },
                })),

            closeDictionaryPicker: () =>
                set(() => ({
                    dictionaryPicker: null,
                })),

            toggleDictionaryPickerField: (fieldId: string) =>
                set((state) => {
                    const picker = state.dictionaryPicker;
                    if (!picker) return {};

                    const exists = picker.tempSelectedFieldIds.includes(fieldId);

                    return {
                        dictionaryPicker: {
                            ...picker,
                            tempSelectedFieldIds: exists
                                ? picker.tempSelectedFieldIds.filter((x) => x !== fieldId)
                                : [...picker.tempSelectedFieldIds, fieldId],
                        },
                    };
                }),

            saveDictionaryPickerSelection: () =>
                set((state) => {
                    const picker = state.dictionaryPicker;
                    const editingField = state.editingField;

                    if (!picker || !editingField) return {};

                    return {
                        editingField: {
                            ...editingField,
                            draft: {
                                ...editingField.draft,
                                settingsValues: {
                                    ...editingField.draft.settingsValues,
                                    dictFieldIds: picker.tempSelectedFieldIds,
                                },
                            },
                        },
                        dictionaryPicker: null,
                    };
                }),
        };

        const defaultForm: FormDefinition = {
            firstStepKey: 'start',
            steps: {
                start: {
                    key: 'start',
                    title: 'First step',
                    fields: {},
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

        const state: EditorState = {
            stepKey: null,
            form: initialState ?? defaultForm,
            scope: null,
            editingRule: undefined,
            editingField: undefined,
            dictionaryPicker: null,
            ...EDITOR_ACTIONS,
        };

        return state;
    });
}

export const EditorContext = createContext<ReturnType<typeof createContextStore> | null>(null);

export function useEditorContext<T>(selector: (state: EditorState) => T) {
    const store = useContext(EditorContext);
    if (!store) throw new Error('useEditorContext must be used inside EditorProvider');
    return useStore(store, selector);
}
