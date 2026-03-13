import type {ValueExpression} from "../../../../logic/expression.ts";
import {objPathFromString} from "../../../../pages/Programs/editor/EditorContext.tsx";

type Token =
    | { type: "ref"; path: string }
    | { type: "func"; name: string }
    | { type: "number"; value: number }
    | { type: "string"; value: string }
    | { type: "plus" }
    | { type: "minus" }
    | { type: "mul" }
    | { type: "div" }
    | { type: "lparen" }
    | { type: "rparen" }

export function parseValueExpression(input: string): ValueExpression {
    const tokens = tokenize(input)
    if (tokens.length === 0) {
        throw new Error("Expression is empty")
    }

    let pos = 0

    function peek(): Token | undefined {
        return tokens[pos]
    }

    function consume(): Token {
        const token = tokens[pos]
        if (!token) {
            throw new Error("Unexpected end of expression")
        }
        pos++
        return token
    }

    function parsePrimary(): ValueExpression {
        const token = peek()
        if (!token) {
            throw new Error("Unexpected end of expression")
        }

        if (token.type === "lparen") {
            consume()
            const expr = parseAddSub()
            const closing = consume()
            if (closing.type !== "rparen") {
                throw new Error(`Expected ")" but got "${closing.type}"`)
            }
            return expr
        }

        consume()

        switch (token.type) {
            case "ref":
                return {
                    __typ: "ref",
                    path: objPathFromString(token.path),
                }

            case "func":
                return {
                    __typ: "func",
                    name: token.name,
                }

            case "number":
                return {
                    __typ: "const",
                    value: token.value,
                    valueType: "number",
                }

            case "string":
                return {
                    __typ: "const",
                    value: token.value,
                    valueType: "string",
                }

            default:
                throw new Error(`Unexpected token "${token.type}"`)
        }
    }

    function parseMulDiv(): ValueExpression {
        let left = parsePrimary()

        while (true) {
            const token = peek()
            if (!token || (token.type !== "mul" && token.type !== "div")) {
                break
            }

            consume()
            const right = parsePrimary()

            left = {
                __typ: "ast",
                operator: token.type === "mul" ? "mul" : "div",
                left,
                right,
            }
        }

        return left
    }

    function parseAddSub(): ValueExpression {
        let left = parseMulDiv()

        while (true) {
            const token = peek()
            if (!token || (token.type !== "plus" && token.type !== "minus")) {
                break
            }

            consume()
            const right = parseMulDiv()

            left = {
                __typ: "ast",
                operator: token.type === "plus" ? "add" : "sub",
                left,
                right,
            }
        }

        return left
    }

    const result = parseAddSub()

    if (pos < tokens.length) {
        throw new Error(`Unexpected token "${tokens[pos].type}" at position ${pos}`)
    }

    return result
}

function tokenize(input: string): Token[] {
    const tokens: Token[] = []
    let i = 0

    while (i < input.length) {
        const ch = input[i]

        if (/\s/.test(ch)) {
            i++
            continue
        }

        if (ch === "+") {
            tokens.push({ type: "plus" })
            i++
            continue
        }

        if (ch === "-") {
            tokens.push({ type: "minus" })
            i++
            continue
        }

        if (ch === "*") {
            tokens.push({ type: "mul" })
            i++
            continue
        }

        if (ch === "/") {
            tokens.push({ type: "div" })
            i++
            continue
        }

        if (ch === "(") {
            tokens.push({ type: "lparen" })
            i++
            continue
        }

        if (ch === ")") {
            tokens.push({ type: "rparen" })
            i++
            continue
        }

        if (ch === '"' || ch === "'") {
            const quote = ch
            i++
            const start = i

            while (i < input.length && input[i] !== quote) {
                i++
            }

            if (i >= input.length) {
                throw new Error(`Unterminated string starting at position ${start - 1}`)
            }

            const value = input.slice(start, i)
            i++

            tokens.push({
                type: "string",
                value,
            })
            continue
        }

        if (/\d/.test(ch)) {
            const start = i
            while (i < input.length && /[\d.]/.test(input[i])) {
                i++
            }

            const raw = input.slice(start, i)
            const value = Number(raw)

            if (Number.isNaN(value)) {
                throw new Error(`Invalid number "${raw}"`)
            }

            tokens.push({
                type: "number",
                value,
            })
            continue
        }

        if (ch === "[") {
            const closeIndex = input.indexOf("]", i)
            if (closeIndex === -1) {
                throw new Error(`Unclosed "[" at position ${i}`)
            }

            const content = input.slice(i + 1, closeIndex).trim()
            if (!content) {
                throw new Error(`Empty brackets at position ${i}`)
            }

            if (content.endsWith("()")) {
                const name = content.slice(0, -2).trim()
                if (!name) {
                    throw new Error(`Empty function name at position ${i}`)
                }

                tokens.push({
                    type: "func",
                    name,
                })
            } else {
                tokens.push({
                    type: "ref",
                    path: content,
                })
            }

            i = closeIndex + 1
            continue
        }

        throw new Error(`Unexpected character "${ch}" at position ${i}`)
    }

    return tokens
}