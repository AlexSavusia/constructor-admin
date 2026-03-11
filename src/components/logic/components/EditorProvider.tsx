import type {EditorState} from "../types.ts";
import {useReducer} from "react";
import editorReducer from "./reducer.ts";
import * as React from "react";
import { EditorContext } from "./EditorContext.tsx";

type EditorProviderProps = {
    initialState: EditorState;
    children: React.ReactNode;
};

export function EditorProvider({ initialState, children }: EditorProviderProps) {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
}