import { Editor, Transforms } from "slate";

export const isBlockActive = (editor, type) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === type,
  });

  return !!match;
};

const toggleBlock = (editor, type) => {
  const LIST_TYPES = ["numbered-list", "bulleted-list"];
  const isActive = isBlockActive(editor, type);
  const isList = LIST_TYPES.includes(type);

  Transforms.unwrapNodes(editor, {
    match: (n) => {
      return LIST_TYPES.includes(n.type);
    },
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : type,
  });

  if (!isActive && isList) {
    const block = { type: type, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export default toggleBlock;
