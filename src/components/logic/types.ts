import type {
    ConstVariableDefinition,
    ExpressionScope,
    FormDefinition,
    Key,
    RuntimeVariableDefinition
} from "../../logic/type.ts";
import * as React from "react";
import type {StepDefinition, StepTransitionLogicDefinition} from "../../logic/step.ts";
import type {
    FieldCapabilities,
    FieldDefinition,
    FieldLogicDefinition, FieldLogicType,
    FieldOnUpdateDefinition
} from "../../logic/field.ts";
import type {LookupDefinition} from "../../logic/lookup.ts";
import type {BooleanExpression, ValueExpression} from "../../logic/expression.ts";
import type {
    BooleanPropertyLogicDefinition,
    ValueLogicDefinition
} from "../../logic/logic.ts";
import type {NodePath} from "./components/reducer.ts";

export type EditorEditingRule = {
    condition?: BooleanExpression;
    actions?: ActionExpression[];
}

export type ActionExpression = unknown

export type EditorState = {
    stepKey: Key;
    fieldKey: Key | null;
    form: FormDefinition
    scope: ExpressionScope

    rule: EditorEditingRule

    validation: {
        errors: ValidationIssue[];
        warnings: ValidationIssue[];
    };
}

export type FieldLocation = {
    stepKey: Key;
    fieldKey: Key;
}
export type ValidationIssue = {
    path: unknown
    code: string
    message: string
}

export type ScopeContext = unknown
export type WritableScope = {
    canWriteField: boolean;
    canWriteVariable: boolean;
}



export type FormEditorContextValue = {
    state: EditorState;
    dispatch: React.Dispatch<FormEditorAction>;

    validation: {
        warnings: ValidationIssue[];
        errors: ValidationIssue[];
    }

    selectors: FormEditorSelectors;
    actions: FormEditorActionCreators;
};

export type FormEditorSelectors = {
    getStep(stepKey: Key): StepDefinition | undefined;
    getField(fieldKey: Key): FieldDefinition | undefined;
    getFieldLocation(fieldKey: Key): FieldLocation | undefined;

    getAllFields(): FieldDefinition[];
    getAllLookups(): LookupDefinition[];
    getAllConstants(): ConstVariableDefinition[];
    getAllVariables(): RuntimeVariableDefinition[];

    // getAvailableReadRefs(scope: ExpressionScope, ctx: ScopeContext): AvailableReadRef[];
    // getAvailableWriteTargets(scope: WritableScope, ctx: ScopeContext): AvailableWriteTarget[];

    getFieldCapabilities(fieldKey: Key): FieldCapabilities | undefined;

    validateExpression(expr: ValueExpression | BooleanExpression, scope: ExpressionScope, ctx: ScopeContext): ValidationIssue[];
    validateForm(): ValidationIssue[];
};

//TODO pass fieldKey not field
export type FormEditorAction =
    | { type: "SET_ACTION_BY_PATH", path: NodePath, action: ValueExpression }
    | { type: "SET_CONDITION_BY_PATH", path: NodePath, condition: BooleanExpression }
    | { type: "PATCH_CONDITION_BY_PATH", path: NodePath, condition: Partial<BooleanExpression | ValueExpression> }
    // unused below
    | { type: "UPDATE_CONDITION"; stepKey: Key, fieldKey: Key, condition: BooleanExpression}
    | { type: "UPDATE_ACTION"; stepKey: Key, fieldKey: Key, action: ValueExpression}

    | { type: "ADD_ON_UPDATE"; stepKey: Key; field: FieldDefinition, payload: FieldOnUpdateDefinition }
    | { type: "UPDATE_ON_UPDATE"; stepKey: Key; field: FieldDefinition, patch: Partial<FieldOnUpdateDefinition> }
    | { type: "DELETE_ON_UPDATE"; stepKey: Key; field: FieldDefinition }

    | { type: "ADD_BOOL_PROPERTY_LOGIC"; logicKey: FieldLogicType; stepKey: Key; field: FieldDefinition, payload: BooleanPropertyLogicDefinition }
    | { type: "UPDATE_BOOL_PROPERTY_LOGIC"; logicKey: FieldLogicType; stepKey: Key; field: FieldDefinition, patch: Partial<BooleanPropertyLogicDefinition> }
    | { type: "DELETE_BOOL_PROPERTY_LOGIC"; logicKey: FieldLogicType; stepKey: Key; field: FieldDefinition }

    | { type: "ADD_VALUE_LOGIC"; stepKey: Key; field: FieldDefinition, payload: ValueLogicDefinition }
    | { type: "UPDATE_VALUE_LOGIC"; stepKey: Key; field: FieldDefinition, patch: Partial<ValueLogicDefinition> }
    | { type: "DELETE_VALUE_LOGIC"; stepKey: Key; field: FieldDefinition }

    // | { type: "UPDATE_FIELD"; fieldKey: Key; patch: Partial<FieldDefinition> }
    // | { type: "REMOVE_FIELD"; fieldKey: Key }
    //
    // | { type: "ADD_FIELD_LOGIC_RULE"; fieldKey: Key; logicKey: "visibility" | "enabled" | "required"; rule: BooleanDecisionRule }
    // | { type: "UPDATE_FIELD_LOGIC_RULE"; fieldKey: Key; logicKey: "visibility" | "enabled" | "required"; ruleIndex: number; patch: Partial<BooleanDecisionRule> }
    // | { type: "REMOVE_FIELD_LOGIC_RULE"; fieldKey: Key; logicKey: "visibility" | "enabled" | "required"; ruleIndex: number }
    //
    // | { type: "ADD_ON_UPDATE_RULE"; fieldKey: Key; rule: FieldOnUpdateRule }
    // | { type: "UPDATE_ON_UPDATE_RULE"; fieldKey: Key; ruleIndex: number; rule: FieldOnUpdateRule }
    // | { type: "REMOVE_ON_UPDATE_RULE"; fieldKey: Key; ruleIndex: number }
    //
    // | { type: "ADD_ON_UPDATE_ACTION"; fieldKey: Key; ruleIndex: number; action: FieldOnUpdateAction }
    // | { type: "UPDATE_ON_UPDATE_ACTION"; fieldKey: Key; ruleIndex: number; actionIndex: number; action: FieldOnUpdateAction }
    // | { type: "REMOVE_ON_UPDATE_ACTION"; fieldKey: Key; ruleIndex: number; actionIndex: number }
    //
    // | { type: "SET_BOOLEAN_EXPRESSION"; path: EditorPath; expression: BooleanExpression }
    // | { type: "SET_VALUE_EXPRESSION"; path: EditorPath; expression: ValueExpression };



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

export type FormEditorActionCreators = {
    addStep(input?: Partial<StepDefinition>): void;
    updateStep(stepKey: Key, patch: Partial<StepDefinition>): void;
    removeStep(stepKey: Key): void;

    addField(stepKey: Key, field: FieldDefinition): void;
    updateField(fieldKey: Key, patch: Partial<FieldDefinition>): void;
    removeField(fieldKey: Key): void;
    moveField(fieldKey: Key, targetStepKey: Key, index?: number): void;

    addLookup(input: LookupDefinition): void;
    updateLookup(lookupKey: Key, patch: Partial<LookupDefinition>): void;
    removeLookup(lookupKey: Key): void;

    addConstant(input: ConstVariableDefinition): void;
    updateConstant(key: Key, patch: Partial<ConstVariableDefinition>): void;
    removeConstant(key: Key): void;

    addVariable(input: RuntimeVariableDefinition): void;
    updateVariable(key: Key, patch: Partial<RuntimeVariableDefinition>): void;
    removeVariable(key: Key): void;

    setFieldLogic(fieldKey: Key, logic: FieldLogicDefinition | undefined): void;
    setFieldOnUpdate(fieldKey: Key, onUpdate: FieldOnUpdateDefinition | undefined): void;
    setStepTransition(stepKey: Key, transition: StepTransitionLogicDefinition | undefined): void;

    updateExpression(path: EditorPath, value: unknown): void;
    insertRule(path: EditorPath, rule: unknown): void;
    removeNode(path: EditorPath): void;
    moveNode(path: EditorPath, direction: "up" | "down"): void;

    undo(): void;
    redo(): void;
};