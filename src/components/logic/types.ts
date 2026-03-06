export type ValueType =
    | "string"
    | "number"
    | "boolean"
    | "datetime"
    | "object"
    | "unknown";

export type FieldKind =
    | "text"
    | "textarea"
    | "number"
    | "checkbox"
    | "datetime"
    | "select"
    | "radio"
    | "list"
    | "custom";

export type EntityOrigin = "persisted" | "draft";

export interface BaseMeta {
    id: string;
    code: string;
    label: string;
    description?: string;
    origin: EntityOrigin;
}

export interface FieldCapabilities {
    canBeRequired: boolean;
    canBeVisible: boolean;
    canBeEnabled: boolean;
    canBeSetValue: boolean;
    canBeCompared: boolean;
}

export interface FieldLookupBindingMeta {
    lookupId: string;

    valueField: string;
    labelField: string;

    usesRuntimeFilter: boolean;
    usesConfigFilter: boolean;
    usesItemSelectableWhen: boolean;
    usesItemVisibleWhen: boolean;
}

export interface FieldMeta extends BaseMeta {
    entityType: "field";

    kind: FieldKind;
    valueType: ValueType;

    multiple?: boolean;

    requiredByDefault?: boolean;
    visibleByDefault?: boolean;
    enabledByDefault?: boolean;

    capabilities: FieldCapabilities;

    lookupBinding?: FieldLookupBindingMeta; //если поле селектор связанный со справичником то тут храним инфу про это

    tags?: string[];
}

export interface VariableMeta extends BaseMeta {
    entityType: "variable";

    valueType: ValueType;

    mutable: boolean;
    computed?: boolean;

    canBeUsedInConditions: boolean;
    canBeAssigned: boolean;

    tags?: string[];
}

//"колонка(?)"
export interface LookupFieldMeta {
    path: string;
    label: string;
    valueType: ValueType;

    nullable?: boolean;
    searchable?: boolean;

    isKey?: boolean;
    isLabel?: boolean;
}

export interface LookupMeta extends BaseMeta {
    entityType: "lookup";

    itemType: "object";

    fields: LookupFieldMeta[];

    keyField?: string;
    labelField?: string;

    alwaysAvailable: boolean;

    supportsConfigFilter: boolean;
    supportsRuntimeFilter: boolean;
    supportsItemSelectableWhen: boolean;
    supportsItemVisibleWhen: boolean;

    tags?: string[];
}

export type EditorEntityMeta = FieldMeta | VariableMeta | LookupMeta;

export interface FieldRefMeta {
    entityType: "field";

    id: string;
    code: string;
    label: string;
    origin: EntityOrigin;

    kind: FieldKind;
    valueType: ValueType;

    capabilities: FieldCapabilities;

    lookupBinding?: FieldLookupBindingMeta;
}

export interface VariableRefMeta {
    entityType: "variable";

    id: string;
    code: string;
    label: string;
    origin: EntityOrigin;

    valueType: ValueType;

    mutable: boolean;
    canBeUsedInConditions: boolean;
    canBeAssigned: boolean;
}

export interface LookupFieldRefMeta {
    lookupId: string;
    lookupCode: string;

    name: string;
    label: string;
    valueType: ValueType;

    isKey: boolean;
    isLabel: boolean;
}

export interface LookupRefMeta {
    entityType: "lookup";

    id: string;
    code: string;
    label: string;
    origin: EntityOrigin;

    fields: LookupFieldRefMeta[];

    keyField?: string;
    labelField?: string;

    supportsConfigFilter: boolean;
    supportsRuntimeFilter: boolean;
    supportsItemSelectableWhen: boolean;
    supportsItemVisibleWhen: boolean;
}

export type OperandKind = "field" | "variable" | "lookupField";

export interface FieldOperandRef {
    kind: "field";
    fieldId: string;
}

export interface VariableOperandRef {
    kind: "variable";
    variableId: string;
}

export interface LookupFieldOperandRef {
    kind: "lookupField";
    lookupId: string;
    fieldName: string;
}

export type OperandRef =
    | FieldOperandRef
    | VariableOperandRef
    | LookupFieldOperandRef;

export interface OperandMeta {
    key: string; // field:driverAge / variable:hasDiscount / lookupField:cities:countryCode
    label: string; // Field . Age
    kind: OperandKind;

    valueType: ValueType;

    ref: OperandRef;

    origin: EntityOrigin;
}

export function makeFieldOperandKey(fieldId: string): string {
    return `field:${fieldId}`;
}

export function makeVariableOperandKey(variableId: string): string {
    return `variable:${variableId}`;
}

export function makeLookupFieldOperandKey(lookupId: string, fieldName: string): string {
    return `lookupField:${lookupId}:${fieldName}`;
}

export type ActionTargetKind = "field" | "variable";

export interface FieldActionTargetRef {
    kind: "field";
    fieldId: string;
}

export interface VariableActionTargetRef {
    kind: "variable";
    variableId: string;
}

export type ActionTargetRef =
    | FieldActionTargetRef
    | VariableActionTargetRef;

export interface ActionTargetMeta {
    key: string;
    label: string;
    kind: ActionTargetKind;

    valueType: ValueType;

    ref: ActionTargetRef;

    origin: EntityOrigin;
}

export type ValueSourceKind = "const" | "field" | "variable" | "lookupField";

export interface ConstValueSourceRef {
    kind: "const";
}

export interface FieldValueSourceRef {
    kind: "field";
    fieldId: string;
}

export interface VariableValueSourceRef {
    kind: "variable";
    variableId: string;
}

export interface LookupFieldValueSourceRef {
    kind: "lookupField";
    lookupId: string;
    fieldName: string;
}

export type ValueSourceRef =
    | ConstValueSourceRef
    | FieldValueSourceRef
    | VariableValueSourceRef
    | LookupFieldValueSourceRef;