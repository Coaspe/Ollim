// Import the `Editor` and `Transforms` helpers from Slate.
import { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Text } from "slate";
import { Editable, withReact, Slate } from "slate-react";

const Richtext = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const Leaf = (props) => {
    console.log(props);
    return (
      <span
        {...props.attributes}
        style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
      >
        {props.children}
      </span>
    );
  };

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        setValue(value);
        console.log(value);
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }
          switch (event.key) {
            // When "`" is pressed, keep our existing code block logic.
            case "`": {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                // n Document -> element -> text, then log result has 3 row
                match: (n) => n.type === "code",
              });
              console.log(match);
              Transforms.setNodes(
                editor,
                { type: match ? "null" : "code" },
                { match: (n) => Editor.isBlock(editor, n) }
              );
              break;
            }

            // When "B" is pressed, bold the text in the selection.
            case "b": {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => n.bold === true,
              });

              Transforms.setNodes(
                editor,
                { bold: match ? false : true },
                // Apply it to text nodes, and split the text node up if the
                // selection is overlapping only part of it.
                {
                  match: (n) => Text.isText(n),
                  split: true,
                }
              );
              break;
            }
            default: {
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

export default Richtext;
