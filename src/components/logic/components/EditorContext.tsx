import type {EditorState, FormEditorAction} from "../types.ts";
import * as React from "react";
import {createContext, useContext} from "react";
import type {FieldDefinition} from "../../../logic/field.ts";
import type {ConstVariableDefinition, Key, RuntimeVariableDefinition} from "../../../logic/type.ts";
import type {BooleanExpression, ValueExpression} from "../../../logic/expression.ts";
import {getByPath, type NodePath} from "./reducer.ts";

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

export function useEditorSelectors() {
    const { state } = useEditor();
    const { stepKey } = state

    return {
        getCurrentFieldKey: () => state.fieldKey,
        getCurrentField: () => {
            const r = Object.entries(state.form.steps[stepKey].fields).find((v) => v[1].key === state.fieldKey)
            return r ? r[1] : null
        },
        getVariable: (varKey: string) => {
            const r = Object.entries(state.form.variables).find((v) => v[1].key === varKey)
            return r ? r[1] : null
        },
        getField: (fieldKey: Key): FieldDefinition | null => {
            const r = Object.entries(state.form.steps[stepKey].fields).find((v) => v[1].key === fieldKey)
            return r ? r[1] : null
        },
        getDefinitionByPath: (path: NodePath) => {
            const unknownResolve = getByPath(state, path);
            if(!unknownResolve)
                return null;
            if("__typ" in path){
                return unknownResolve as FieldDefinition;
            } else if("variables" in path){
                return unknownResolve as RuntimeVariableDefinition;
            } else if("constants" in path){
                return unknownResolve as ConstVariableDefinition;
            }
            throw new Error("Failed to determine type of resolver object")
        },
        getFieldPaths: (selfKey: Key | null): NodePath[] => {
            const fieldPaths: string[][] = []
            for(const [stepKey] of Object.entries(state.form.steps)) {
                for(const [fieldKey] of Object.entries(state.form.steps[stepKey].fields)) {
                    if(selfKey != null && fieldKey === selfKey) {
                        continue // dont add self reference as field
                    }
                    fieldPaths.push(["form", "steps", stepKey, fieldKey])
                }
            }
            return fieldPaths
        },
        getVariablePaths: (): NodePath[] => {
            return Object.entries(state.form.variables).map(v=>["form", "variables", v[0]])
        },
        getConstantPaths: (): NodePath[] => {
            return Object.entries(state.form.constants).map(v=>["form", "constants", v[0]])
        },
        getSelfByNodePath(nodePath: NodePath): FieldDefinition | null {
            return (getByPath(state, nodePath) as FieldDefinition | undefined) ?? null
        }
    }
}

export function useEditorActions() {
    const {dispatch} = useEditor();
    return {
        updateCondition: (path: NodePath, condition: BooleanExpression) =>
            dispatch({type: "SET_CONDITION_BY_PATH", path, condition}),
        updateAction: (path: NodePath, action: ValueExpression) =>
            dispatch({type: "SET_ACTION_BY_PATH", path, action}),
        patchCondition: (path: NodePath, condition: Partial<BooleanExpression | ValueExpression>) =>
            dispatch({type: "PATCH_CONDITION_BY_PATH", path, condition}),
    }
}

// export function useEditorActions() {
//     const { dispatch, state } = useEditor();
//     const { stepKey } = state
//     return {
//         setOnUpdateToField: (field: FieldDefinition, payload: FieldOnUpdateDefinition) =>
//             dispatch({ type: "ADD_ON_UPDATE", stepKey, field, payload}),
//
//         updateOnUpdateOnField: (field: FieldDefinition, patch: Partial<FieldOnUpdateDefinition> ) =>
//             dispatch({ type: "UPDATE_ON_UPDATE", stepKey, field, patch}),
//
//         deleteOnUpdateFromField: (field: FieldDefinition) =>
//             dispatch({type: "DELETE_ON_UPDATE", stepKey, field}),
//
//         setFieldVisibilityExpression: (field: FieldDefinition, payload: BooleanPropertyLogicDefinition) =>
//             dispatch({type: "ADD_BOOL_PROPERTY_LOGIC", stepKey, logicKey: "visibility", field, payload}),
//
//         updateFieldVisibilityExpression: (field: FieldDefinition, patch: BooleanPropertyLogicDefinition) =>
//             dispatch({type: "UPDATE_BOOL_PROPERTY_LOGIC", stepKey, logicKey: "visibility", field, patch}),
//
//         deleteFieldVisibilityExpression: (field: FieldDefinition) =>
//             dispatch({type: "DELETE_BOOL_PROPERTY_LOGIC", stepKey, logicKey: "visibility", field}),
//
//         setFieldEnabledExpression: (field: FieldDefinition, payload: BooleanPropertyLogicDefinition) =>
//             dispatch({type: "ADD_BOOL_PROPERTY_LOGIC", stepKey, logicKey: "enabled", field, payload}),
//
//         updateFieldEnabledExpression: (field: FieldDefinition, patch: BooleanPropertyLogicDefinition) =>
//             dispatch({type: "UPDATE_BOOL_PROPERTY_LOGIC", stepKey, logicKey: "enabled", field, patch}),
//
//         deleteFieldEnabledExpression: (field: FieldDefinition) =>
//             dispatch({type: "DELETE_BOOL_PROPERTY_LOGIC", stepKey, logicKey: "enabled", field}),
//
//         setFieldRequiredExpression: (field: FieldDefinition, payload: BooleanPropertyLogicDefinition) =>
//             dispatch({type: "ADD_BOOL_PROPERTY_LOGIC", stepKey, logicKey: "required", field, payload}),
//
//         updateFieldRequiredExpression: (field: FieldDefinition, patch: BooleanPropertyLogicDefinition) =>
//             dispatch({type: "UPDATE_BOOL_PROPERTY_LOGIC", stepKey, logicKey: "required", field, patch}),
//
//         deleteFieldRequiredExpression: (field: FieldDefinition) =>
//             dispatch({type: "DELETE_BOOL_PROPERTY_LOGIC", stepKey, logicKey: "required", field}),
//
//         setFieldValueExpression: (field: FieldDefinition, payload: ValueLogicDefinition) =>
//             dispatch({type: "ADD_VALUE_LOGIC", stepKey, field, payload}),
//
//         updateFieldValueExpression: (field: FieldDefinition, patch: ValueLogicDefinition) =>
//             dispatch({type: "UPDATE_VALUE_LOGIC", stepKey, field, patch}),
//
//         deleteFieldValueExpression: (field: FieldDefinition) =>
//             dispatch({type: "DELETE_VALUE_LOGIC", stepKey, field}),
//
//
//     };
// }