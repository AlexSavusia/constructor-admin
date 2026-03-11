import type {Key} from "./type.ts";

export type ValueExpression =
    | ConstValueExpression
    | RefValueExpression
    | FormatValueExpression
    | ArrayValueExpression
    | ObjectValueExpression;

export interface ConstValueExpression {
    type: "const";
    value: unknown;
}

export interface RefValueExpression {
    type: "ref";
    ref: ReadRef;
}

export interface FormatValueExpression {
    type: "format";
    template: string;
    args: ValueExpression[];
}

export interface ArrayValueExpression {
    type: "array";
    items: ValueExpression[];
}

export interface ObjectValueExpression {
    type: "object";
    entries: Record<string, ValueExpression>;
}

export type WriteRef =
    FieldRef |
    VariableRef

export type ReadRef =
    SelfRef |
    FieldRef |
    VariableRef |
    ConstantRef |
    RowRef

export type SelfRef = {
    type: "self"
}

export type FieldRef = {
    type: "field"
    fieldKey: Key
}

export type VariableRef = {
    type: "variable"
    variableKey: Key
}

export type ConstantRef = {
    type: "constant"
    constantKey: Key
}

export type RowRef = {
    type: "row"
    columnKey: Key
}

export type BooleanExpression =
    | BoolConstExpression
    | AndExpression
    | OrExpression
    | NotExpression
    | EqExpression
    | NeExpression
    | GtExpression
    | GteExpression
    | LtExpression
    | LteExpression
    | InExpression
    | IsEmptyExpression
    | NotEmptyExpression;

export interface BoolConstExpression {
    type: "boolConst";
    value: boolean;
}

export interface AndExpression {
    type: "and";
    items: BooleanExpression[];
}

export interface OrExpression {
    type: "or";
    items: BooleanExpression[];
}

export interface NotExpression {
    type: "not";
    item: BooleanExpression;
}

export interface EqExpression {
    type: "eq";
    left: ValueExpression;
    right: ValueExpression;
}

export interface NeExpression {
    type: "ne";
    left: ValueExpression;
    right: ValueExpression;
}

export interface GtExpression {
    type: "gt";
    left: ValueExpression;
    right: ValueExpression;
}

export interface GteExpression {
    type: "gte";
    left: ValueExpression;
    right: ValueExpression;
}

export interface LtExpression {
    type: "lt";
    left: ValueExpression;
    right: ValueExpression;
}

export interface LteExpression {
    type: "lte";
    left: ValueExpression;
    right: ValueExpression;
}

export interface InExpression {
    type: "in";
    left: ValueExpression;
    right: ValueExpression;
}

export interface IsEmptyExpression {
    type: "isEmpty";
    value: ValueExpression;
}

export interface NotEmptyExpression {
    type: "notEmpty";
    value: ValueExpression;
}
