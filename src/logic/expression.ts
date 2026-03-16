import type { ObjPath } from '../pages/Programs/editor/EditorContext.tsx';
import type { ActionExpression } from '../components/logic/types.ts';

export type ValueExpression = AstValueExpression | RefValueExpression | ConstValueExpression | FuncValueExpression;

export type AstValueExpression = {
    __typ: 'ast';
    operator: 'add' | 'sub' | 'mul' | 'div';
    left: AstValueExpression | RefValueExpression | ConstValueExpression | FuncValueExpression;
    right: AstValueExpression | RefValueExpression | ConstValueExpression | FuncValueExpression;
};

export type RefValueExpression = {
    __typ: 'ref';
    path: ObjPath;
    refType: 'field' | 'variable' | 'const'
};

export type ConstValueExpression = {
    __typ: 'const';
    value: unknown;
    valueType: 'string' | 'number';
};

export type FuncValueExpression = {
    __typ: 'func';
    name: string;
};

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
    | InExpression;

export type NoopBooleanExpression = {
    id: string
    type: "noop"
    items: BooleanExpression[]
}

export type BooleanExpression =
    | NoopBooleanExpression
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
export function isTwoOperandMode(rule: BooleanExpression) {
    return isTwoOperandModeType(rule.type);
}
export function isTwoOperandModeType(type: BooleanExpression['type']) {
    switch (type) {
        case 'or':
        case 'and':
        case 'not':
        case 'isEmpty':
        case 'notEmpty':
            return false;
        case 'eq':
        case 'ne':
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
            return true;
        default:
            throw new Error(`Unsupported expression type ${type}`);
    }
}

export function getChildrenRootPathForRule(root: ObjPath, rule: BooleanExpression | ActionExpression) {
    switch (rule.type) {
        case 'or':
        case 'and':
            return [...root, 'items'];
        case 'not':
            return [...root, 'item'];
        case 'eq':
        case 'ne':
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
            return [
                [...root, 'left'],
                [...root, 'right'],
            ];
        default:
            throw new Error(`Unsupported expression type ${rule}`);
    }
}

export interface AndExpression {
    id: string;
    type: 'and';
    items: BooleanExpression[];
}

export interface OrExpression {
    id: string;
    type: 'or';
    items: BooleanExpression[];
}

export interface NotExpression {
    id: string;
    type: 'not';
    item: BooleanExpression;
}

export interface EqExpression {
    id: string;
    type: 'eq';
    left: ValueExpression;
    right: ValueExpression;
}

export interface NeExpression {
    id: string;
    type: 'ne';
    left: ValueExpression;
    right: ValueExpression;
}

export interface GtExpression {
    id: string;
    type: 'gt';
    left: ValueExpression;
    right: ValueExpression;
}

export interface GteExpression {
    id: string;
    type: 'gte';
    left: ValueExpression;
    right: ValueExpression;
}

export interface LtExpression {
    id: string;
    type: 'lt';
    left: ValueExpression;
    right: ValueExpression;
}

export interface LteExpression {
    id: string;
    type: 'lte';
    left: ValueExpression;
    right: ValueExpression;
}

export interface InExpression {
    id: string;
    type: 'in';
    left: ValueExpression;
    right: ValueExpression;
}

export interface IsEmptyExpression {
    id: string;
    type: 'isEmpty';
    item: ValueExpression;
}

export interface NotEmptyExpression {
    id: string;
    type: 'notEmpty';
    item: ValueExpression;
}
