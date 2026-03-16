import Palette from "./palette/Palette.tsx";
import Plane from "./plane/Plane.tsx";
import classNames from "classnames";
import PALETTE_ITEMS from "./palette/PaletteItems.ts";
// import type {FormDefinition} from "../../logic/type.ts";
// import {useEditorContext} from "../../pages/Programs/editor/EditorContext.tsx";
import Modal from "../Modal.tsx";
import {useState, useMemo} from "react";
import {useEditorContext} from "../../pages/Programs/editor/EditorContext.tsx";
import type { OptionItem } from "./type.ts";
import type {
    DictionaryRow,
    DictionarySchemaEntry,
} from "../../api/types.ts";

export type ConstructorProps = {
    className?: string;
};

type DictionaryOptionDraft = OptionItem & {
    rowId: string;
};

function getDictionaryCellValue(row: DictionaryRow, fieldId?: string): string {
    if (!fieldId) return "—";

    const cell = row.data?.[fieldId];
    if (!cell) return "—";

    if (cell.type === "COMMON") {
        return String(cell.value ?? "");
    }

    return "LINK";
}

function buildRowLabel(
    row: DictionaryRow,
    schema: DictionarySchemaEntry[],
): string {
    return schema
        .map((schemaEntry) => getDictionaryCellValue(row, schemaEntry.id))
        .filter((value) => value !== "" && value !== "—")
        .join(" | ")
        .trim();
}

function buildOptionsFromSelectedRows(
    rows: DictionaryRow[],
    selectedRowIds: string[],
    schema: DictionarySchemaEntry[],
): DictionaryOptionDraft[] {
    if (!selectedRowIds.length) return [];

    return rows
        .filter((row) => selectedRowIds.includes(String(row.id)))
        .map((row) => {
            const label = buildRowLabel(row, schema);

            return {
                rowId: String(row.id),
                label,
                value: label,
            };
        })
        .filter((item) => item.label !== "");
}

export default function Constructor({className}: ConstructorProps) {
    const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
    const currentStepKey = useEditorContext(s=>s.stepKey)!
    const currentTransitionRules = useEditorContext(s=>s.form.steps[s.stepKey!].transition)
    const setEditingRule = useEditorContext(s=>s.setEditingRule)
    const addStepTransitionRule = useEditorContext(s=>s.addStepTransitionRule)
    // const currentStepKey = useEditorContext(s=>s.stepKey)
    // const setEditingRule = useEditorContext(s=>s.setEditingRule)
    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
    const [dictionaryModalStep, setDictionaryModalStep] = useState<1 | 2>(1)
    const [optionsDraft, setOptionsDraft] = useState<DictionaryOptionDraft[]>([])

    const dictionaryPicker = useEditorContext((s) => s.dictionaryPicker);
    const closeDictionaryPicker = useEditorContext((s) => s.closeDictionaryPicker);
    const updateEditingFieldSettings = useEditorContext(
        (s) => s.updateEditingFieldSettings,
    );

    const selectedDictionary = dictionaryPicker?.dictionary ?? null;
    const dictionaryRows = dictionaryPicker?.rows ?? [];


    const toggleDictionaryRow = (rowId: string) => {
        setSelectedRowIds((prev) =>
            prev.includes(rowId)
                ? prev.filter((x) => x !== rowId)
                : [...prev, rowId],
        );
    };

    const selectedRows = useMemo(() => {
        return dictionaryRows.filter((row) => selectedRowIds.includes(String(row.id)));
    }, [dictionaryRows, selectedRowIds]);

    const handleNextDictionaryStep = () => {
        if (!selectedDictionary) return;

        const nextOptions = buildOptionsFromSelectedRows(
            dictionaryRows,
            selectedRowIds,
            selectedDictionary.schema,
        );

        setOptionsDraft(nextOptions);
        setDictionaryModalStep(2);
    };

    const handleBackDictionaryStep = () => {
        setDictionaryModalStep(1);
    };

    const handleOptionChange = (
        rowId: string,
        key: keyof OptionItem,
        nextValue: string,
    ) => {
        setOptionsDraft((prev) =>
            prev.map((item) =>
                item.rowId === rowId
                    ? {
                        ...item,
                        [key]: nextValue,
                    }
                    : item,
            ),
        );
    };

    const handleSaveDictionarySelection = () => {
        updateEditingFieldSettings({
            options: optionsDraft.map(({ ...option }) => option),
        });

        closeDictionaryPicker();
        setDictionaryModalStep(1);
        setOptionsDraft([]);
        setSelectedRowIds([]);
    };

    const handleCloseDictionaryPicker = () => {
        closeDictionaryPicker();
        setDictionaryModalStep(1);
        setOptionsDraft([]);
        setSelectedRowIds([]);
    };

    return (
        <>
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

            <Modal
                key={selectedDictionary?.id ?? "dictionary-picker"}
                title={
                    selectedDictionary
                        ? `Значения справочника: ${selectedDictionary.name}`
                        : "Значения справочника"
                }
                open={Boolean(dictionaryPicker?.open)}
                onClose={handleCloseDictionaryPicker}
                onSave={dictionaryModalStep === 2 ? handleSaveDictionarySelection : undefined}
            >
                {!selectedDictionary ? (
                    <div className="text-muted">Справочник не выбран</div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        <div className="alert alert-light border mb-0">
                            <div className="fw-semibold mb-1">
                                {dictionaryModalStep === 1
                                    ? "Шаг 1. Выбери значения"
                                    : "Шаг 2. Проверь и измени выбранные значения"}
                            </div>
                        </div>

                        {dictionaryModalStep === 1 && (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover align-middle">
                                        <thead>
                                        <tr>
                                            <th style={{ width: 70 }}>#</th>
                                            <th style={{ width: 90 }}>Выбрать</th>
                                            {selectedDictionary.schema.map(
                                                (schemaEntry: DictionarySchemaEntry) => (
                                                    <th key={schemaEntry.id}>
                                                        {schemaEntry.name}
                                                    </th>
                                                ),
                                            )}
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {dictionaryRows.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={selectedDictionary.schema.length + 2}
                                                    className="text-center text-muted"
                                                >
                                                    Нет строк в справочнике
                                                </td>
                                            </tr>
                                        ) : (
                                            dictionaryRows.map((row, rowIndex) => {
                                                const rowChecked = selectedRowIds.includes(
                                                    String(row.id),
                                                );

                                                return (
                                                    <tr
                                                        key={row.id}
                                                        className={rowChecked ? "table-success" : ""}
                                                    >
                                                        <td>{rowIndex + 1}</td>

                                                        <td>
                                                            <div className="form-check d-flex justify-content-center mb-0">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={rowChecked}
                                                                    onChange={() =>
                                                                        toggleDictionaryRow(
                                                                            String(row.id),
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </td>

                                                        {selectedDictionary.schema.map(
                                                            (
                                                                schemaEntry: DictionarySchemaEntry,
                                                            ) => (
                                                                <td key={`${row.id}-${schemaEntry.id}`}>
                                                                    {getDictionaryCellValue(
                                                                        row,
                                                                        schemaEntry.id,
                                                                    )}
                                                                </td>
                                                            ),
                                                        )}
                                                    </tr>
                                                );
                                            })
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleNextDictionaryStep}
                                        disabled={selectedRowIds.length === 0}
                                    >
                                        Далее
                                    </button>
                                </div>
                            </>
                        )}

                        {dictionaryModalStep === 2 && (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover align-middle">
                                        <thead>
                                        <tr>
                                            <th style={{ width: 70 }}>#</th>
                                            <th>Исходное значение</th>
                                            <th>Label</th>
                                            <th style={{ width: 160 }}>Действие</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {optionsDraft.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted">
                                                    Нет выбранных значений
                                                </td>
                                            </tr>
                                        ) : (
                                            optionsDraft.map((option, index) => {
                                                const selectedRow = selectedRows.find(
                                                    (row) => String(row.id) === option.rowId,
                                                );

                                                const originalLabel = selectedRow
                                                    ? buildRowLabel(
                                                        selectedRow,
                                                        selectedDictionary.schema,
                                                    )
                                                    : option.label;

                                                return (
                                                    <tr key={option.rowId}>
                                                        <td>{index + 1}</td>
                                                        <td>{originalLabel}</td>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={option.label}
                                                                onChange={(e) =>
                                                                    handleOptionChange(
                                                                        option.rowId,
                                                                        "label",
                                                                        e.target.value,
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary btn-sm"
                                                                onClick={() =>
                                                                    handleOptionChange(
                                                                        option.rowId,
                                                                        "label",
                                                                        originalLabel,
                                                                    )
                                                                }
                                                            >
                                                                Изменить
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleBackDictionaryStep}
                                    >
                                        Назад
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        <div className={classNames(className,  "d-flex flex-column flex-lg-row max-w-[1620px]","w-100","gap-3")}
             style={{ minHeight: "70vh" }}>
            <div  className="flex-shrink-0"
                  style={{width: "100%",maxWidth: 220}}>
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

        </>
    )
}