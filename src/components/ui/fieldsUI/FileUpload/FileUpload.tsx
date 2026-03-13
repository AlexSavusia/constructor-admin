import {type ChangeEvent, type DragEvent, useMemo, useRef, useState } from "react";
import "./FileUpload.css";

type Props = {
    label: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    files?: File[];
    onChange?: (files: File[]) => void;
    accept?: string[];
    maxFileSizeMb?: number;
};

export default function FileUploadUI({
                                         label,
                                         error,
                                         required,
                                         disabled = false,
                                         multiple = true,
                                         files = [],
                                         onChange,
                                         accept = ["jpg", "jpeg", "heic", "png", "pdf"],
                                         maxFileSizeMb = 20,
                                     }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [localError, setLocalError] = useState("");

    const acceptedLabel = useMemo(
        () => accept.map((item) => item.toUpperCase()).join(", "),
        [accept],
    );

    function validateFiles(selectedFiles: File[]) {
        const invalidFiles = selectedFiles.filter((file) => {
            const extension = file.name.split(".").pop()?.toLowerCase();
            const fileSizeMb = file.size / 1024 / 1024;

            return (
                !extension ||
                !accept.includes(extension) ||
                fileSizeMb > maxFileSizeMb
            );
        });

        if (invalidFiles.length > 0) {
            setLocalError(
                `Допустимы файлы ${acceptedLabel}, размер не более ${maxFileSizeMb} МБ`,
            );
            return false;
        }

        setLocalError("");
        return true;
    }

    function handleFiles(selectedFiles: File[]) {
        if (!validateFiles(selectedFiles)) return;
        onChange?.(selectedFiles);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const selectedFiles = Array.from(event.target.files ?? []);
        handleFiles(selectedFiles);
    }

    function handleDrop(event: DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        if (disabled) return;

        setDragOver(false);
        const droppedFiles = Array.from(event.dataTransfer.files);
        handleFiles(droppedFiles);
    }

    function handleDragOver(event: DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        if (disabled) return;
        setDragOver(true);
    }

    function handleDragLeave() {
        setDragOver(false);
    }

    function handleRemoveFile(removeIndex: number) {
        if (disabled) return;
        const nextFiles = files.filter((_, index) => index !== removeIndex);
        onChange?.(nextFiles);
    }

    return (
        <div className="field">
            <div className="fileUpload">
                <div className="fileUploadTop">
                    <div className="fileUploadLabel">
                        {required && <span className="required">*</span>}
                        <span>{label}</span>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="fileList">
                        {files.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="fileItem">
                                <div className="fileInfo">
                                    <span className="fileName">{file.name}</span>
                                    <span className="fileMeta">
                                        {(file.size / 1024 / 1024).toFixed(2)} МБ
                                    </span>
                                </div>

                                {!disabled && (
                                    <button
                                        type="button"
                                        className="fileRemoveBtn"
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!disabled && (
                    <label
                        className={`fileDropzone ${dragOver ? "dragOver" : ""}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <input
                            ref={inputRef}
                            className="fileInput"
                            type="file"
                            multiple={multiple}
                            onChange={handleInputChange}
                        />
                        <span className="fileDropzoneText">
                            Выберите файлы или перетащите их сюда
                        </span>
                    </label>
                )}

                <div className="fileHint">
                    Файлы {acceptedLabel}, не больше {maxFileSizeMb} МБ
                </div>

                {(error || localError) && (
                    <div className="errorText">{error || localError}</div>
                )}
            </div>
        </div>
    );
}