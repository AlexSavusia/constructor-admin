import Palette from "./palette/Palette.tsx";
import Plane from "./plane/Plane.tsx";
import classNames from "classnames";
import PALETTE_ITEMS from "./palette/PaletteItems.ts";
// import type {FormDefinition} from "../../logic/type.ts";
// import {useEditorContext} from "../../pages/Programs/editor/EditorContext.tsx";
import Modal from "../Modal.tsx";
import {useState} from "react";
import {useEditorContext} from "../../pages/Programs/editor/EditorContext.tsx";

export type ConstructorProps = {
    className?: string;
}

export default function Constructor({className}: ConstructorProps) {
    const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
    const currentStepKey = useEditorContext(s=>s.stepKey)!
    const currentTransitionRules = useEditorContext(s=>s.form.steps[s.stepKey!].transition)
    const setEditingRule = useEditorContext(s=>s.setEditingRule)
    const addStepTransitionRule = useEditorContext(s=>s.addStepTransitionRule)
    // const currentStepKey = useEditorContext(s=>s.stepKey)
    // const setEditingRule = useEditorContext(s=>s.setEditingRule)
    return (
        <>
        <div className={classNames(className,  "d-flex flex-column flex-lg-row max-w-[1620px]","w-100","gap-3")}
             style={{ minHeight: "70vh" }}>
            <div  className="flex-shrink-0"
                  style={{width: "100%",maxWidth: 320}}>
                <Palette items={PALETTE_ITEMS}/>
            </div>
            <div className="flex-grow-1">
                <Plane items={PALETTE_ITEMS}/>
            </div>
            <button
                type="button"
                className="btn btn-primary h-fit"
                onClick={() => setIsTransitionModalOpen(true)}
            >
                Edit transition
            </button>
        </div>
            <Modal
                open={isTransitionModalOpen}
                onClose={() => setIsTransitionModalOpen(false)}
            >
                <div className="card mb-0">
                    <div className="card-header d-flex align-items-center justify-content-between">
                        <div className="card-title mb-0">Transition rules</div>
                        <button className="btn btn-primary" onClick={() => addStepTransitionRule(currentStepKey, {
                            id: crypto.randomUUID(),
                            title: "Simple step",
                            when: {type: "and", items: [], id: crypto.randomUUID()},
                            targetStep: "start"
                        })}>
                            Add
                        </button>
                    </div>

                    <div className="card-body">
                        <table className="table table-striped align-middle">
                            <thead>
                            <tr>
                                <th scope="col">Название</th>
                                <th
                                    scope="col"
                                    style={{ width: "180px" }}
                                >
                                    Действия
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {currentTransitionRules.rules.map((row, idx) => (
                                <tr key={row.id}>
                                    <td>{row.title}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-info btn-sm"
                                                onClick={() => setEditingRule(
                                                    ["form", "steps", currentStepKey, "transition", "rules", idx],
                                                    "STEP_TRANSITION_SCOPE"
                                                )}
                                            >
                                                Изменить
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </>
    )
}