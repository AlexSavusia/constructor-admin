import type {GroupNode} from "../type.ts";
import GroupEditor from "./GroupEditor.tsx";

export type WhenEditorProps = {
    node: GroupNode
    onChange: (node: GroupNode) => void
}

export default function WhenEditor({node, onChange}: WhenEditorProps) {
    return (
        <section>
            <h3>WHEN</h3>
            <GroupEditor group={node} onChange={onChange} isRoot />
        </section>
    );
}