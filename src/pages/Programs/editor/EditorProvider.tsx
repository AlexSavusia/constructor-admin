import { useRef } from 'react';
import * as React from 'react';
import { createContextStore, EditorContext, type EditorStateValue } from './EditorContext.tsx';
import type {FormDefinition} from "../../../logic/type.ts";

type EditorProviderProps = {
    initialState?: FormDefinition;
    children: React.ReactNode;
};

export function EditorProvider({ initialState, children }: EditorProviderProps) {
    const storeRef = useRef<ReturnType<typeof createContextStore> | null>(null);

    // eslint-disable-next-line react-hooks/refs
    if (!storeRef.current) {
        storeRef.current = createContextStore(initialState);
    }

    return (
        // eslint-disable-next-line react-hooks/refs
        <EditorContext.Provider value={storeRef.current}>{children}</EditorContext.Provider>
    );
}
