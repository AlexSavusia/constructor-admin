import FormEditor from './editor';
import type { FormDefinition } from '../../logic/type.ts';
import { EditorProvider } from './editor/EditorProvider.tsx';
import { TEST } from '../test.ts';

export default function CreateProgramsPage() {
    const onSave = (form: FormDefinition) => {
        console.log(form);
    };

    return (
        <EditorProvider initialState={TEST}>
            <FormEditor onSave={onSave} />
        </EditorProvider>
    );
}
