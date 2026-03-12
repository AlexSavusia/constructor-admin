import type {FieldDefinition} from "./field.ts";
import type {Key} from "./type.ts";
import type {StepTransitionRule} from "./logic.ts";

export type StepDefinition = {
    key: Key;
    title: string;

    fields: Record<Key, FieldDefinition>;
    transition: StepTransitionLogicDefinition;
}

export type StepTransitionLogicDefinition = {
    rules: StepTransitionRule[];
    defaultStep?: Key;
}