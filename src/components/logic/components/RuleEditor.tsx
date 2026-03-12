import {useCallback, useMemo} from "react";
import WhenEditor from "./WhenEditor.tsx";
import type {ExpressionScope, FormDefinition, Key} from "../../../logic/type.ts";
import Modal from "../../Modal.tsx";
import {EditorProvider} from "../../../pages/Programs/editor/EditorProvider.tsx";
import type {AndExpression, OrExpression} from "../../../logic/expression.ts";
import {useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";

export type RuleEditorProps = {

}
//title?: string;
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     children: React.ReactNode;
//     className?: string;
//     onSave?: () => void;

export default function RuleEditor() {
    const editingRule = useEditorContext(s=>s.editingRule)
    //const persistEditingRule = useEditorContext(s=>s.persistEditingRule)
    const resetEditingRule = useEditorContext(s=>s.resetEditingRule)

    const onSaveCb = useCallback(() => {}, [editingRule])

    if(editingRule?.rule?.condition?.type != "and" && editingRule?.rule?.condition?.type != "or" && editingRule != undefined) {
        throw new Error(`Invalid rule condition rule ${JSON.stringify(editingRule)}`, )
    }

    if(!editingRule) {
        return null;
    }

    return (
        <Modal
            title="Rule Editor"
            open={!!editingRule}
            onClose={resetEditingRule}
            onSave={onSaveCb}
        >
            <WhenEditor/>
            {/*<ThenEditor*/}
            {/*    node={rule.then}*/}
            {/*    onChange={(then) => setRule((s) => ({ ...s, then }))}*/}
            {/*/>*/}
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