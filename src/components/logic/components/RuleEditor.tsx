import {useCallback} from "react";
import WhenEditor from "./WhenEditor.tsx";
import type {ExpressionScope, FormDefinition, Key} from "../../../logic/type.ts";
import Modal from "../../Modal.tsx";
import {EditorProvider} from "./EditorProvider.tsx";
import type {EditorEditingRule, EditorState} from "../types.ts";
import type {AndExpression, OrExpression} from "../../../logic/expression.ts";

export type RuleEditorProps = {
    open: boolean;
    onClose: () => void;
    stepKey: Key
    fieldKey?: Key
    form: FormDefinition
    scope: ExpressionScope
    onSave: (form: EditorEditingRule) => void
    rule?: EditorEditingRule
}
//title?: string;
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     children: React.ReactNode;
//     className?: string;
//     onSave?: () => void;

export default function RuleEditor({stepKey, fieldKey, form, scope, rule, open, onClose}: RuleEditorProps) {
    const onSaveCb = useCallback(() => {}, [])
    const initState: EditorState = {
        stepKey,
        fieldKey: fieldKey ?? null,
        form,
        scope,
        rule: rule ?? {
            condition: undefined,
            actions: undefined,
        },
        validation: {
            errors: [],
            warnings: [],
        }
    }

    if(rule?.condition?.type != "and" && rule?.condition?.type != "or" && rule?.condition != undefined) {
        throw new Error(`Invalid rule condition rule ${JSON.stringify(rule.condition)}`, )
    }

    return (
        <Modal
            title="Rule Editor"
            open={open}
            onClose={onClose}
            onSave={onSaveCb}
        >
            <EditorProvider initialState={initState}>
                <WhenEditor
                    path={["form"]}
                    rule={initState.rule.condition as AndExpression | OrExpression}
                    />
                {/*<ThenEditor*/}
                {/*    node={rule.then}*/}
                {/*    onChange={(then) => setRule((s) => ({ ...s, then }))}*/}
                {/*/>*/}
            </EditorProvider>
        </Modal>
    )

    // return (
    //     <div>
    //         <WhenEditor
    //             node={rule.when}
    //             onChange={(when) => {
    //                 setRule((s) => ({ ...s, when }))
    //             }} />
    //         <ThenEditor
    //             node={rule.then}
    //             onChange={(then) => setRule((s) => ({ ...s, then }))}
    //         />
    //         <div>
    //             <button className="btn btn-secondary">close</button>
    //             <button className="btn btn-primary">save</button>
    //         </div>
    //     </div>
    // )
}