import type {FormDefinition} from "../../../logic/type.ts";
import {useReducer} from "react";
import {formReducer} from "./reducer.ts";
import {FormEditorContext} from "./context.ts";
import * as React from "react";



const INIT_FORM: FormDefinition = {
    name: "Simple form",
    enabled: true,
    firstStepKey: "start",
    steps: {
        "start": {
            key: "start",
            title: "First step",
            fields: {},
            // transition: {
            //     rules: [],
            //     defaultStep: "start",
            // }
        }
    },
    lookups: {},
    variables: {},
    constants: {},
    interactions: []
}

type CreateFormProviderProps = {
    initialState?: FormDefinition;
    children: React.ReactNode;
};

export function FormEditorProvider({ children, initialState }: CreateFormProviderProps) {
    const [state, dispatch] = useReducer(formReducer, initialState ?? INIT_FORM)
    return (
        <FormEditorContext.Provider value={{state, dispatch}}>
            {children}
        </FormEditorContext.Provider>
    )
}