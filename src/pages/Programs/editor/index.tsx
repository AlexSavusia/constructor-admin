import Input from "../../../components/ui/fieldsUIAdmin/Input/Input.tsx";
import Modal from "../../../components/Modal.tsx";
import Constructor from "../../../components/constructor/Constructor.tsx";
import type {FormDefinition} from "../../../logic/type.ts";
import type { StepDefinition } from "../../../logic/step.ts";
import {useState} from "react";
import {EditorContext, useEditorContext} from "./EditorContext.tsx";
import {useContext} from "react";

export type FormEditorProps = {
    onSave: (form: FormDefinition) => void;
}

export default function FormEditor({onSave}: FormEditorProps) {
    const formNameValue = useEditorContext(s => s.form.constants["name"].value);
    const formEnabledValue = useEditorContext(s => s.form.constants["enabled"].value);
    const currentStepKey = useEditorContext(s => s.stepKey);
    const setStepKey = useEditorContext(s => s.setStepKey);
    const updateConstValue = useEditorContext(s => s.updateConstValue);
    const addStep = useEditorContext((s) => s.addStep);
    const removeStep = useEditorContext((s) => s.removeStep);

    const stepsValue = useEditorContext(s => s.form.steps);

    const [isCreateStepModalOpen, setIsCreateStepModalOpen] = useState(false)
    const [stepTitle, setStepTitle] = useState("")

    const handleOpenCreateStepModal = () => {
        setStepTitle("")
        setIsCreateStepModalOpen(true)
    };

    const handleCloseCreateStepModal = () => {
        setStepTitle("")
        setIsCreateStepModalOpen(false)
    }

    const handleCreateStep = () => {
        const title = stepTitle.trim()

        if (!title) return

        const step: StepDefinition = {
            key: crypto.randomUUID(),
            title,
            fields: {},
            transition: {
                rules: [],
            },
        }

        addStep(step)
        handleCloseCreateStepModal()

        setStepKey(step.key)
    }

    const ctx = useContext(EditorContext);
    return (
        <>
            <div className="col">
                <div className="card mb-3 card-primary w-full">
                    <div className="card-header">
                        <div className="card-title">Create program</div>
                    </div>
                    <div className="card-body">
                        <Input
                            className="mb-3"
                            placeholder="Name"
                            value={formNameValue as string}
                            onChange={e=>{
                                updateConstValue("name", e.target.value as string);
                            }}
                        />
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={formEnabledValue as boolean}
                                onChange={e=>{
                                    updateConstValue("enabled", e.target.checked);
                                }}
                            />
                            <label className="form-check-label">Enabled</label>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="button" className="btn btn-primary"
                        onClick={()=>{
                            const {form} = ctx!.getState()
                            onSave(form);
                        }}>Submit</button>
                    </div>
                </div>
                <div className="card card-primary w-full">
                    <div className="card-header w-full d-flex align-items-center justify-content-between">
                        <div className="card-title">Program steps</div>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleOpenCreateStepModal}
                        >
                            Add
                        </button>
                    </div>
                    <div className="card-body">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th style={{width: "10px"}} scope="col">#</th>
                                <th scope="col">Name</th>
                                <th style={{width: "40px"}} scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(stepsValue).map(([stepKey, step], index) => (
                                <tr key={stepKey}>
                                    <td>{index}</td>
                                    <td>{step.title}</td>
                                    <td>
                                        <button type="button" className="btn btn-info" onClick={()=>setStepKey(step.key)}>Edit</button>
                                        <button type="button" className="btn btn-info" onClick={()=>removeStep(step.key)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal open={!!currentStepKey} onClose={()=>setStepKey(null)}>
                {currentStepKey && (
                    <Constructor />
                )}
            </Modal>
            <Modal open={isCreateStepModalOpen} onClose={handleCloseCreateStepModal}>
                <div className="card mb-0">
                    <div className="card-header">
                        <div className="card-title">Create step</div>
                    </div>

                    <div className="card-body">
                        <Input
                            placeholder="Step title"
                            value={stepTitle}
                            onChange={(e) => setStepTitle(e.target.value)}
                        />
                    </div>

                    <div className="card-footer d-flex justify-content-end gap-2">

                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleCreateStep}
                            disabled={!stepTitle.trim()}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}