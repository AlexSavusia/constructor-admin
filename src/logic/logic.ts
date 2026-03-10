import type {BooleanExpression, ValueExpression} from "./expression.ts";
import type {Key} from "./type.ts";

export type BooleanPropertyLogicDefinition = {
    defaultValue: boolean;
    rules: BooleanDecisionRule[];
}

export type BooleanDecisionRule = {
    when: BooleanExpression;
    value: boolean;
}

export interface ValueLogicDefinition {
    fallback?: ValueExpression;
    rules: ValueDecisionRule[];
}

export interface ValueDecisionRule {
    when: BooleanExpression;
    value: ValueExpression;
}

export type FieldOnUpdateRule = {
    when: BooleanExpression;
    then: FieldOnUpdateAction[];
}
type FieldPath = unknown;
type RuntimeVarPath = unknown;
export type SetFieldValueOnUpdateAction = {
    type: "setFieldValue";
    target: FieldPath;
    value: ValueExpression;
}

export type SetRuntimeVariableValueOnUpdateAction = {
    type: "setRuntimeVariableValue";
    target: RuntimeVarPath;
    value: ValueExpression;
}

export type FieldOnUpdateAction =
    | SetFieldValueOnUpdateAction
    | SetRuntimeVariableValueOnUpdateAction;

export type StepTransitionRule = {
    when: BooleanExpression;
    targetStep: Key;
}