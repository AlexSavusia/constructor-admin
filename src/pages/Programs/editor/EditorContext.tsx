import {createContext, useContext} from "react";
import {createStore, useStore} from "zustand";
import type {
    ConstVariableDefinition,
    ExpressionScope,
    FormDefinition, Key,
    RuntimeVariableDefinition
} from "../../../logic/type.ts";
import type {StepDefinition} from "../../../logic/step.ts";
import type {FieldDefinition} from "../../../logic/field.ts";
import type {PaletteItemSettingsValues} from "../../../components/constructor/type.ts";
import type {Layout} from "react-grid-layout";
import type {ActionExpression, Rule} from "../../../components/logic/types.ts";
import type {BooleanExpression} from "../../../logic/expression.ts";
import type {BooleanPropertyLogicDefinition, StepTransitionRule} from "../../../logic/logic.ts";

export type EditorStateValue = {
    stepKey: Key | null;
    form: FormDefinition
    scope: ExpressionScope | null
    editingRule?: LogicEditorContextValue
    editingField?: FieldEditorContextValue
}

export type ObjPath = Array<string | number>

export const objPathToString = (r: ObjPath) => r.join(".")
export const objPathFromString = (rs: string) => rs.split(".")

export type LogicEditorContextValue = {
    path: ObjPath
    scope: ExpressionScope,
    rule: BooleanPropertyLogicDefinition | Rule | StepTransitionRule
}


export type FieldEditorContextValue = {
    path: ObjPath
    key: Key
    draft: FieldDefinition;
}

export type ContextFields = {
    fields: ObjPath[],
    variables: ObjPath[],
    constants: ObjPath[],
}

export type EditorActions = {
    setStepKey: (stepKey: Key | null) => void

    addStep: (step: StepDefinition) => void
    removeStep: (stepKey: Key) => void

    addField: (stepKey: Key, field: FieldDefinition) => void
    updateFieldSettings: (stepKey: Key, fieldKey: Key, settings: PaletteItemSettingsValues) => void
    removeField: (stepKey: Key, fieldKey: Key) => void
    addConst: (constDef: ConstVariableDefinition) => void
    removeConst: (constKey: Key) => void
    updateConst: (constDef: ConstVariableDefinition) => void
    updateConstValue: (constKey: Key, value: unknown) => void
    updateStepLayout: (stepKey: Key, layout: Layout) => void
    addVariable: (variable: RuntimeVariableDefinition) => void
    removeVariable: (variableKey: Key) => void

    setEditingRule: (path: ObjPath, scope: ExpressionScope) => void
    updateEditingRule: (path: ObjPath, expr: BooleanExpression | ActionExpression) => void
    persistEditingRule: () => void
    resetEditingRule: () => void

    setEditingField: (stepKey: Key, fieldKey: Key) => void
    persistEditingField: () => void
    updateEditingFieldSettings: (settings: PaletteItemSettingsValues) => void;
    resetEditingField: () => void // resets editing object (not field reset)

    getAllContextVariables: (scope: ExpressionScope) => ContextFields
    addStepTransitionRule: (stepKey: Key, transition: StepTransitionRule) => void
    removeStepTransitionRule: (stepKey: Key, idx: number) => void
}

export type EditorState = EditorStateValue & EditorActions

export function findByPath<T>(object: object, path: ObjPath): T | null {
    return path.reduce((acc: object, key) => {
        if(acc == null) return acc;
        // @ts-expect-error no error. i swear
        return (acc)[key]
    }, object) as T | null
}

function setByPath<T, V>(object: T, path: ObjPath, value: V): T {
    if (path.length === 0) {
        return object
    }

    const [key, ...rest] = path

    if (rest.length === 0) {
        if (Array.isArray(object)) {
            const copy = [...object]
            copy[Number(key)] = value
            return copy as T
        }

        return {
            ...(object as Record<string, unknown>),
            [key]: value,
        } as T
    }

    if (Array.isArray(object)) {
        const copy = [...object]
        const index = Number(key)

        copy[index] = setByPath(copy[index], rest, value)

        return copy as T
    }

    return {
        ...(object as Record<string, unknown>),
        [key]: setByPath(
            (object as Record<string, unknown>)[String(key)],
            rest,
            value
        ),
    } as T
}

export function createContextStore(initialState?: EditorStateValue) {
    return createStore<EditorState>((set, get) => {
        const EDITOR_ACTIONS: EditorActions = {
            getAllContextVariables: (scope: ExpressionScope) => {
                const { form } = get()
                const {steps, variables, constants} = form


                return {
                    constants: Object.entries(constants)
                        .map(v=>["constants", v[0]]),
                    variables: Object.entries(variables)
                        .map(v=>["variables", v[0]]),
                    fields: Object.entries(steps).map(st => Object.entries(st[1].fields)
                        .map(f => [st[0], "fields", f[0]])).flat()
                }

            },
            setEditingField: (stepKey, fieldKey) => set((state) => {
                const path: ObjPath = ["form", "steps", stepKey, "fields", fieldKey];
                const field = state.form.steps[stepKey]?.fields[fieldKey];

                if (!field) return {} as Partial<EditorState>;

                return {
                    editingField: {
                        path,
                        key: fieldKey,
                        draft: structuredClone(field),
                    }
                } as Partial<EditorState>
            }),
            persistEditingField: () => set((state) => {
                if (!state.editingField) return {} as Partial<EditorState>;

                return {
                    form: setByPath(state.form, state.editingField.path.slice(1), state.editingField.draft),
                    editingField: undefined,
                } as Partial<EditorState>;
            }),

            resetEditingField: () => set(() => ({
                editingField: undefined
            })),
            persistEditingRule: () => set((state) => {
                const updatedState = setByPath(state, state.editingRule!.path, state.editingRule!.rule)
                return {
                    ...updatedState,
                    editingRule: undefined,
                } // TODO this is bad cuz whole context is being reset
            }),
            updateEditingRule: (path, expr) => set((state) => {
                const editingRule = state.editingRule!
                const r = setByPath('defaultValue' in editingRule.rule ? (editingRule.rule as BooleanPropertyLogicDefinition).rule : (editingRule.rule as Rule), path, expr)
                const decisionRule = (["FIELD_SCOPE_PROPERTY"] as ExpressionScope[]).includes(editingRule.scope)
                return {
                    editingRule: {
                        ...state.editingRule,
                        rule: decisionRule ? {
                            ...editingRule.rule,
                            rule: r
                        } : r,
                    }
                } as Partial<EditorState>
            }),
            setEditingRule: (path: ObjPath, scope: ExpressionScope) => set((state) => {
                let ruleObj = findByPath<Rule>(state, path)
                if (ruleObj == null) {
                    ruleObj = {
                        condition: {
                            id: crypto.randomUUID(),
                            type: "and",
                            items: []
                        },
                        actions: []
                    }
                }
                return ({
                    editingRule: {
                        rule: ruleObj,
                        scope: scope,
                        path: path,
                    }
                }) as Partial<EditorState>;
            }),
            resetEditingRule: () => set(() => ({
                editingRule: undefined
            })),
            setStepKey: (stepKey) => set({stepKey}),
            addStep: (step) => set((state) => ({
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [step.key]: step,
                    },
                }
            })),
            removeStep: (stepKey) => set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [stepKey]: _, ...rest } = state.form.steps;
                return {
                    form: {
                        ...state.form,
                        steps: rest
                    }
                };
            }),
            addConst: (constDef) => set((state) => ({
                form: {
                    ...state.form,
                    constants: {
                        ...state.form.constants,
                        [constDef.key]: constDef,
                    },
                }
            })),
            removeConst: (constKey: Key) => set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [constKey]: _, ...rest } = state.form.constants;
                return ({
                    form: {
                        ...state.form,
                        constants: rest
                    }
                })
            }),
            updateConst: (constDef) => set((state) => ({
                form: {
                    ...state.form,
                    constants: {
                        ...state.form.constants,
                        [constDef.key]: constDef,
                    }
                }
            })),
            updateConstValue: (constKey, value) => set((state) => ({
                form: {
                    ...state.form,
                    constants: {
                        ...state.form.constants,
                        [constKey]: {
                            ...state.form.constants[constKey],
                            value: value
                        }
                    }
                }
            })),
            updateStepLayout: (stepKey: Key, layout: Layout) => set((state) => {
                const {fields} = state.form.steps[stepKey];
                const updatedFields = Object.entries(fields)
                    .map(v => {
                        const f = v[1]
                        const fieldLayout = layout.find(fl => fl.i == f.key)!
                        return ({
                            ...f,
                            layout: fieldLayout,
                        }) as FieldDefinition
                    })
                return {
                    form: {
                        ...state.form,
                        steps: {
                            ...state.form.steps,
                            [stepKey]: {
                                ...state.form.steps[stepKey],
                                fields: updatedFields.reduce<Record<string, FieldDefinition>>((acc, item) => {
                                    acc[item.key] = item
                                    return acc
                                }, {})
                            }
                        }
                    }
                }
            }),
            addField: (stepKey, field) => set((state) => ({
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [stepKey]: {
                            ...state.form.steps[stepKey],
                            fields: {
                                ...state.form.steps[stepKey].fields,
                                [field.key]: field,
                            }
                        }
                    },
                }
            })),
            removeField: (stepKey, fieldKey) => set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [fieldKey]: _, ...rest } = state.form.steps[stepKey].fields;
                return ({
                    form: {
                        ...state.form,
                        steps: {
                            ...state.form.steps,
                            [stepKey]: {
                                ...state.form.steps[stepKey],
                                fields: rest
                            }
                        }
                    }
                })
            }),
            updateFieldSettings: (stepKey, fieldKey, settings) => set((state) => ({
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
                                }
                            }
                        }
                    }
                }
            })),
            updateEditingFieldSettings: (settings) => set((state) => {
                if (!state.editingField) return {} as Partial<EditorState>;

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
                } as Partial<EditorState>;
            }),
            addVariable: (variable) => set((state) => ({
                form: {
                    ...state.form,
                    variables: {
                        ...state.form.variables,
                        [variable.key]: variable,
                    },
                }
            })),
            removeVariable: (variableKey) => set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [variableKey]: _, ...rest } = state.form.variables;
                return ({
                    form: {
                        ...state.form,
                        variables: rest
                    }
                })
            }),
            addStepTransitionRule: (stepKey, rule) => set((state) => ({
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [stepKey]: {
                            ...state.form.steps[stepKey],
                            transition: {
                                ...state.form.steps[stepKey].transition,
                                rules: [
                                    ...state.form.steps[stepKey].transition.rules,
                                    rule
                                ]
                            }
                        }
                    }
                }
            })),
            removeStepTransitionRule: (stepKey, idx) => set((state) => ({
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [stepKey]: {
                            ...state.form.steps[stepKey],
                            transition: {
                                ...state.form.steps[stepKey].transition,
                                rules: [
                                    ...[...state.form.steps[stepKey].transition.rules]
                                        .filter((_, i) => i !== idx)
                                ]
                            }
                        }
                    }
                }
            }))
        }


        if(initialState) return {...initialState, ...EDITOR_ACTIONS};
        return ({
            ...EDITOR_ACTIONS,
            stepKey: null,
            form: {
                firstStepKey: "start",
                steps: {
                    "start": {
                        key: "start",
                        title: "First step",
                        fields: {},
                        transition: {
                            rules: []
                        }
                    }
                },
                lookups: {},
                constants: {
                    "name": {
                        __typ: "constant",
                        key: "name",
                        label: "Form name",
                        valueType: "string",
                        value: "simple name"
                    },
                    "enabled": {
                        __typ: "constant",
                        key: "enabled",
                        label: "Form enabled",
                        valueType: "boolean",
                        value: true
                    }
                },
                variables: {},
                interactions: []
            },
            scope: null
        }) as EditorState;
    })

}

export const EditorContext = createContext<ReturnType<typeof createContextStore> | null>(null);

export function useEditorContext<T>(selector: (state: EditorState) => T) {
    const store = useContext(EditorContext);
    if(!store) throw new Error('useEditorContext must be used inside EditorProvider')
    return useStore(store, selector)
}