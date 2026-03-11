import type {Key, ValueType} from "./type.ts";
import type {BooleanPropertyLogicDefinition, FieldOnUpdateRule, ValueLogicDefinition} from "./logic.ts";

export type FieldType = "input" | "output"

export type InputFieldControlType =
    | "input"
    | "textarea"
    | "number"
    | "checkbox"
    | "select"
    | "multiselect"
    | "array";

export interface FieldCapabilities {
    canBeVisible: boolean;
    canBeEnabled: boolean;
    canBeRequired: boolean;
    canBeSetValue: boolean;
}

export interface BaseFieldDefinition {
    key: Key
    label?: string

    valueType?: ValueType
    defaultValue?: unknown

    fieldType: FieldType
    capabilities: FieldCapabilities

    layout: unknown //TODO
    config?: unknown // TODO

    logic?: FieldLogicDefinition
    onUpdate?: FieldOnUpdateDefinition
}

export interface InputFieldDefinition extends BaseFieldDefinition {
    fieldType: "input"
    control: InputFieldControlType

    lookup?: FieldLookupBinding // only used in select/multiselect
}

export interface OutputFieldDefinition extends BaseFieldDefinition {
    fieldType: "output"
    control: InputFieldControlType
}

export type FieldLookupBinding = {
    lookupKey: Key
    valueColumnId: string
    labelColumnId: string

    rowAvailability: Record<string, LookupRowAvailabilityDefinition> //key - row id in dict
}

export type LookupRowAvailabilityDefinition = {
    enabled?: BooleanPropertyLogicDefinition
    selectable?: BooleanPropertyLogicDefinition
}

export type FieldLogicType = keyof FieldLogicDefinition

export type FieldLogicDefinition = {
    visibility?: BooleanPropertyLogicDefinition;
    enabled?: BooleanPropertyLogicDefinition;
    required?: BooleanPropertyLogicDefinition;
    value?: ValueLogicDefinition; //this will have higher priority then onUpdate if both are set (or just do not allow setting both?)
}

export type FieldDefinition =
    | InputFieldDefinition
    | OutputFieldDefinition;

export type FieldOnUpdateDefinition = {
    rules: FieldOnUpdateRule[]
}