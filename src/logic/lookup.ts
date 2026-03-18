import type { Key } from './type.ts';
import type { BooleanExpression } from './expression.ts';
import type {Rule} from "../components/logic/types.ts";

export type LookupDefinition = {
    key: Key;
    rowId: Key;
    label: string;
    baseFilter?: Rule;
};
