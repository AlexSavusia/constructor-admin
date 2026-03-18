import type { StepDefinition } from './step.ts';
import type { LookupDefinition } from './lookup.ts';
import type { ObjPath } from '../pages/Programs/editor/EditorContext.tsx';
import type { FormContextValue } from '../pages/HomePage.tsx';

export type Key = string;

export type ValueType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'unknown' | 'datetime';

export type FormDefinition = {
    firstStepKey: Key;
    steps: Record<Key, StepDefinition>;
    lookups: Record<Key, LookupDefinition>;
    constants: Record<Key, ConstVariableDefinition>;
    variables: Record<Key, RuntimeVariableDefinition>;
    interactions: Record<Key, InteractionDefinition>;
};

export type ConstVariableDefinition = {
    __typ: 'constant';
    key: Key;
    label: string;
    valueType: ValueType;
    value: unknown;
};

export type RuntimeVariableDefinition = {
    __typ: 'variable';
    key: Key;
    label: string;
    valueType: ValueType;
    defaultValue?: unknown;
};

export type ExpressionScope =
    | 'FIELD_SCOPE_DECISION' // простые булевые операции
    | 'FIELD_SCOPE_PROPERTY' // изменение свойств поля
    // | 'FIELD_ON_UPDATE_SCOPE' //
    | 'LOOKUP_ROW_SCOPE' // условие доступности строки справочника для выбора
    | 'STEP_TRANSITION_SCOPE'; // переход на следующий шаг

export type InteractionDefinition<T = unknown> = {
    key: Key;
    title: string;
    dependentFields: ObjPath[];
    execute: (
        abort: AbortSignal,
        contextVariables: Record<string, unknown>
    ) => Promise<(state: FormContextValue) => Partial<FormContextValue>>;
};

type CalculateRs = {};

const CalculateInteraction: InteractionDefinition<CalculateRs> = {
    key: 'calculate',
    title: 'Рассчет',
    execute: async (as, contextVariables) => {
        return (state) => ({
            fieldsValues: {
                ...state.fieldsValues,
                foo: 'bar',
            },
        });
    },
};

type ContractRs = {
    contract: string;
};

const ContractNumberInteraction: InteractionDefinition<ContractRs> = {
    key: 'contractNumber',
    title: 'Номер договора',
    execute: async (as, contextVariables) => {
        return (state) => ({
            fieldsValues: {
                ...state.fieldsValues,
                foo: 'bar',
            },
        });
    },
};
