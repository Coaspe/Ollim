import React, { useCallback, useEffect, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate, ReactEditor } from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
  Text,
} from "slate";
import { withHistory } from "slate-history";
import { Button, Icon, Toolbar } from "./components";
import { cx, css } from "@emotion/css";
import blocks from "./block-list";
import Paragraph from "./paragraph";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+d": "diagram",
};

function clearTheSelection() {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    // IE?
    document.selection.empty();
  }
}

const SlateEditor = ({ openDiagram, setOpenDiagram }) => {
  const [value, setValue] = useState(initialValue);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [selected, setSelected] = useState("");

  const renderElement = ({ element, attributes, children }) => {
    const block = blocks.find((block) => block.type === element.type);
    const elementKey = ReactEditor.findKey(editor, element);
    let target = 0;
    for (let i = 0; i < value.length; i++) {
      const element = ReactEditor.findKey(editor, value[i]);
      if (elementKey === element) {
        target = i;
        break;
      }
    }
    if (block) {
      return block.renderBlock({ element, attributes, children });
    } else {
      return (
        <Paragraph
          element={element}
          attributes={attributes}
          children={children}
          lineNum={target}
        />
      );
    }
  };

  return (
    <div className="border border-black">
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          setValue(value);
          console.log(value);
        }}
      >
        <Toolbar>
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          <SvgButton
            openDiagram={openDiagram}
            setOpenDiagram={setOpenDiagram}
          />
          <DictButton selectedProp={selected} />
          <FontSize />
          <FontStyle />
        </Toolbar>
        <div
          className={cx(
            css`
              width: 210mm;
              height: 297mm;
            `
          )}
        >
          <Editable
            className="w-full"
            onMouseDown={clearTheSelection}
            onMouseUp={(e) => {
              let seleted = Editor.string(editor, editor.selection);
              setSelected(seleted);
            }}
            onBlur={() => {
              setSelected("");
            }}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            spellCheck
            autoFocus
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  if (mark === "diagram") {
                    setOpenDiagram((origin) => !origin);
                  } else {
                    toggleMark(editor, mark);
                  }
                }
              }
            }}
          />
        </div>
      </Slate>
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.type === "lineNum") {
    console.log("lineNum", children);

    return (
      <span
        className={cx(
          "absolute -left-5",
          css`
            -webkit-user-modify: read-only;
            --moz-user-modify: read-only:
          `
        )}
        {...attributes}
      >
        {children}
      </span>
    );
  }
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.fontSize) {
    children = <span className={`text-[${leaf.fontSize}px]`}>{children}</span>;
  }

  if (leaf.fontStyle) {
    children = <span className={leaf.fontStyle}>{children}</span>;
  }
  return <span {...attributes}>{children}</span>;
};
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
const MarkButton = ({ format, icon }) => {
  const editor = useSlate();

  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const fontSizeMark = (editor, size) => {
  Editor.addMark(editor, "fontSize", size);
};
const getFontSize = (editor) => {
  const value = Editor.marks(editor);
  return value ? value.fontSize : 13.3;
};
const FontSize = () => {
  const editor = useSlate();

  const size = {
    13.3: "10pt",
    14.7: "11pt",
    16: "12pt",
    17.3: "13pt",
    18.7: "14pt",
    20: "15pt",
  };

  return (
    <div className="relative group cursor-pointer z-40 hover:bg-gray-300">
      {/* <button>
          <span class="material-icons align-bottom px-1 text-[18px]">
            format_size
          </span>
        </button> */}
      <span>{size[getFontSize(editor)]}</span>
      <div className="absolute flex flex-col pt-3 invisible group-hover:visible">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[13.3px] bg-white w-14"
          value={13.3}
        >
          10pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[14.7px] bg-white w-14"
          value={14.7}
        >
          11pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[16px] bg-white w-14"
          value={16}
        >
          12pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[17.3px] bg-white w-14"
          value={17.3}
        >
          13pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[18.7px] bg-white w-14"
          value={18.7}
        >
          14pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[20px] bg-white w-14"
          value={20}
        >
          15pt
        </button>
      </div>
    </div>
  );
};

const changeAllTextFontStyle = (editor, style) => {
  Transforms.setNodes(
    editor,
    { fontStyle: style },
    {
      at: [],
      match: (n) => Text.isText(n),
    }
  );
};
const fontStyleMark = (editor, style) => {
  Editor.addMark(editor, "fontStyle", style);
};
const getFontStyle = (editor) => {
  const value = Editor.marks(editor);
  return value ? value.fontStyle : "font-noto";
};
const FontStyle = () => {
  const editor = useSlate();
  const fontStlyeObject = {
    "font-noto": "본명조",
    "font-serif": "고딕",
    "font-noto_sans": "본고딕",
    "font-Nanum_Gothic": "나눔고딕",
    "font-Song_Myung": "송명체",
    "font-Nanum_Myeongjo": "나눔명조",
  };
  const handleFontStyleButtonClick = (e) => {
    e.preventDefault();
    const {
      selection: { anchor, focus },
    } = editor;
    if (anchor.offset === focus.offset) {
      changeAllTextFontStyle(editor, e.target.value);
    } else {
      fontStyleMark(editor, e.target.value);
    }
  };
  return (
    <>
      <div className="relative group cursor-pointer z-40 hover:bg-gray-300 align-bottom">
        {/* <button>
          <span class="material-icons align-bottom px-1 text-[18px]">
            format_size
          </span>
        </button> */}
        <span className={`${getFontStyle(editor)}`}>
          {fontStlyeObject[getFontStyle(editor)]}
        </span>
        <div className="absolute flex flex-col pt-3 invisible group-hover:visible">
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-noto bg-white w-20"
            value="font-noto"
          >
            본명조
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-serif bg-white w-20"
            value="font-serif"
          >
            고딕
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-noto_sans bg-white w-20"
            value="font-noto_sans"
          >
            본고딕
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-Nanum_Gothic bg-white w-20"
            value="font-Nanum_Gothic"
          >
            나눔고딕
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-Song_Myung bg-white w-20"
            value="font-Song_Myung"
          >
            송명체
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-Nanum_Myeongjo bg-white w-20"
            value="font-Nanum_Myeongjo"
          >
            나눔명조
          </button>
        </div>
      </div>
    </>
  );
};

export const SvgButton = ({ openDiagram, setOpenDiagram }) => {
  return (
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 60 60"
      onClick={() => {
        setOpenDiagram((origin) => !origin);
      }}
      className={`w-[18px] cursor-pointer hover:fill-slate-400`}
      fill={`${openDiagram ? "black" : "#ccc"}`}
    >
      <path
        d="M53,41V29H31V19h7V3H22v16h7v10H7v12H0v16h16V41H9V31h20v10h-7v16h16V41h-7V31h20v10h-7v16h16V41H53z M24,5h12v12H24V5z
	      M14,55H2V43h12V55z M36,55H24V43h12V55z M58,55H46V43h12V55z"
      />
    </svg>
  );
};

export const DictButton = ({ selectedProp }) => {
  const editor = useSlate();
  return (
    <svg
      onMouseDown={(e) => {
        // To keep focus on selected word
        e.preventDefault();
      }}
      onClick={(e) => {
        // seleted text
        const seleted = Editor.string(editor, editor.selection);
        seleted
          ? window.open(
              `https://opendict.korean.go.kr/small/searchResult?query=${seleted.toString()}`,
              "_blank",
              "width=450,height=600"
            )
          : window.open(
              "https://opendict.korean.go.kr/small/main",
              "_blank",
              "width=450,height=600"
            );
      }}
      className={`w-[18px] cursor-pointer fill-[#ccc] ${
        selectedProp && "fill-slate-400"
      } hover:fill-slate-400`}
      viewBox="0 0 24 24"
    >
      <path
        d="M18,2 C19.3807,2 20.5,3.11929 20.5,4.5 L20.5,4.5 L20.5,18.75 C20.5,19.1642 20.1642,19.5 19.75,19.5 L19.75,19.5 L5.5,19.5 C5.5,20.0523 5.94772,20.5 6.5,20.5 L6.5,20.5 L19.75,20.5 C20.1642,20.5 20.5,20.8358 20.5,21.25 C20.5,21.6642 20.1642,22 19.75,22 L19.75,22 L6.5,22 C5.11929,22 4,20.8807 4,19.5 L4,19.5 L4,4.5 C4,3.11929 5.11929,2 6.5,2 L6.5,2 Z M16,5 L8,5 C7.44772,5 7,5.44772 7,6 L7,7 C7,7.55228 7.44772,8 8,8 L16,8 C16.5523,8 17,7.55228 17,7 L17,6 C17,5.44772 16.5523,5 16,5 Z"
        id="🎨-Color"
      ></path>
    </svg>
  );
};

const initialValue = [
  {
    type: "paragraph",
    children: [
      { type: "text", text: "", fontSize: 16, fontStyle: "font-noto" },
    ],
  },
];

export default SlateEditor;

// const toggleBlock = (editor, format) => {
//   const isActive = isBlockActive(editor, format);
//   const isList = LIST_TYPES.includes(format);

//   Transforms.unwrapNodes(editor, {
//     match: (n) =>
//       !Editor.isEditor(n) &&
//       SlateElement.isElement(n) &&
//       LIST_TYPES.includes(n.type),
//     split: true,
//   });
//   const newProperties = {
//     type: isActive ? "paragraph" : isList ? "list-item" : format,
//   };
//   Transforms.setNodes(editor, newProperties);

//   if (!isActive && isList) {
//     const block = { type: format, children: [] };
//     Transforms.wrapNodes(editor, block);
//   }
// };
// const isBlockActive = (editor, format) => {
//   const { selection } = editor;
//   if (!selection) return false;

//   const [match] = Array.from(
//     Editor.nodes(editor, {
//       at: Editor.unhangRange(editor, selection),
//       match: (n) =>
//         !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
//     })
//   );

//   return !!match;
// };
// const BlockButton = ({ format, icon }) => {
//   const editor = useSlate();
//   return (
//     <Button
//       active={isBlockActive(editor, format)}
//       onMouseDown={(event) => {
//         event.preventDefault();
//         toggleBlock(editor, format);
//       }}
//     >
//       <Icon>{icon}</Icon>
//     </Button>
//   );
// };
