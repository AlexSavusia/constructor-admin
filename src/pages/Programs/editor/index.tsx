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
            <div className="col flex flex-col gap-4">
                <div className="card mb-3 card-primary w-full rounded-xl shadow-sm border border-slate-200">
                    <div className="p-4 w-full d-flex align-items-center justify-content-between bg-white border-b border-slate-200">
                        <div className="text-lg font-semibold text-slate-800">Create program</div>
                    </div>
                    <div className="card-body flex flex-col gap-4">
                        <Input
                            className="mb-3 w-full rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-100"
                            placeholder="Name"
                            value={getName()}
                            onChange={e=>updateName(e.target.value)}
                        />
                        <div className="mb-3 form-check flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="form-check-input h-4 w-4 cursor-pointer"
                                checked={getEnabled()}
                                onChange={e=>updateEnabled(e.target.checked)}
                            />
                            <label className="form-check-label text-sm text-slate-700">Enabled</label>
                        </div>
                    </div>
                    <div className="card-footer flex justify-end border-t border-slate-200 bg-slate-50">
                        <button type="submit" className="btn btn-primary px-4 py-2 rounded-lg shadow-sm hover:shadow transition">Submit</button>
                    </div>
                </div>

                <div className="card card-primary w-full rounded-xl shadow-sm border border-slate-200">
                    <div className=" p-4 w-full d-flex align-items-center justify-content-between bg-white border-b border-slate-200">
                        <div className="text-lg font-semibold text-slate-800">Program steps</div>
                        <button className="btn btn-success px-3 py-2 rounded-lg shadow-sm hover:shadow transition">Add</button>
                    </div>

                    <div className="card-body p-0">
                        <table className="table table-striped w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                            <tr>
                                <th style={{width: "10px"}} scope="col" className="px-3 py-2">#</th>
                                <th scope="col" className="px-3 py-2">Name</th>
                                <th style={{width: "40px"}} scope="col" className="px-3 py-2 text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(getSteps()).map(([stepKey, step], index) => (
                                <tr key={stepKey} className="hover:bg-slate-50 transition">
                                    <td className="px-3 py-2">{index}</td>
                                    <td className="px-3 py-2 font-medium text-slate-700">{step.title}</td>
                                    <td className="px-3 py-2 flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={()=>setEditingStep(step)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                        >
                                            Delete
                                        </button>
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