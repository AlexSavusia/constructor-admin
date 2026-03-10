import type {EditorState, FormEditorAction} from "../types.ts";
import * as React from "react";
import {createContext, useContext} from "react";
import type {FieldDefinition, FieldOnUpdateDefinition} from "../../../logic/field.ts";

type EditorContextValue = {
    state: EditorState;
    dispatch: React.Dispatch<FormEditorAction>;
}

export const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export function useEditor() {
    const context = useContext(EditorContext);

    if (!context) {
        throw new Error("useEditor must be used inside EditorProvider");
    }

    return context;
}

export function useEditorActions() {
    const { dispatch, state } = useEditor();
    const { stepKey } = state
    return {
        setOnUpdateToField: (field: FieldDefinition, payload: FieldOnUpdateDefinition) =>
            dispatch({ type: "ADD_ON_UPDATE", stepKey, field, payload}),

        updateOnUpdateOnField: (field: FieldDefinition, patch: Partial<FieldOnUpdateDefinition> ) =>
            dispatch({ type: "UPDATE_ON_UPDATE", stepKey, field, patch}),

        deleteOnUpdateFromField: (field: FieldDefinition) =>
            dispatch({type: "DELETE_ON_UPDATE", stepKey, field}),

        //add FieldLogicDefinition reducers
    };
}