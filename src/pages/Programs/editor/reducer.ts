import type {FormDefinition} from "../../../logic/type.ts";
import type {FormEditorAction} from "./context.ts";
import type {FieldDefinition} from "../../../logic/field.ts";

export const formReducer = (state: FormDefinition, action: FormEditorAction): FormDefinition => {
    switch (action.type) {
        case "UPDATE_NAME":
            return {
                ...state,
                name: action.name,
            }
        case "UPDATE_ENABLED":
            return {
                ...state,
                enabled: action.value
            }
        case "ADD_FIELD": {
            return {
                ...state,
                steps: {
                    ...state.steps,
                    [action.stepKey]: {
                        ...state.steps[action.stepKey],
                        fields: {
                            ...state.steps[action.stepKey].fields,
                            [action.field.key]: action.field
                        }
                    }
                }
            }
        }
        case "UPDATE_FIELD_SETTINGS": {
            return {
                ...state,
                steps: {
                    ...state.steps,
                    [action.stepKey]: {
                        ...state.steps[action.stepKey],
                        fields: {
                            ...state.steps[action.stepKey].fields,
                            [action.fieldKey]: {
                                ...state.steps[action.stepKey].fields[action.fieldKey],
                                settingsValues: action.settings
                            }
                        }
                    }
                }
            }
        }
        case "REMOVE_FIELD": {
            const fields = {...state.steps[action.stepKey].fields}
            delete fields[action.fieldKey]
            return {
                ...state,
                steps: {
                    ...state.steps,
                    [action.stepKey]: {
                        ...state.steps[action.stepKey],
                        fields
                    }
                }
            }
        }
        case "SAVE_LAYOUT": {
            const updatedFields: FieldDefinition[] = []
            action.layout.forEach(layout => {
                const field = Object.entries(state.steps[action.stepKey].fields)
                    .find(v=>v[1].key == layout.i)
                if(!field) throw new Error(`Unknown field ${layout.i} for field ${layout.i} (Should be impossible)`)
                field[1].layout = layout
                updatedFields.push(field[1])
            })
            return {
                ...state,
                steps: {
                    ...state.steps,
                    [action.stepKey]: {
                        ...state.steps[action.stepKey],
                        fields: updatedFields.reduce((acc, item) => ({ ...acc, [item.key]: item }), {})
                    }
                }
            }
        }
        default:
            throw new Error(`Unknown action ${JSON.stringify(action)}`);
    }
}