import Input from '../../../components/ui/fieldsUIAdmin/Input/Input.tsx';
import Modal from '../../../components/Modal.tsx';
import Constructor from '../../../components/constructor/Constructor.tsx';
import type { FormDefinition } from '../../../logic/type.ts';
import type { StepDefinition } from '../../../logic/step.ts';
import { useState } from 'react';
import { EditorContext, useEditorContext } from './EditorContext.tsx';
import { useContext } from 'react';

export type FormEditorProps = {
    onSave: (form: FormDefinition) => void;
};

export default function FormEditor({ onSave }: FormEditorProps) {
    const formNameValue = useEditorContext((s) => s.form.constants['name'].value);
    const formEnabledValue = useEditorContext((s) => s.form.constants['enabled'].value);
    const currentStepKey = useEditorContext((s) => s.stepKey);
    const setStepKey = useEditorContext((s) => s.setStepKey);
    const updateConstValue = useEditorContext((s) => s.updateConstValue);
    const addStep = useEditorContext((s) => s.addStep);
    const removeStep = useEditorContext((s) => s.removeStep);

    const stepsValue = useEditorContext((s) => s.form.steps);

    const [isCreateStepModalOpen, setIsCreateStepModalOpen] = useState(false);
    const [stepTitle, setStepTitle] = useState('');

    const handleOpenCreateStepModal = () => {
        setStepTitle('');
        setIsCreateStepModalOpen(true);
    };

    const handleCloseCreateStepModal = () => {
        setStepTitle('');
        setIsCreateStepModalOpen(false);
    };

    const handleCreateStep = () => {
        const title = stepTitle.trim();

        if (!title) return;

        const step: StepDefinition = {
            key: crypto.randomUUID(),
            title,
            fields: {},
            transition: {
                rules: [],
            },
        };

        addStep(step);
        handleCloseCreateStepModal();

        setStepKey(step.key);
    };

    const ctx = useContext(EditorContext);
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
                            value={formNameValue as string}
                            onChange={(e) => {
                                updateConstValue('name', e.target.value as string);
                            }}
                        />
                        <div className="mb-3 form-check flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="form-check-input h-4 w-4 cursor-pointer"
                                checked={formEnabledValue as boolean}
                                onChange={(e) => {
                                    updateConstValue('enabled', e.target.checked);
                                }}
                            />
                            <label className="form-check-label text-sm text-slate-700">Enabled</label>
                        </div>
                    </div>
                    <div className="card-footer flex justify-end border-t border-slate-200 bg-slate-50">
                        <button
                            type="button"
                            className="btn btn-primary px-4 py-2 rounded-lg shadow-sm hover:shadow transition"
                            onClick={() => {
                                const { form } = ctx!.getState();
                                onSave(form);
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className="card card-primary w-full rounded-xl shadow-sm border border-slate-200">
                    <div className=" p-4 w-full d-flex align-items-center justify-content-between bg-white border-b border-slate-200">
                        <div className="text-lg font-semibold text-slate-800">Program steps</div>
                        <button
                            type="button"
                            className="btn btn-success px-3 py-2 rounded-lg shadow-sm hover:shadow transition"
                            onClick={handleOpenCreateStepModal}
                        >
                            Add
                        </button>
                    </div>
                    <div className="card-body p-0">
                        <table className="table table-striped w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                                <tr>
                                    <th style={{ width: '10px' }} scope="col" className="px-3 py-2">
                                        #
                                    </th>
                                    <th scope="col">Name</th>
                                    <th style={{ width: '40px' }} scope="col" className="px-3 py-2 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(stepsValue).map(([stepKey, step], index) => (
                                    <tr key={stepKey} className="hover:bg-slate-50 transition">
                                        <td className="px-3 py-2">{index}</td>
                                        <td className="px-3 py-2 font-medium text-slate-700">{step.title}</td>
                                        <td className="px-3 py-2 flex gap-2 justify-end">
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => setStepKey(step.key)}
                                            >
                                                Edit
                                            </button>
                                            <button type="button" className="btn btn-danger" onClick={() => removeStep(step.key)}>
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
            <Modal open={!!currentStepKey} onClose={() => setStepKey(null)}>
                {currentStepKey && <Constructor />}
            </Modal>
            <Modal open={isCreateStepModalOpen} onClose={handleCloseCreateStepModal}>
                <div className="card mb-0">
                    <div className="card-header">
                        <div className="card-title">Create step</div>
                    </div>

                    <div className="card-body">
                        <Input placeholder="Step title" value={stepTitle} onChange={(e) => setStepTitle(e.target.value)} />
                    </div>

                    <div className="card-footer d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-success" onClick={handleCreateStep} disabled={!stepTitle.trim()}>
                            Create
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
