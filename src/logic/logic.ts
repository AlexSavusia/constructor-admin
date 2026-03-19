import type { BooleanExpression, ValueExpression } from './expression.ts';
import type { Key } from './type.ts';
import type { Rule } from '../components/logic/types.ts';

export type BooleanPropertyLogicDefinition = {
    defaultValue: boolean;
    rule: Rule;
};

// export type BooleanDecisionRule = {
//     when: BooleanExpression;
//     value: boolean; // dont need probably
// }

export interface ValueLogicDefinition {
    fallback?: ValueExpression;
    rules: ValueDecisionRule;
}

export interface ValueDecisionRule {
    when: BooleanExpression;
    value: ValueExpression;
}

export type FieldOnUpdateRule = {
    when: BooleanExpression;
    then: FieldOnUpdateAction[];
};
type FieldPath = unknown;
type RuntimeVarPath = unknown;

export type SetFieldValueOnUpdateAction = {
    type: 'setFieldValue';
    target: FieldPath;
    value: ValueExpression;
};

export type SetRuntimeVariableValueOnUpdateAction = {
    type: 'setRuntimeVariableValue';
    target: RuntimeVarPath;
    value: ValueExpression;
};

export type FieldOnUpdateAction = SetFieldValueOnUpdateAction | SetRuntimeVariableValueOnUpdateAction;

export type StepTransitionRule = {
    id: string;
    title: string;
    when: BooleanExpression;
    targetStep: Key;
};
