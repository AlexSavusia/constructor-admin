import * as React from "react";
import {createContext, useContext} from "react";
import type {FormDefinition, Key} from "../../../logic/type.ts";
import type {FieldDefinition} from "../../../logic/field.ts";
import type {PaletteItemSettingsValues} from "../../../components/constructor/type.ts";
import type {Layout} from "react-grid-layout";


export type FormEditorContextValue = {
    state: FormDefinition,
    dispatch: React.Dispatch<FormEditorAction>
}

export const FormEditorContext = createContext<FormEditorContextValue | undefined>(undefined)

export function useFormEditor() {
    const context = useContext(FormEditorContext)
    if (!context) {
        throw new Error("useFormEditor must be used inside FormEditorContext");
    }

    return context;
}

export type FormEditorAction =
    | { type: "UPDATE_NAME", name: string }
    | { type: "UPDATE_ENABLED", value: boolean }
    | { type: "ADD_FIELD", stepKey: Key, field: FieldDefinition }
    | { type: "REMOVE_FIELD", stepKey: Key, fieldKey: Key }
    | { type: "UPDATE_FIELD_SETTINGS", stepKey: Key, fieldKey: Key, settings: PaletteItemSettingsValues }
    | { type: "SAVE_LAYOUT", stepKey: Key, layout: Layout }
export function useFormEditorActions() {
    const { dispatch } = useFormEditor();
    return {
        updateName: (name: string) =>
            dispatch({ type: "UPDATE_NAME", name }),
        updateEnabled: (value: boolean) =>
            dispatch({type: "UPDATE_ENABLED", value}),
        addField: (stepKey: Key, field: FieldDefinition) =>
            dispatch({ type: "ADD_FIELD", field: field, stepKey }),
        removeField: (stepKey: Key, fieldKey: Key) =>
            dispatch({ type: "REMOVE_FIELD", fieldKey, stepKey }),
        saveLayout: (stepKey: Key, layout: Layout) =>
            dispatch({ type: "SAVE_LAYOUT", stepKey, layout }),
        updateFieldSettings: (stepKey: Key, fieldKey: Key, settings: PaletteItemSettingsValues) =>
            dispatch({type: "UPDATE_FIELD_SETTINGS", fieldKey, settings, stepKey})
    }
}

export function useFormEditorSelectors() {
    const {state} = useFormEditor();
    return {
        getLayout: (stepKey: Key) => Object.entries(state.steps[stepKey].fields).map(v=>v[1].layout),
        getFormState: () => state,
        getName: ()=> state.name,
        getEnabled: ()=> state.enabled,
        getSteps: ()=> state.steps,
        getStep: (stepKey: Key) => {
            const r = state.steps[stepKey];
            if (!r) throw new Error(`no such step ${stepKey}`);
            return r;
        }
    }
}
