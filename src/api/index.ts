import axios, { AxiosError } from 'axios';
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
} from './types.ts';

const mockDictionaries: DictionarySchema[] = [
    {
        id: 'countries',
        name: 'Страны',
        description: 'Справочник стран',
        groupId: null,
        schema: [
            { id: 'countries-name', name: 'Название', fieldType: 'Text' },
            { id: 'countries-code', name: 'Код', fieldType: 'Text' },
            { id: 'countries-active', name: 'Активна', fieldType: 'Boolean' },
        ],
    },
    {
        id: 'cities',
        name: 'Города',
        description: 'Справочник городов',
        groupId: null,
        schema: [
            { id: 'cities-name', name: 'Название', fieldType: 'Text' },
            { id: 'cities-population', name: 'Население', fieldType: 'Number' },
            { id: 'cities-capital', name: 'Столица', fieldType: 'Boolean' },
        ],
    },
    {
        id: 'genders',
        name: 'Пол',
        description: 'Справочник пола',
        groupId: null,
        schema: [
            { id: 'genders-name', name: 'Название', fieldType: 'Text' },
            { id: 'genders-code', name: 'Код', fieldType: 'Text' },
        ],
    },
    {
        id: 'documentTypes',
        name: 'Типы документов',
        description: 'Справочник документов',
        groupId: null,
        schema: [
            { id: 'documentTypes-name', name: 'Название', fieldType: 'Text' },
            { id: 'documentTypes-seriesRequired', name: 'Нужна серия', fieldType: 'Boolean' },
            { id: 'documentTypes-createdAt', name: 'Дата создания', fieldType: 'Datetime' },
        ],
    },
];

const mockDictionaryRowsMap: Record<string, DictionaryRow[]> = {
    countries: [
        {
            id: 'country-1',
            dictId: 'countries',
            order: 1,
            data: {
                'countries-name': { type: 'COMMON', value: 'Москва' },
                'countries-code': { type: 'COMMON', value: 'MS' },
                'countries-active': { type: 'COMMON', value: true },
            },
        },
        {
            id: 'country-2',
            dictId: 'countries',
            order: 2,
            data: {
                'countries-name': { type: 'COMMON', value: 'Казахстан' },
                'countries-code': { type: 'COMMON', value: 'KZ' },
                'countries-active': { type: 'COMMON', value: true },
            },
        },
    ],
    cities: [
        {
            id: 'city-1',
            dictId: 'cities',
            order: 1,
            data: {
                'cities-name': { type: 'COMMON', value: 'Россия' },
                'cities-population': { type: 'COMMON', value: 1200000 },
                'cities-capital': { type: 'COMMON', value: true },
            },
        },
        {
            id: 'city-2',
            dictId: 'cities',
            order: 2,
            data: {
                'cities-name': { type: 'COMMON', value: 'Новосибирск' },
                'cities-population': { type: 'COMMON', value: 350000 },
                'cities-capital': { type: 'COMMON', value: false },
            },
        },
    ],
    genders: [
        {
            id: 'gender-1',
            dictId: 'genders',
            order: 1,
            data: {
                'genders-name': { type: 'COMMON', value: 'Мужской' },
                'genders-code': { type: 'COMMON', value: 'male' },
            },
        },
        {
            id: 'gender-2',
            dictId: 'genders',
            order: 2,
            data: {
                'genders-name': { type: 'COMMON', value: 'Женский' },
                'genders-code': { type: 'COMMON', value: 'female' },
            },
        },
    ],
    documentTypes: [
        {
            id: 'doc-1',
            dictId: 'documentTypes',
            order: 1,
            data: {
                'documentTypes-name': { type: 'COMMON', value: 'Паспорт' },
                'documentTypes-seriesRequired': { type: 'COMMON', value: true },
                'documentTypes-createdAt': { type: 'COMMON', value: '2026-01-01T10:00:00' },
            },
        },
        {
            id: 'doc-2',
            dictId: 'documentTypes',
            order: 2,
            data: {
                'documentTypes-name': { type: 'COMMON', value: 'ID карта' },
                'documentTypes-seriesRequired': { type: 'COMMON', value: false },
                'documentTypes-createdAt': { type: 'COMMON', value: '2026-01-03T12:30:00' },
            },
        },
    ],
};

export const toApiError = (err: unknown): ApiError => {
    if (axios.isAxiosError(err)) {
        const ax = err as AxiosError<unknown>;

        if (!ax.response) {
            return { type: 'network error', title: ax.message || 'Network error' };
        }

        const status = ax.response.status;
        const data = ax.response.data;

        if (isApiError(data)) return data;

        return { type: 'unknown', status, title: ax.message || `HTTP ${status}` };
    }

    if (err instanceof Error) return { type: 'unknown', title: err.message };

    return { type: 'unknown', title: 'Unknown error' };
};

const api = axios.create({ baseURL: '/api' });

api.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(toApiError(err))
);

function toQueryString<T extends Record<string, unknown>>(obj: T): string {
    const qs = new URLSearchParams(
        Object.entries(obj)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
    );

    const s = qs.toString();
    return s ? `?${s}` : '';
}

/**
 * ============================================================
 * API methods
 * ============================================================
 */

export const getDictionaryRows = async (
    rq: PageableRq,
    dictId: string,
    signal?: AbortSignal
): Promise<PageableRs<DictionaryRow>> => {
    try {
        return (await api.get<PageableRs<DictionaryRow>>(`/dictionary/${dictId}${toQueryString(rq)}`, { signal })).data;
    } catch (error) {
        console.error('getDictionaryRows failed, using mock dictionary rows', error);

        const rows = mockDictionaryRowsMap[dictId] ?? [];

        return {
            page: rq.page ?? 0,
            size: rq.size ?? rows.length,
            total: rows.length,
            data: rows,
        };
    }
};

export const addDictionaryRow = async (
    dictId: string,
    rows: CreateDictionaryRow,
    signal?: AbortSignal
): Promise<DictionaryRow[]> => (await api.put<DictionaryRow[]>(`/dictionary/${dictId}`, rows, { signal })).data;

export const deleteDictionaryRow = async (rowId: string, signal?: AbortSignal): Promise<void> => {
    await api.delete(`/dictionary/${rowId}`, { signal });
};

export const updateDictionaryRow = async (rowId: string, rq: CreateDictionaryRow, signal?: AbortSignal): Promise<DictionaryRow> =>
    (await api.patch<DictionaryRow>(`/dictionary/${rowId}`, { schemaId: rq.dictId, data: rq.data }, { signal })).data;

export const createDictionary = async (rq: CreateDictionarySchema, signal?: AbortSignal): Promise<DictionarySchema> =>
    (await api.put<DictionarySchema>('/dictionary-schema', rq, { signal })).data;

export const getDictionaries = async (rq: PageableRq, signal?: AbortSignal): Promise<PageableRs<DictionarySchema>> => {
    try {
        return (await api.get<PageableRs<DictionarySchema>>(`/dictionary-schema${toQueryString(rq)}`, { signal })).data;
    } catch (error) {
        console.error('getDictionaries failed, using mock dictionaries', error);

        return {
            page: rq.page ?? 0,
            size: rq.size ?? mockDictionaries.length,
            total: mockDictionaries.length,
            data: mockDictionaries,
        };
    }
};

export const getDictionary = async (id: string, signal?: AbortSignal): Promise<DictionarySchema> =>
    (await api.get<DictionarySchema>(`/dictionary-schema/${id}`, { signal })).data;

export const updateDictionary = async (id: string, rq: UpdateDictionarySchema, signal?: AbortSignal): Promise<DictionarySchema> =>
    (await api.patch<DictionarySchema>(`/dictionary-schema/${id}`, rq, { signal })).data;

export const deleteDictionary = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/dictionary-schema/${id}`, { signal });

export const createDictionaryGroup = async (rq: CreateGroup, signal?: AbortSignal): Promise<Group> =>
    (await api.put<Group>('/dictionary-schema/group', rq, { signal })).data;

export const updateDictionaryGroup = async (id: string, rq: UpdateGroup, signal?: AbortSignal): Promise<Group> =>
    (await api.patch<Group>(`/dictionary-schema/group/${id}`, rq, { signal })).data;

export const deleteDictionaryGroup = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/dictionary-schema/group/${id}`, { signal });

export const getDictionaryGroupTree = async (signal?: AbortSignal): Promise<GroupNode[]> =>
    (await api.get<GroupNode[]>('/dictionary-schema/group', { signal })).data;

export const deleteFormula = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/formula/${id}`, { signal });

export const createFormulaGroup = async (rq: CreateGroup, signal?: AbortSignal): Promise<Group> =>
    (await api.put<GroupNode>(`/formula/group`, rq, { signal })).data;

export const updateFormulaGroup = async (id: string, rq: UpdateGroup, signal?: AbortSignal): Promise<Group> =>
    (await api.patch<GroupNode>(`/formula/group/${id}`, rq, { signal })).data;

export const deleteFormulaGroup = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/formula/group/${id}`, { signal });

export const getFormulaGroupTree = async (signal?: AbortSignal): Promise<GroupNode[]> =>
    (await api.get('/formula/group', { signal })).data;

export const getProgramTemplates = async (rq: PageableRq, signal?: AbortSignal): Promise<PageableRs<ProgramTemplate>> =>
    (
        await api.get<PageableRs<ProgramTemplate>>(`/program-template${toQueryString(rq)}`, {
            signal,
        })
    ).data;

export const updateProgramTemplate = async (
    id: string,
    rq: UpdateProgramTemplate,
    signal?: AbortSignal
): Promise<ProgramTemplate> => (await api.patch<ProgramTemplate>(`/program-template/${id}`, rq, { signal })).data;

export const deleteProgramTemplate = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/program-template/${id}`, { signal });

export const getProgramTemplate = async (id: string, signal?: AbortSignal): Promise<ProgramTemplate> =>
    (await api.get<ProgramTemplate>(`/program-template/${id}`, { signal })).data;

export const createProgram = async (rq: CreateProgram, signal?: AbortSignal): Promise<Program> =>
    (await api.put<Program>('/program', rq, { signal })).data;

export const updateProgram = async (id: string, rq: UpdateProgram, signal?: AbortSignal): Promise<ProgramTemplate> =>
    (await api.patch<Program>(`/program/${id}`, rq, { signal })).data;

export const deleteProgram = async (id: string, signal?: AbortSignal): Promise<void> =>
    await api.delete(`/program/${id}`, { signal });

export const getProgram = async (id: string, signal?: AbortSignal): Promise<Program> =>
    (await api.get<Program>(`/program/${id}`, { signal })).data;

export const getPrograms = async (rq: PageableRq, signal?: AbortSignal): Promise<PageableRs<Program>> =>
    (await api.get(`/program${toQueryString(rq)}`, { signal })).data;
