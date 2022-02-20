import { Transforms, Element, Text, Editor } from "slate";
import { ReactEditor } from "slate-react";

function withCustomNormalize(editor) {
  // can include custom normalizations
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    console.log("Normalize");
    const [node, path] = entry;

    if (Text.isText(node)) return normalizeNode(entry);

    // Fall back to the original `normalizeNode` to enforce other constraints.
    return normalizeNode(entry);
  };
  return editor;
}

export default withCustomNormalize;
