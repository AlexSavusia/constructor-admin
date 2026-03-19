import {useNavigate, useParams} from "react-router-dom";
import {EditorProvider} from "./editor/EditorProvider.tsx";
import FormEditor from "./editor";
import type {FormDefinition} from "../../logic/type.ts";
import {getProgram, updateProgram} from "../../api";
import {useEffect, useState} from "react";
import type {Program} from "../../api/types.ts";

export default function EditProgramPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState<Program | null>(null);

    const onSave = (form: FormDefinition) => {
        updateProgram(id!, {
            name: form.constants["name"].value as string,
            descriptor: JSON.stringify(form)
        }).then(rs=> {
            navigate(`/programs/${rs.id}`);
        });
    };

    useEffect(() => {
        const ac = new AbortController()
        getProgram(id!, ac.signal).then(setProgram);
        return () => {
            ac.abort()
        }
    }, [id])

    if(!program) {
        return <></>;
    }

    return (
        <EditorProvider initialState={JSON.parse(program.descriptor)}>
            <FormEditor onSave={onSave} />
        </EditorProvider>
    );
}