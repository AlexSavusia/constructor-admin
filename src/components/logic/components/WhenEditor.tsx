import GroupEditor from "./GroupEditor.tsx";
import {useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";
import type { BooleanPropertyLogicDefinition} from "../../../logic/logic.ts";
import type {Rule} from "../types.ts";

export type WhenEditorProps = {

}

export default function WhenEditor() {
    const editingRule = useEditorContext(s=>s.editingRule)!
    const ruleType = "defaultValue" in editingRule.rule ? "property" : "expression"

    const rule = ruleType === "property" ? (editingRule.rule as BooleanPropertyLogicDefinition).rule
        : (editingRule.rule as Rule);
    // const path = getChildrenRootPathForRule([...editingRule.path, "condition"], rule.condition) as ObjPath

    if (rule.condition.type !== "and" && rule.condition.type !== "or") {
        throw new Error(`Invalid group rule`)
    }

    return (
        <section>
            <h3>{ruleType}</h3>
            <h3>WHEN</h3>
            <GroupEditor rule={rule.condition} path={["condition"]}/>
        </section>
    );
}