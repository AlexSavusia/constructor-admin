import type {RuleEditorState} from "../type.ts";
import {useState} from "react";
import WhenEditor from "./WhenEditor.tsx";
import ThenEditor from "./ThenEditor.tsx";

export type RuleEditorProps = {
    rule?: RuleEditorState
}

const createEmptyRule = (): RuleEditorState => ({
    id: "MAKE RANDOM",
    name: "Empty rule",
    then: [],
    when: {
        id: "MAKE RANDOM",
        type: "group",
        enabled: true,
        operator: 'all',
        children: []
    }
})

export default function RuleEditor({rule: initRule}: RuleEditorProps) {
    const [rule, setRule] = useState<RuleEditorState>(initRule ?? createEmptyRule())

    return (
        <div>
            <WhenEditor
                node={rule.when}
                onChange={(when) => {
                    setRule((s) => ({ ...s, when }))
                }} />
            <ThenEditor
                node={rule.then}
                onChange={(then) => setRule((s) => ({ ...s, then }))}
            />
        </div>
    )
}