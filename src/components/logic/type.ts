export type FormLogic = {
    steps: FormStep[];
    fields: Record<string, FormField>
    lookups: Record<string, FormLookup>
    rules: Record<string, FormRule>
}

export type FormStep = {
    id: string
    label: string
}

export type FormField = {
    id: string
    stepId: string
    type: "input" | "select" | "multiselect" | "checkbox" | "radio"
    label: string
}

export type CheckboxFormField = FormField & {
    type: "checkbox"
}

export type RadioFormField = FormField & {
    type: "radio"
    options: {key: string, label: string}[]
}

export type InputFormField = FormField & {
    type: "input"
    inputType: "string" | "number" | "date"
}

type SelectOptions = {
    type: "static" | "lookup"
}


export type SelectStaticOptions = SelectOptions & {
    type: "static"
    items: {
        value: string
        label: string
        selectableWhen: LogicExpression
    }
}

export type SelectLookupOptions = SelectOptions & {
    type: "lookup"
    source: string
    valueId: string
    configFilter: LogicExpression
    filteredRowsExtraConditions: Record<string, LogicExpression> // key is row id from lookup (dict)
}

export type SelectFormField = FormField & {
    type: "select"
    options: SelectOptions
}


export type MultiselectFormField = FormField & {
    type: "multiselect"
    options: SelectOptions
}


export type VariableOperatorType = "var" | "const" | "path" //path for lookups
export type VariableExpression = Partial<Record<VariableOperatorType, string>>

export type LogicOperatorType = "always_true" | "always_false" | "eq" | "neq" | "all" | "any" //...
export type LogicExpression = Partial<
    Record<
        LogicOperatorType,
        Partial<Record<LogicOperatorType, VariableExpression | FunctionExpression>>[]
    >
>

export type FunctionOperatorType = "sprintf" | "lookup"
type __funcs = SprintfFunctionExpression | LookupFunctionExpression
export type FunctionExpression = Partial<Record<FunctionOperatorType, __funcs>>

export type SprintfFunctionExpression = {
    format: string
    args: VariableExpression[]
}

export type LookupFunctionExpression = {
    source: string
    key: VariableExpression
    path: string
}


export type OperatorType = LogicOperatorType | VariableOperatorType | FunctionOperatorType
export type ExpressionType = LogicExpression | VariableExpression | FunctionExpression


//ExprT

// type __ExpressionFunctionRecord = Record<FunctionOperatorType, FunctionExpression>
// type Expression = __ExpressionLogicRecord
//      | __ExpressionVariableRecord
//      | __ExpressionFunctionRecord


export type FormActionType = "setRequired" | "setVisible" | "setEnabled" | "setValue" | "clearValue" | "setOptions" | "setErrors"

export type FormAction = {
    action: FormActionType
    target: string
} & ({value: never} | {valueExpr: FunctionExpression | VariableExpression})

export type FormLookup = {
    type: "dictionary"
}

export type FormRule = {
    id: string
    when: LogicExpression
    then: FormAction[]
}


type Id = string;

export type LogicOp = "all" | "any";

export type SourceKind = "field" | "variable" | "lookup";

export type CompareOp =
    | "eq"
    | "ne"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "isTrue"
    | "isFalse"
    | "isEmpty"
    | "notEmpty";

export type ValueSource =
    | { kind: "const"; value: unknown }
    | { kind: "field"; fieldId: string }
    | { kind: "variable"; variableId: string }
    | { kind: "lookup"; source: string, labelColumn: string, valueColumn: string };

export type ConditionNode = {
    id: Id;
    type: "condition";
    enabled: boolean;
    left: {
        kind: SourceKind;
        id: string;
    };
    operator: CompareOp;
    right?: ValueSource;
};

export type GroupNode = {
    id: Id;
    type: "group";
    enabled: boolean;
    operator: LogicOp;
    children: Array<GroupNode | ConditionNode>;
};

export type ActionNode =
    | {
    id: Id;
    enabled: boolean;
    type: "showField";
    fieldId: string;
}
    | {
    id: Id;
    enabled: boolean;
    type: "hideField";
    fieldId: string;
}
    | {
    id: Id;
    enabled: boolean;
    type: "setRequired";
    fieldId: string;
    value: boolean;
}
    | {
    id: Id;
    enabled: boolean;
    type: "setVariable";
    variableId: string;
    value: ValueSource;
}
    | {
    id: Id;
    enabled: boolean;
    type: "clearValue",
    fieldId: string;
};

export type RuleEditorState = {
    id: Id;
    name: string;
    when: GroupNode;
    then: ActionNode[];
};