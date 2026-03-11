import type {StepDefinition} from "./step.ts";
import type {LookupDefinition} from "./lookup.ts";

export type Key = string;

export type ValueType = "string" | "number" | "boolean" | "array" | "object" | "unknown" | "datetime";

export type FormDefinition = {
    name: string;
    enabled: boolean;
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
    | "FIELD_SCOPE"
    | "FIELD_ON_UPDATE_SCOPE"
    | "LOOKUP_BASE_FILTER_SCOPE"
    | "LOOKUP_ROW_SCOPE"
    | "STEP_TRANSITION_SCOPE";

export type ScopeCapabilities = {
    canRead: Array<"self" | "field" | "variable" | "constant" | "row">;
    canWrite?: Array<"field" | "variable">;
};