import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  Text,
} from "slate";
import { withHistory } from "slate-history";

import { Button, Icon, Toolbar } from "./components";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const SlateEditor = () => {
  const [value, setValue] = useState(initialValue);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <div className="w-2/3 border border-black">
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Toolbar>
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          {/* <MarkButton format="code" icon="code" />
          <BlockButton format="heading-one" icon="looks_one" />
          <BlockButton format="heading-two" icon="looks_two" /> */}
          {/* <BlockButton format="block-quote" icon="format_quote" /> */}
          {/* <BlockButton format="numbered-list" icon="format_list_numbered" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" /> */}
          <FontSize />
          <FontStyle />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
    </div>
  );
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return (
        <span className="px-2 py-1 bg-[#EEEEEE] rounded-lg" {...attributes}>
          {children}
        </span>
      );
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return (
        <span className="text-2xl font-black" {...attributes}>
          {children}
        </span>
      );
    case "heading-two":
      return (
        <span className="text-xl font-extrabold" {...attributes}>
          {children}
        </span>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
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

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });
  const newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};
const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
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
    <>
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
    </>
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
      <div className="relative group cursor-pointer z-40 hover:bg-gray-300">
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

const initialValue = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable ", fontSize: 16, fontStyle: "font-noto" },
      { text: "rich", bold: true, fontSize: 16, fontStyle: "font-noto" },
      { text: " text, ", fontSize: 16, fontStyle: "font-noto" },
      { text: "much", italic: true, fontSize: 16, fontStyle: "font-noto" },
      { text: " better than a ", fontSize: 16, fontStyle: "font-noto" },
      { text: "<textarea>", code: true, fontSize: 16, fontStyle: "font-noto" },
      { text: "!", fontSize: 16, fontStyle: "font-noto" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
        fontSize: 16,
        fontStyle: "font-noto",
      },
      { text: "bold", bold: true, fontSize: 16, fontStyle: "font-noto" },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
        fontSize: 16,
        fontStyle: "font-noto",
      },
    ],
  },
  // {
  //   type: "block-quote",
  //   children: [{ text: "A wise quote.", fontSize: 16, fontStyle: "font-noto" }],
  // },
  {
    type: "paragraph",
    children: [
      {
        text: "Try it out for yourself!",
        fontSize: 16,
        fontStyle: "font-noto",
      },
    ],
  },
];

export default SlateEditor;
