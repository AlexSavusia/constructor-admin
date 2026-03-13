import GroupEditor from "./GroupEditor.tsx";
import {useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";
import type {BooleanPropertyLogicDefinition, StepTransitionRule} from "../../../logic/logic.ts";
import type {Rule} from "../types.ts";

export type WhenEditorProps = {

}

export default function WhenEditor() {
    const editingRule = useEditorContext(s=>s.editingRule)!
    //const ruleType = "defaultValue" in editingRule.rule ? "property" : "expression"

    let rule: Rule | null = null;

    if(editingRule.scope === "FIELD_SCOPE_PROPERTY") {
        rule = (editingRule.rule as BooleanPropertyLogicDefinition).rule
    } else if(editingRule.scope === "FIELD_SCOPE_DECISION") {
        rule = (editingRule.rule as Rule);
    } else if(editingRule.scope === "STEP_TRANSITION_SCOPE") {
        rule = {
            condition: (editingRule.rule as StepTransitionRule).when,
            actions: []
        };
    } else {
        throw new Error(`Invalid scope "${editingRule.scope}"`);
    }



    if (rule.condition.type !== "and" && rule.condition.type !== "or") {
        throw new Error(`Invalid group rule`)
    }

    return (
        <section>
            <h3>{editingRule.scope}</h3>
            <h3>WHEN</h3>
            <GroupEditor rule={rule.condition} path={["condition"]}/>
        </section>
    );
}