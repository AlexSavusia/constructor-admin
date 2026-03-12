import GroupEditor from "./GroupEditor.tsx";
import {type AndExpression, getChildrenRootPathForRule, type OrExpression} from "../../../logic/expression.ts";
import {type ObjPath, useEditorContext} from "../../../pages/Programs/editor/EditorContext.tsx";

export type WhenEditorProps = {

}

export default function WhenEditor() {
    const editingRule = useEditorContext(s=>s.editingRule)!
    const rule = editingRule.rule.condition

    if (rule.type !== "and" && rule.type !== "or") {
        throw new Error(`Invalid group rule`)
    }

    return (
        <section>
            <h3>WHEN</h3>
            <GroupEditor rule={rule} path={getChildrenRootPathForRule([...editingRule.path, "condition"], rule)[1] as ObjPath}/>
        </section>
    );
}