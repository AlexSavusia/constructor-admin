import FormEditor from "./editor";
import type {FormDefinition} from "../../logic/type.ts";
import {EditorProvider} from "./editor/EditorProvider.tsx";


export default function CreateProgramsPage() {

    const onSave = (form: FormDefinition) => {
        debugger
        console.log(form)
    }

    return (
        <EditorProvider>
            <FormEditor onSave={onSave}/>
        </EditorProvider>
    )
}