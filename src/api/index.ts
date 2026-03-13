import axios, { AxiosError } from "axios";
import {
    type ApiError,
    type CreateGroup,
    type CreateDictionarySchema,
    type DictionarySchema,
    type Group,
    type GroupNode,
    isApiError,
    type PageableRq,
    type PageableRs,
    type ProgramTemplate,
    type UpdateDictionarySchema,
    type UpdateGroup,
    type UpdateProgramTemplate,
    type DictionaryRow,
    type CreateDictionaryRow,
    type CreateProgram,
    type Program,
     type UpdateProgram,
} from "./types.ts";

export const toApiError = (err: unknown): ApiError => {
    if (axios.isAxiosError(err)) {
        const ax = err as AxiosError<unknown>;

        if (!ax.response) {
            return { type: "network error", title: ax.message || "Network error" };
        }

        const status = ax.response.status;
        const data = ax.response.data;

        if (isApiError(data)) return data;

        return { type: "unknown", status, title: ax.message || `HTTP ${status}` };
    }

    if (err instanceof Error) return { type: "unknown", title: err.message };

    return { type: "unknown", title: "Unknown error" };
};

const api = axios.create({ baseURL: "/api" });

api.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(toApiError(err)),
);

function toQueryString<T extends Record<string, unknown>>(obj: T): string {
    const qs = new URLSearchParams(
        Object.entries(obj)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]),
    );

    const s = qs.toString();
    return s ? `?${s}` : "";
}

/**
 * ============================================================
 * API methods
 * ============================================================
 */

export const getDictionaryRows = async (
    rq: PageableRq,
    dictId: string,
    signal?: AbortSignal,
): Promise<PageableRs<DictionaryRow>> =>
    (
        await api.get<PageableRs<DictionaryRow>>(`/dictionary/${dictId}${toQueryString(rq)}`, {
            signal,
        })
    ).data;

export const addDictionaryRow = async (
    dictId: string,
    rows: CreateDictionaryRow,
    signal?: AbortSignal,
): Promise<DictionaryRow[]> => (await api.put<DictionaryRow[]>(`/dictionary/${dictId}`, rows, { signal })).data;

export const deleteDictionaryRow = async (rowId: string, signal?: AbortSignal): Promise<void> => {
    await api.delete(`/dictionary/${rowId}`, { signal });
};

export const updateDictionaryRow = async (
    rowId: string,
    rq: CreateDictionaryRow,
    signal?: AbortSignal,
): Promise<DictionaryRow> =>
    (
        await api.patch<DictionaryRow>(
            `/dictionary/${rowId}`,
            { schemaId: rq.dictId, data: rq.data },
            { signal },
        )
    ).data;

export const createDictionary = async (
    rq: CreateDictionarySchema,
    signal?: AbortSignal,
): Promise<DictionarySchema> => (await api.put<DictionarySchema>("/dictionary-schema", rq, { signal })).data;

export const getDictionaries = async (
    rq: PageableRq,
    signal?: AbortSignal,
): Promise<PageableRs<DictionarySchema>> =>
    (
        await api.get<PageableRs<DictionarySchema>>(`/dictionary-schema${toQueryString(rq)}`, {
            signal,
        })
    ).data;

export const getDictionary = async (id: string, signal?: AbortSignal): Promise<DictionarySchema> =>
    (await api.get<DictionarySchema>(`/dictionary-schema/${id}`, { signal })).data;

export const updateDictionary = async (
    id: string,
    rq: UpdateDictionarySchema,
    signal?: AbortSignal,
): Promise<DictionarySchema> => (await api.patch<DictionarySchema>(`/dictionary-schema/${id}`, rq, { signal })).data;

export const deleteDictionary = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/dictionary-schema/${id}`, { signal });

export const createDictionaryGroup = async (rq: CreateGroup, signal?: AbortSignal): Promise<Group> =>
    (await api.put<Group>("/dictionary-schema/group", rq, { signal })).data;

export const updateDictionaryGroup = async (id: string, rq: UpdateGroup, signal?: AbortSignal): Promise<Group> =>
    (await api.patch<Group>(`/dictionary-schema/group/${id}`, rq, { signal })).data;

export const deleteDictionaryGroup = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/dictionary-schema/group/${id}`, { signal });

export const getDictionaryGroupTree = async (signal?: AbortSignal): Promise<GroupNode[]> =>
    (await api.get<GroupNode[]>("/dictionary-schema/group", { signal })).data;

export const deleteFormula = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/formula/${id}`, { signal });

export const createFormulaGroup = async (rq: CreateGroup, signal?: AbortSignal): Promise<Group> =>
    (await api.put<GroupNode>(`/formula/group`, rq, { signal })).data;

export const updateFormulaGroup = async (id: string, rq: UpdateGroup, signal?: AbortSignal): Promise<Group> =>
    (await api.patch<GroupNode>(`/formula/group/${id}`, rq, { signal })).data;

export const deleteFormulaGroup = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/formula/group/${id}`, { signal });

export const getFormulaGroupTree = async (signal?: AbortSignal): Promise<GroupNode[]> =>
    (await api.get("/formula/group", { signal })).data;


export const getProgramTemplates = async (
    rq: PageableRq,
    signal?: AbortSignal,
): Promise<PageableRs<ProgramTemplate>> =>
    (
        await api.get<PageableRs<ProgramTemplate>>(`/program-template${toQueryString(rq)}`, {
            signal,
        })
    ).data;

export const updateProgramTemplate = async (
    id: string,
    rq: UpdateProgramTemplate,
    signal?: AbortSignal,
): Promise<ProgramTemplate> =>
    (await api.patch<ProgramTemplate>(`/program-template/${id}`, rq, { signal })).data;

export const deleteProgramTemplate = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/program-template/${id}`, { signal });

export const getProgramTemplate = async (id: string, signal?: AbortSignal): Promise<ProgramTemplate> =>
    (await api.get<ProgramTemplate>(`/program-template/${id}`, { signal })).data;

export const createProgram = async (rq: CreateProgram, signal?: AbortSignal): Promise<Program> =>
    (await api.put<Program>("/program", rq, { signal })).data;

export const updateProgram = async (id: string, rq: UpdateProgram, signal?: AbortSignal): Promise<ProgramTemplate> =>
    (await api.patch<Program>(`/program/${id}`, rq, { signal })).data;

export const deleteProgram = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/program/${id}`, { signal });

export const getProgram = async (id: string, signal?: AbortSignal): Promise<Program> =>
    (await api.get<Program>(`/program/${id}`, { signal })).data;

export const getPrograms = async (rq: PageableRq, signal?: AbortSignal): Promise<PageableRs<Program>> =>
    (await api.get(`/program${toQueryString(rq)}`, { signal })).data;