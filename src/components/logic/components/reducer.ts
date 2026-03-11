import type {EditorState, FormEditorAction} from "../types.ts";

export default function editorReducer(state: EditorState, action: FormEditorAction): EditorState {
    switch (action.type) {
        case "ADD_ON_UPDATE": {
            const { stepKey, field, payload } = action;
            return {
                ...state,
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [stepKey]: {
                            ...state.form.steps[stepKey],
                            fields: {
                                ...state.form.steps[stepKey].fields,
                                [field.key]: {
                                    ...state.form.steps[stepKey].fields[field.key],
                                    onUpdate: payload,
                                }
                            }
                        },
                    }
                }
            }
        }
        case "UPDATE_ON_UPDATE": {
            const { stepKey, field, patch } = action;
            const patchedOnUpdate = {
                ...(state.form.steps[stepKey].fields[field.key].onUpdate ?? { rules: []}),
                ...patch
            }
            return {
                ...state,
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [stepKey]: {
                            ...state.form.steps[stepKey],
                            fields: {
                                ...state.form.steps[stepKey].fields,
                                [field.key]: {
                                    ...state.form.steps[stepKey].fields[field.key],
                                    onUpdate: patchedOnUpdate,
                                }
                            }
                        },
                    }
                }
            }
        }
        case "DELETE_ON_UPDATE": {
            const { stepKey, field } = action;
            return {
                ...state,
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [stepKey]: {
                            ...state.form.steps[stepKey],
                            fields: {
                                ...state.form.steps[stepKey].fields,
                                [field.key]: {
                                    ...state.form.steps[stepKey].fields[field.key],
                                    onUpdate: undefined
                                }
                            }
                        },
                    }
                }
            }
        }
        case "ADD_BOOL_PROPERTY_LOGIC": {
            const { stepKey, field, logicKey, payload } = action;
            const currField = state.form.steps[stepKey].fields[field.key]
            const updatedLogic = currField.logic ? {
                ...currField.logic,
                [logicKey]: payload
            } : {
                [logicKey]: payload
            }
            return {
                ...state,
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [stepKey]: {
                            ...state.form.steps[stepKey],
                            fields: {
                                ...state.form.steps[stepKey].fields,
                                [field.key]: {
                                    ...currField,
                                    logic: updatedLogic
                                }
                            }
                        },
                    }
                }
            }
        }
        case "UPDATE_BOOL_PROPERTY_LOGIC": {
            const { stepKey, field, logicKey, patch } = action;
            const currField = state.form.steps[stepKey].fields[field.key]
            const updatedLogic = currField.logic ? {
                ...currField.logic,
                [logicKey]: {
                    ...currField.logic[logicKey],
                    ...patch
                }
            } : {
                [logicKey]: patch
            }
            return {
                ...state,
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [stepKey]: {
                            ...state.form.steps[stepKey],
                            fields: {
                                ...state.form.steps[stepKey].fields,
                                [field.key]: {
                                    ...currField,
                                    logic: updatedLogic
                                }
                            }
                        },
                    }
                }
            }
        }
        case "DELETE_BOOL_PROPERTY_LOGIC": {
            const { stepKey, field, logicKey} = action;
            const currField = state.form.steps[stepKey].fields[field.key]
            return {
                ...state,
                form: {
                    ...state.form,
                    steps: {
                        ...state.form.steps,
                        [stepKey]: {
                            ...state.form.steps[stepKey],
                            fields: {
                                ...state.form.steps[stepKey].fields,
                                [field.key]: {
                                    ...currField,
                                    logic: {
                                        ...currField.logic,
                                        [logicKey]: undefined
                                    }
                                }
                            }
                        },
                    }
                }
            }
        }
        default:
            throw new Error(`Unknown action type ${action.type}`);
    }
}