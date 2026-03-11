import type {NodePath} from "../components/logic/components/reducer.ts";

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
    ref: NodePath;
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

// export type WriteRef =
//     FieldRef |
//     VariableRef

// export type ReadRef =
//     SelfRef |
//     FieldRef |
//     VariableRef |
//     ConstantRef |
//     RowRef
//
// export type SelfRef = {
//     type: "self"
// }
//
// export type FieldRef = {
//     type: "field"
//     fieldKey: Key
// }
//
// export type VariableRef = {
//     type: "variable"
//     variableKey: Key
// }
//
// export type ConstantRef = {
//     type: "constant"
//     constantKey: Key
// }
//
// export type RowRef = {
//     type: "row"
//     columnKey: Key
// }

export type Boolean2OperandExpression =
    | EqExpression
    | NeExpression
    | GtExpression
    | GteExpression
    | LtExpression
    | LteExpression

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
        | NotEmptyExpression


export interface BoolConstExpression {
    id: string
    type: "boolConst";
    value: boolean;
}

export interface AndExpression {
    id: string
    type: "and";
    items: BooleanExpression[];
}

export interface OrExpression {
    id: string
    type: "or";
    items: BooleanExpression[];
}

export interface NotExpression {
    id: string
    type: "not";
    item: BooleanExpression;
}

export interface EqExpression {
    id: string
    type: "eq";
    left: ValueExpression;
    right: ValueExpression;
}

export interface NeExpression {
    id: string
    type: "ne";
    left: ValueExpression;
    right: ValueExpression;
}

export interface GtExpression {
    id: string
    type: "gt";
    left: ValueExpression;
    right: ValueExpression;
}

export interface GteExpression {
    id: string
    type: "gte";
    left: ValueExpression;
    right: ValueExpression;
}

export interface LtExpression {
    id: string
    type: "lt";
    left: ValueExpression;
    right: ValueExpression;
}

export interface LteExpression {
    id: string
    type: "lte";
    left: ValueExpression;
    right: ValueExpression;
}

export interface InExpression {
    id: string
    type: "in";
    left: ValueExpression;
    right: ValueExpression;
}

export interface IsEmptyExpression {
    id: string
    type: "isEmpty";
    value: ValueExpression;
}

export interface NotEmptyExpression {
    id: string
    type: "notEmpty";
    value: ValueExpression;
}
