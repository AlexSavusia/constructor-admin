import {
    type ChangeEvent,
    type InputHTMLAttributes,
    type KeyboardEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import classNames from "classnames";

export type OptionItem = {
    label: string;
    value: string;
};

type OptionsSource = OptionItem[] | Record<string, string>;
type MatchMode = "includes" | "startsWith";

type ReplaceContext =
    | {
    query: string;
    replaceFrom: number;
    replaceTo: number;
    insertSuffix: string;
}
    | null;

type Props = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onSelect"
> & {
    value?: string;
    options: OptionsSource;
    onChange?: (value: string) => void;
    onOptionSelect?: (option: OptionItem, nextValue: string) => void;
    emptyText?: string;
    matchMode?: MatchMode;
    bracketOnly?: boolean;
};

function normalizeOptions(options: OptionsSource): OptionItem[] {
    if (Array.isArray(options)) return options;

    return Object.entries(options).map(([value, label]) => ({
        value,
        label,
    }));
}

function matches(text: string, query: string, mode: MatchMode): boolean {
    const source = text.toLowerCase();
    const needle = query.toLowerCase();

    if (!needle) return true;
    return mode === "startsWith"
        ? source.startsWith(needle)
        : source.includes(needle);
}

function getBracketContext(value: string, caret: number): ReplaceContext {
    const leftPart = value.slice(0, caret);
    const openIndex = leftPart.lastIndexOf("[");

    if (openIndex < 0) return null;

    const closeBeforeCaret = leftPart.lastIndexOf("]");
    if (closeBeforeCaret > openIndex) return null;

    const closeAfterOpen = value.indexOf("]", openIndex);
    if (closeAfterOpen !== -1 && closeAfterOpen < caret) return null;

    return {
        query: value.slice(openIndex + 1, caret),
        replaceFrom: openIndex + 1,
        replaceTo: caret,
        insertSuffix: closeAfterOpen === -1 ? "]" : "",
    };
}

function getWordContext(value: string, caret: number): ReplaceContext {
    const left = value.slice(0, caret);
    const right = value.slice(caret);

    const leftMatch = left.match(/([^\s()[\]+\-*/.,;:]*)$/);
    const rightMatch = right.match(/^([^\s()[\]+\-*/.,;:]*)/);

    const currentLeft = leftMatch?.[1] ?? "";
    const currentRight = rightMatch?.[1] ?? "";

    if (!currentLeft.trim()) return null;

    return {
        query: currentLeft,
        replaceFrom: caret - currentLeft.length,
        replaceTo: caret + currentRight.length,
        insertSuffix: "",
    };
}

function getReplaceContext(
    value: string,
    caret: number,
    bracketOnly: boolean,
): ReplaceContext {
    const bracketContext = getBracketContext(value, caret);
    if (bracketContext || bracketOnly) return bracketContext;

    return getWordContext(value, caret);
}

function replaceByContext(
    value: string,
    context: Exclude<ReplaceContext, null>,
    token: string,
) {
    const before = value.slice(0, context.replaceFrom);
    const after = value.slice(context.replaceTo);
    const inserted = `${token}${context.insertSuffix}`;
    const nextValue = `${before}${inserted}${after}`;
    const nextCaret = before.length + inserted.length;

    return { nextValue, nextCaret };
}

export default function InputAutocomplete({
                                              value,
                                              className = "",
                                              options,
                                              onChange,
                                              onOptionSelect,
                                              emptyText = "Nothing found",
                                              disabled,
                                              matchMode = "includes",
                                              bracketOnly = false,
                                              onFocus,
                                              onBlur,
                                              onClick,
                                              onKeyUp,
                                              ...props
                                          }: Props) {
    const inputValue = value ?? "";

    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [caretIndex, setCaretIndex] = useState(inputValue.length);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (!rootRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const normalizedOptions = useMemo(
        () => normalizeOptions(options),
        [options],
    );

    const replaceContext = useMemo(
        () => getReplaceContext(inputValue, caretIndex, bracketOnly),
        [inputValue, caretIndex, bracketOnly],
    );

    const filteredOptions = useMemo(() => {
        if (!replaceContext) {
            return normalizedOptions;
        }


        const query = replaceContext.query.trim();

        return normalizedOptions.filter(
            (option) =>
                matches(option.label, query, matchMode) ||
                matches(option.value, query, matchMode),
        );
    }, [normalizedOptions, replaceContext, matchMode]);

    function syncCaret() {
        const nextCaret = inputRef.current?.selectionStart ?? inputValue.length;
        setCaretIndex(nextCaret);
    }

    function emitChange(nextValue: string) {
        onChange?.(nextValue);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        setCaretIndex(event.target.selectionStart ?? event.target.value.length);
        setHighlightedIndex(-1);
        setIsOpen(true);
        emitChange(event.target.value);
    }

    function applyOption(option: OptionItem) {
        const currentCaret = inputRef.current?.selectionStart ?? inputValue.length;
        const context = getReplaceContext(inputValue, currentCaret, bracketOnly);

        const result = context
            ? replaceByContext(inputValue, context, option.value)
            : { nextValue: option.value, nextCaret: option.value.length };

        setIsOpen(false);
        setHighlightedIndex(-1);
        emitChange(result.nextValue);
        onOptionSelect?.(option, result.nextValue);

        requestAnimationFrame(() => {
            if (!inputRef.current) return;
            inputRef.current.focus();
            inputRef.current.setSelectionRange(result.nextCaret, result.nextCaret);
            setCaretIndex(result.nextCaret);
        });
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            if (filteredOptions.length > 0) {
                event.preventDefault();
                setIsOpen(true);
                setHighlightedIndex(0);
            }
            return;
        }

        if (event.key === "ArrowDown" && filteredOptions.length > 0) {
            event.preventDefault();
            setIsOpen(true);
            setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0,
            );
            return;
        }

        if (event.key === "ArrowUp" && filteredOptions.length > 0) {
            event.preventDefault();
            setIsOpen(true);
            setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1,
            );
            return;
        }

        if ((event.key === "Enter" || event.key === "Tab") && isOpen) {
            const option = filteredOptions[highlightedIndex];
            if (option) {
                event.preventDefault();
                applyOption(option);
            }
            return;
        }

        if (event.key === "Escape") {
            setIsOpen(false);
            setHighlightedIndex(-1);
        }
    }

    return (
        <div ref={rootRef} className="position-relative w-100">
            <input
                {...props}
                ref={inputRef}
                disabled={disabled}
                autoComplete="off"
                className={classNames("form-control", className)}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={(event) => {
                    if (!disabled && filteredOptions.length > 0) {
                        setIsOpen(true);
                    }
                    onFocus?.(event);
                }}
                onBlur={(event) => {
                    onBlur?.(event);
                }}
                onClick={(event) => {
                    syncCaret();
                    onClick?.(event);
                }}
                onKeyUp={(event) => {
                    syncCaret();
                    onKeyUp?.(event);
                }}
                onSelect={syncCaret}
            />

            {isOpen && !disabled && (
                <div
                    className="dropdown-menu show w-100"
                    style={{ maxHeight: 240, overflowY: "auto" }}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <button
                                key={`${option.value}-${index}`}
                                type="button"
                                className={classNames("dropdown-item", {
                                    active: index === highlightedIndex,
                                })}
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    applyOption(option);
                                }}
                            >
                                <div>{option.label}</div>
                                {option.label !== option.value && (
                                    <small className="text-muted">
                                        {option.value}
                                    </small>
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="dropdown-item text-muted">{emptyText}</div>
                    )}
                </div>
            )}
        </div>
    );
}