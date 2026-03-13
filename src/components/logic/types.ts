import type {
    Key,
} from "../../logic/type.ts";
import type {BooleanExpression} from "../../logic/expression.ts";

export type Rule = {
    condition: BooleanExpression;
    actions: ActionExpression[];
}

export type ActionExpression =
    | NoOpActionExpression;

export type NoOpActionExpression = {
    type: "noop"
}

export type SetValueActionExpression = {
    type: "setValue"
}

export type ClearValueActionExpression = {}





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
