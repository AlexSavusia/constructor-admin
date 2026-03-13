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
import {parseValueExpression} from "./parser.ts";
import type {ValueExpression} from "../../../../logic/expression.ts";

export type OptionItem = {
    label: string;
    value: string;
};

type OptionsSource = OptionItem[] | Record<string, string>;
type MatchMode = "includes" | "startsWith";

type ReplaceContext = {
    query: string;
    replaceFrom: number;
    replaceTo: number;
};

type Props = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onSelect"
> & {
    value?: string;
    options: OptionsSource;
    onChange: (value: ValueExpression | null, rawValue: string) => void;
    //onOptionSelect?: (option: OptionItem, nextValue: string) => void;
    emptyText?: string;
    matchMode?: MatchMode;
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

function getReplaceContext(value: string, caret: number): ReplaceContext | null {
    const left = value.slice(0, caret);
    const right = value.slice(caret);

    const leftMatch = left.match(/([^\s+\-*/(),;:]*)$/);
    const rightMatch = right.match(/^([^\s+\-*/(),;:]*)/);

    const currentLeft = leftMatch?.[1] ?? "";
    const currentRight = rightMatch?.[1] ?? "";

    if (!currentLeft.trim()) return null;

    return {
        query: currentLeft,
        replaceFrom: caret - currentLeft.length,
        replaceTo: caret + currentRight.length,
    };
}

function replaceByContext(
    value: string,
    context: ReplaceContext,
    token: string,
): { nextValue: string; nextCaret: number } {
    const before = value.slice(0, context.replaceFrom);
    const after = value.slice(context.replaceTo);
    const inserted = token;
    const nextValue = `${before}${inserted}${after}`;
    const nextCaret = before.length + inserted.length;

    return { nextValue, nextCaret };
}

export default function InputAutocomplete({
                                              value,
                                              className = "",
                                              options,
                                              onChange: onChangeExt,
                                              //onOptionSelect,
                                              emptyText = "Nothing found",
                                              disabled,
                                              matchMode = "includes",
                                              onFocus,
                                              onBlur,
                                              onClick,
                                              onKeyUp,
                                              ...props
                                          }: Props) {
    function stripBrackets(value: string) {
        return value.replace(/\[([^\]]+)]/g, "$1");
    }

    const inputValue = stripBrackets(value ?? "");

    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [caretIndex, setCaretIndex] = useState(inputValue.length);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const onChange = (value: string) => {
        let parsed = null
        try {
            parsed = parseValueExpression(value)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) { /* empty */ }
        onChangeExt(parsed, value);
    }

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
        () => getReplaceContext(inputValue, caretIndex),
        [inputValue, caretIndex],
    );

    const filteredOptions = useMemo(() => {
        if (!replaceContext) {
            return normalizedOptions;
        }

        const query = replaceContext.query.trim();

        if (!query) {
            return normalizedOptions;
        }

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
        onChange(nextValue);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        setCaretIndex(event.target.selectionStart ?? event.target.value.length);
        setHighlightedIndex(-1);
        setIsOpen(true);
        emitChange(event.target.value);
    }

    function applyOption(option: OptionItem) {
        const currentCaret = inputRef.current?.selectionStart ?? inputValue.length;
        const context = getReplaceContext(inputValue, currentCaret);

        const displayResult = context
            ? replaceByContext(inputValue, context, option.value)
            : {
                nextValue: `${inputValue}${option.value}`,
                nextCaret: `${inputValue}${option.value}`.length,
            };

        const outputResult = context
            ? replaceByContext(inputValue, context, `[${option.value}]`)
            : {
                nextValue: `${inputValue}[${option.value}]`,
                nextCaret: `${inputValue}${option.value}`.length,
            };

        setIsOpen(false);
        setHighlightedIndex(-1);

        onChange(outputResult.nextValue);
        //onOptionSelect?.(option, outputResult.nextValue);

        requestAnimationFrame(() => {
            if (!inputRef.current) return;
            inputRef.current.focus();
            inputRef.current.setSelectionRange(displayResult.nextCaret, displayResult.nextCaret);
            setCaretIndex(displayResult.nextCaret);
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