import type {
    Key,
} from "../../logic/type.ts";
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





export type EditorPath =
    | { type: "fieldLogicVisibility"; fieldKey: Key }
    | { type: "fieldLogicEnabled"; fieldKey: Key }
    | { type: "fieldLogicRequired"; fieldKey: Key }
    | { type: "fieldLogicValue"; fieldKey: Key }
    | { type: "fieldOnUpdateRule"; fieldKey: Key; ruleIndex: number }
    | { type: "fieldOnUpdateAction"; fieldKey: Key; ruleIndex: number; actionIndex: number }
    | { type: "stepTransitionRule"; stepKey: Key; ruleIndex: number }
    | { type: "lookupBaseFilter"; lookupKey: Key }
    | { type: "lookupRowAvailability"; fieldKey: Key; rowId: string; prop: "enabled" | "selectable" };
