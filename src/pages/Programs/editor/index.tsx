import Input from "../../../components/ui/fieldsUIAdmin/Input/Input.tsx";
import {useFormEditorActions, useFormEditorSelectors} from "./context.ts";
import Modal from "../../../components/Modal.tsx";
import {useState} from "react";
import type {StepDefinition} from "../../../logic/step.ts";
import Constructor from "../../../components/constructor/Constructor.tsx";
import type {FormDefinition} from "../../../logic/type.ts";

export type FormEditorProps = {
    onSave: (form: FormDefinition) => void;
}

export default function FormEditor({onSave}: FormEditorProps) {
    const {updateEnabled, updateName} = useFormEditorActions();
    const {getEnabled, getName, getSteps} = useFormEditorSelectors();
    const [editingStep, setEditingStep] = useState<StepDefinition | null>(null);
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
                            value={getName()}
                            onChange={e=>updateName(e.target.value)}
                        />
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={getEnabled()}
                                onChange={e=>updateEnabled(e.target.checked)}
                            />
                            <label className="form-check-label">Enabled</label>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
                <div className="card card-primary w-full">
                    <div className="card-header w-full d-flex align-items-center justify-content-between">
                        <div className="card-title">Program steps</div>
                        <button className="btn btn-success">Add</button>
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
                            {Object.entries(getSteps()).map(([stepKey, step], index) => (
                                <tr key={stepKey}>
                                    <td>{index}</td>
                                    <td>{step.title}</td>
                                    <td>
                                        <button type="button" className="btn btn-info" onClick={()=>setEditingStep(step)}>Edit</button>
                                        <button type="button" className="btn btn-info">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Modal open={!!editingStep} onClose={()=>setEditingStep(null)}>
                {editingStep && (
                    <Constructor stepKey={editingStep.key} onSave={onSave}/>
                )}
            </Modal>
        </>
    )
}