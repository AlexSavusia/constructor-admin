import GroupEditor from "./GroupEditor.tsx";
import type {AndExpression, OrExpression} from "../../../logic/expression.ts";
import type {NodePath} from "./reducer.ts";

export type WhenEditorProps = {
    // Root is always and or 'or' (all any)
    rule?: AndExpression | OrExpression
    path: NodePath
}

export default function WhenEditor({rule, path}: WhenEditorProps) {

    const initRule: AndExpression | OrExpression = rule ?? {
        id: crypto.randomUUID(),
        type: "and",
        items: []
    }

    if (initRule.type !== "and" && initRule.type !== "or") {
        throw new Error(`Invalid group rule`)
    }

    return (
        <section>
            <h3>WHEN</h3>
            <GroupEditor rule={initRule} path={path} />
        </section>
    );
}