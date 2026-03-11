import type {EditorState, FormEditorAction} from "../types.ts";

export type NodePath = Array<string | number>;

export function setByPath<T>(obj: T, path: NodePath, value: unknown): T {
    if (path.length === 0) {
        return value as T;
    }

    const [head, ...tail] = path;

    if (Array.isArray(obj)) {
        const copy = [...obj];
        copy[head as number] = setByPath(copy[head as number], tail, value);
        return copy as T;
    }

    return {
        ...(obj as Record<string, unknown>),
        [head]: setByPath(
            (obj as Record<string, unknown>)[head as string],
            tail,
            value
        ),
    } as T;
}

export function patchByPath<T extends object>(
    obj: T,
    path: NodePath,
    patch: Record<string, unknown>
): T {
    const target = getByPath(obj, path);

    return setByPath(obj, path, {
        ...(target as Record<string, unknown>),
        ...patch,
    });
}

export function getByPath(obj: unknown, path: NodePath): unknown {
    return path.reduce((acc, key) => {
        if (acc == null) return undefined;
        // @ts-expect-error no error bruh
        return (acc)[key];
    }, obj);
}

export default function editorReducer(state: EditorState, action: FormEditorAction): EditorState {
    const t = action.type
    switch (action.type) {
        case "SET_CONDITION_BY_PATH": {
            return {
                ...state,
                form: setByPath(state.form, action.path, action.condition)
            };
        }
        case "SET_ACTION_BY_PATH": {
            return {
                ...state,
                form: setByPath(state.form, action.path, action.action)
            };
        }
        case "PATCH_CONDITION_BY_PATH": {
            return {
                ...state,
                form: patchByPath(state.form, action.path, action.condition)
            };
        }
        default:
            throw new Error(`Unknown action type ${t}`);
    }
}