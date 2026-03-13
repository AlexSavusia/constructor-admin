import * as React from 'react';
import { useMemo } from 'react';
import classNames from 'classnames';
import { ReactGridLayout, useContainerWidth, verticalCompactor } from 'react-grid-layout';
import type { PaletteItemDescriptor, PaletteItemSettingsValues, ValueTypeAlias } from '../type.ts';

import RightSidebar from '../../RightSidebar.tsx';
import SettingsSidebar from '../SettingsSidebar.tsx';
import type { FieldDefinition } from '../../../logic/field.ts';
import RuleEditor from '../../logic/components/RuleEditor.tsx';
import { useEditorContext } from '../../../pages/Programs/editor/EditorContext.tsx';

export type PlaneProps = {
    className?: string;
    items: PaletteItemDescriptor[];
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function getDescriptor(key: string, descriptors: PaletteItemDescriptor[]): PaletteItemDescriptor | null {
    return descriptors.find((x) => x.key === key) ?? null;
}

function buildDefaultSettingsValues(descriptor: PaletteItemDescriptor): PaletteItemSettingsValues {
    return descriptor.settings.reduce<PaletteItemSettingsValues>((acc, setting) => {
        if (setting.defaultValue !== undefined) {
            acc[setting.key] = setting.defaultValue as ValueTypeAlias | ValueTypeAlias[];
            return acc;
        }

        if (setting.valType === 'string') acc[setting.key] = '';
        if (setting.valType === 'number') acc[setting.key] = 0;
        if (setting.valType === 'boolean') acc[setting.key] = false;
        if (setting.valType === 'datetime') acc[setting.key] = new Date();

        return acc;
    }, {});
}

export default function Plane({ className, items }: PlaneProps) {
    const marginX = 0;
    const marginY = 0;
    const paddingX = 0;
    const paddingY = 0;
    const cols = 3;
    const rowHeight = 56;
    const currentStepKey = useEditorContext((s) => s.stepKey!);
    const currentStep = useEditorContext((s) => s.form.steps[s.stepKey!]);
    const addField = useEditorContext((s) => s.addField);
    const removeField = useEditorContext((s) => s.removeField);
    const updateStepLayout = useEditorContext((s) => s.updateStepLayout);
    const editingField = useEditorContext((s) => s.editingField);
    const resetEditingField = useEditorContext((s) => s.resetEditingField);
    const setEditingField = useEditorContext((s) => s.setEditingField);
    const layoutItems = useMemo(() => Object.entries(currentStep.fields).map((v) => v[1]), [currentStep]);
    //const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const { width, containerRef, mounted } = useContainerWidth();
    //const [editingRule, setEditingRule] = useState<EditorEditingRule & {scope: ExpressionScope, path: NodePath} | null>(null);

    const stepLayout = useMemo(() => [...Object.entries(currentStep.fields).map((v) => v[1].layout)], [currentStep]);

    const colW = width / cols;

    // const selectedItem = useMemo(
    //     () => layoutItems.find((x) => x.key === selectedItemId) ?? null,
    //     [layoutItems, selectedItemId],
    // );
    //
    // const selectedDescriptor = useMemo(
    //     () =>
    //         selectedItem
    //             ? getDescriptor(selectedItem.descriptorKey, items)
    //             : null,
    //     [selectedItem, items],
    // );

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();

        const descriptorKey = e.dataTransfer.getData('application/x-descriptor');
        if (!descriptorKey || !containerRef.current) return;

        const descriptor = getDescriptor(descriptorKey, items);
        if (!descriptor) return;

        const rect = containerRef.current.getBoundingClientRect();

        const px = e.clientX - rect.left - paddingX;
        const py = e.clientY - rect.top - paddingY;

        const x = clamp(Math.round(px / (colW + marginX)), 0, cols - 1);
        const y = Math.max(0, Math.round(py / (rowHeight + marginY)));

        const id = crypto.randomUUID();
        // debugger
        const newItem: FieldDefinition = {
            //TODO all of this have to be configured here properly
            capabilities: {
                canBeVisible: false,
                canBeEnabled: false,
                canBeRequired: false,
                canBeSetValue: false,
            },
            control: 'input',
            fieldType: 'input',
            valueType: 'unknown',
            defaultValue: undefined,
            logic: {
                visibility: {
                    defaultValue: true,
                    rule: {
                        condition: {
                            id: crypto.randomUUID(),
                            type: 'and',
                            items: [],
                        },
                        actions: [],
                    },
                },
                enabled: {
                    defaultValue: true,
                    rule: {
                        condition: {
                            id: crypto.randomUUID(),
                            type: 'and',
                            items: [],
                        },
                        actions: [],
                    },
                },
                required: {
                    defaultValue: true,
                    rule: {
                        condition: {
                            id: crypto.randomUUID(),
                            type: 'and',
                            items: [],
                        },
                        actions: [],
                    },
                },
                // value: {}
            },
            /////////////////////////////////

            __typ: 'field',
            key: id,
            descriptorKey: descriptor.key,
            settingsValues: buildDefaultSettingsValues(descriptor),
            layout: {
                i: id,
                x,
                y,
                w: descriptor.minWidth ?? 1,
                h: 3,
                minW: descriptor.minWidth,
                maxW: descriptor.maxWidth,
                resizeHandles: ['e', 'w'],
            },
        };
        addField(currentStepKey, newItem);
    };

    const updateEditingFieldSettings = useEditorContext((s) => s.updateEditingFieldSettings);

    const handleSettingChange = (key: string, value: ValueTypeAlias) => {
        updateEditingFieldSettings({ [key]: value });
    };

    const handleDelete = (id: string) => {
        removeField(currentStepKey, id);
        if (editingField?.key === id) {
            resetEditingField();
        }
    };

    return (
        <>
            <div className={classNames(className, 'card card-outline card-secondary h-100 mb-0')}>
                <div className="card-header">
                    <h3 className="card-title mb-0">Полотно</h3>
                    <div className="card-tools d-flex align-items-center gap-2">
                        {/*<button type="button" className="btn btn-success btn-sm" onClick={()=>{*/}
                        {/*    const {form} = ctx!.getState()*/}
                        {/*    onSave(form)*/}
                        {/*}}>*/}
                        {/*    <i className="fas fa-save me-1" />*/}
                        {/*    Сохранить*/}
                        {/*</button>*/}
                    </div>
                </div>

                <div className="card-body p-2">
                    <div
                        onDrop={onDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className={classNames('w-100')}
                        ref={containerRef}
                    >
                        {mounted && (
                            <div
                                className="position-relative rounded"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: '1px dashed rgba(0,0,0,.25)',
                                    backgroundColor: 'var(--bs-body-bg)',
                                    overflow: 'hidden',
                                    backgroundImage: `
                                    repeating-linear-gradient(
                                      to right,
                                      rgba(0,0,0,0.08) 0px,
                                      rgba(0,0,0,0.08) 1px,
                                      transparent 1px,
                                      transparent ${colW}px
                                    )
                                  `,
                                }}
                            >
                                <ReactGridLayout
                                    style={{ background: 'rgba(108,117,125,0.37)' }}
                                    width={width}
                                    gridConfig={{ cols, rowHeight }}
                                    dragConfig={{
                                        enabled: true,
                                        handle: '.handle',
                                        cancel: '.react-resizable-handle, input, textarea, select, button, [contenteditable=true]',
                                    }}
                                    compactor={verticalCompactor}
                                    layout={stepLayout}
                                    onLayoutChange={(l) => updateStepLayout(currentStepKey, l)}
                                >
                                    {stepLayout.map((it) => {
                                        const layoutItem = layoutItems.find((x) => x.key === it.i) ?? null;

                                        if (!layoutItem) {
                                            return (
                                                <div key={it.i} className="card">
                                                    <div className="card-body">Invalid component</div>
                                                </div>
                                            );
                                        }

                                        const descriptor = getDescriptor(layoutItem.descriptorKey, items);

                                        if (!descriptor) {
                                            return (
                                                <div key={it.i} className="card">
                                                    <div className="card-body">Descriptor not found</div>
                                                </div>
                                            );
                                        }

                                        const { Element } = descriptor;
                                        const fieldTitle = String(layoutItem.settingsValues?.label ?? '') || descriptor.title;

                                        return (
                                            <div
                                                key={it.i}
                                                className={classNames(
                                                    'card shadow-sm mb-0 ',
                                                    editingField?.key === layoutItem.key && 'border border-primary'
                                                )}
                                            >
                                                <div
                                                    className="card-header handle text-muted py-1 d-flex align-items-center justify-content-end"
                                                    style={{ cursor: 'move' }}
                                                >
                                                    <span className="small text-truncate me-2">{fieldTitle}</span>

                                                    <span className="text-muted" title="Переместить" style={{ lineHeight: 1 }}>
                                                        <i className="fas fa-grip-lines" />
                                                    </span>
                                                </div>

                                                <div className="card-body p-2">
                                                    <Element settingsValues={layoutItem.settingsValues} />
                                                </div>

                                                <div className="px-2 pb-2 d-flex justify-content-between align-items-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-link btn-sm p-0 text-decoration-none"
                                                        onClick={() => setEditingField(currentStepKey, layoutItem?.key)}
                                                    >
                                                        Настроить
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-link btn-sm p-0 text-danger text-decoration-none"
                                                        onClick={() => handleDelete(layoutItem.key)}
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </ReactGridLayout>
                                {!stepLayout.length && (
                                    <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                                        Перетащите элемент из палитры сюда
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="card-footer text-muted small">Перетаскивание — за ручку в шапке блока</div>
            </div>
            <RightSidebar title="Настройки поля" open={!!editingField} onClose={resetEditingField}>
                {!!editingField && <SettingsSidebar items={items} onChange={handleSettingChange} />}
            </RightSidebar>
            <RuleEditor />
        </>
    );
}
