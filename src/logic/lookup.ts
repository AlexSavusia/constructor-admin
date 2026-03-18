import type { Key } from './type.ts';
import type { BooleanExpression } from './expression.ts';

export type LookupDefinition = {
    key: Key;
    rowId: Key;
    baseFilter?: LookupBaseFilterDefinition;
};

export type LookupBaseFilterDefinition = {
    rules: BooleanExpression;
};
