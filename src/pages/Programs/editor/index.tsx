import Input from "../../../components/ui/fieldsUIAdmin/Input/Input.tsx";
import Modal from "../../../components/Modal.tsx";
import Constructor from "../../../components/constructor/Constructor.tsx";
import type {FormDefinition} from "../../../logic/type.ts";
import {EditorContext, useEditorContext} from "./EditorContext.tsx";
import {useContext, useEffect} from "react";

export type FormEditorProps = {
    onSave: (form: FormDefinition) => void;
}

export default function FormEditor({onSave}: FormEditorProps) {
    const formNameValue = useEditorContext(s => s.form.constants["name"].value);
    const formEnabledValue = useEditorContext(s => s.form.constants["enabled"].value);
    const currentStepKey = useEditorContext(s => s.stepKey);
    const setStepKey = useEditorContext(s => s.setStepKey);
    const updateConstValue = useEditorContext(s => s.updateConstValue);
    const addStep = useEditorContext(s => s.addStep);
    const stepsValue = useEditorContext(s => s.form.steps);
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
                            {Object.entries(stepsValue).map(([stepKey, step], index) => (
                                <tr key={stepKey}>
                                    <td>{index}</td>
                                    <td>{step.title}</td>
                                    <td>
                                        <button type="button" className="btn btn-info" onClick={()=>setStepKey(step.key)}>Edit</button>
                                        <button type="button" className="btn btn-info">Delete</button>
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
        </>
    )
}