import {FormEditorProvider} from "./editor/FormEditorProvider.tsx";
import FormEditor from "./editor";
import type {FormDefinition} from "../../logic/type.ts";


export default function CreateProgramsPage() {

    const onSave = (form: FormDefinition) => {
        // debugger
        console.log(form)
    }

    return (
        <FormEditorProvider>
            <FormEditor onSave={onSave}/>
        </FormEditorProvider>
    )
}