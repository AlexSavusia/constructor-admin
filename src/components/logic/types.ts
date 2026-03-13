import type {BooleanExpression, ValueExpression} from "../../logic/expression.ts";

export type Rule = {
    condition: BooleanExpression;
    actions: ActionExpression[];
}

export type ActionExpression =
    | NoOpActionExpression
    | SetValueActionExpression
    | ClearValueActionExpression
    | SetFieldPropertyActionExpression
    | SetFieldErrorActionExpression

export type NoOpActionExpression = {
    type: "noop"
}

export type SetValueActionExpression = {
    type: "setValue",
    value: ValueExpression
}

export type ClearValueActionExpression = {
    type: "clearValue"
}

export type SetFieldPropertyActionExpression = {
    type: "setFieldProperty"
    property: string
    value: boolean
}

export type SetFieldErrorActionExpression = {
    type: "setFieldError"
    text: string
}