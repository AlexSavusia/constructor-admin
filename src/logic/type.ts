import type {StepDefinition} from "./step.ts";
import type {LookupDefinition} from "./lookup.ts";

export type Key = string;

export type ValueType = "string" | "number" | "boolean" | "array" | "object" | "unknown" | "datetime";

export type FormDefinition = {
    firstStepKey: Key;
    steps: Record<Key, StepDefinition>
    lookups: Record<Key, LookupDefinition>
    constants: Record<Key, ConstVariableDefinition>
    variables: Record<Key, RuntimeVariableDefinition>
    interactions: unknown[]
}

export type ConstVariableDefinition = {
    __typ: "constant"
    key: Key;
    label: string
    valueType: ValueType;
    value: unknown;
}

export type RuntimeVariableDefinition = {
    __typ: "variable"
    key: Key;
    label: string
    valueType: ValueType;
    defaultValue?: unknown;
}

export type ExpressionScope =
    | "FIELD_SCOPE_DECISION" // простые булевые операции
    | "FIELD_SCOPE_PROPERTY" // изменение свойств поля
    | "FIELD_ON_UPDATE_SCOPE" //
    | "LOOKUP_ROW_SCOPE" // условие доступности строки справочника для выбора
    | "STEP_TRANSITION_SCOPE"; // переход на следующий шаг
