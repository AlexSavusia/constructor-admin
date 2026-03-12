import WhenEditor from "./WhenEditor.tsx";
import Modal from "../../Modal.tsx";
import {useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";


export default function RuleEditor() {
    const editingRule = useEditorContext(s => s.editingRule)
    const resetEditingRule = useEditorContext(s => s.resetEditingRule)
    const persistEditingRule = useEditorContext(s => s.persistEditingRule)

    if (!editingRule) {
        return null;
    }

    return (
        <Modal
            title="Rule Editor"
            open={!!editingRule}
            onClose={resetEditingRule}
            onSave={persistEditingRule}
        >
            <WhenEditor/>
            {/*<ThenEditor*/}
            {/*    node={rule.then}*/}
            {/*    onChange={(then) => setRule((s) => ({ ...s, then }))}*/}
            {/*/>*/}
        </Modal>
    )
}