import FormEditor from './editor';
import type { FormDefinition } from '../../logic/type.ts';
import { EditorProvider } from './editor/EditorProvider.tsx';
import {createProgram} from "../../api";
import {useNavigate} from "react-router-dom";
import {TEST} from "../test.ts";

export default function CreateProgramsPage() {
    const navigate = useNavigate();
    const onSave = (form: FormDefinition) => {
        createProgram({
            name: form.constants["name"].value as string,
            descriptor: JSON.stringify(form)
        }).then(rs=> {
            navigate(`/programs/${rs.id}`);
        });
    };

    return (
        <EditorProvider initialState={TEST}>
            <FormEditor onSave={onSave} />
        </EditorProvider>
    );
}
//multiSelect