import { useSlate } from "slate-react";
import { Editor, Transforms, Text } from "slate";
import { Button, Icon } from "./components";

export const Leaf = ({ attributes, children, leaf }) => {
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

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const MarkButton = ({ format, icon }) => {
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

export const fontSizeMark = (editor, size) => {
  Editor.addMark(editor, "fontSize", size);
};

export const getFontSize = (editor) => {
  const value = Editor.marks(editor);
  return value ? value.fontSize : 13.3;
};

export const changeAllTextFontStyle = (editor, style) => {
  Transforms.setNodes(
    editor,
    { fontStyle: style },
    {
      at: [],
      match: (n) => Text.isText(n),
    }
  );
};
export const fontStyleMark = (editor, style) => {
  Editor.addMark(editor, "fontStyle", style);
};
export const getFontStyle = (editor) => {
  const value = Editor.marks(editor);
  return value ? value.fontStyle : "font-noto";
};
export const FontSize = () => {
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
    <div className="relative group cursor-pointer z-40 font-noto">
      <span>{size[getFontSize(editor)]}</span>
      <div className="absolute flex flex-col pt-3 invisible group-hover:visible">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[13.3px] bg-white w-14 hover:bg-gray-300 py-1"
          value={13.3}
        >
          10pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[14.7px] bg-white w-14 hover:bg-gray-300 py-1"
          value={14.7}
        >
          11pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[16px] bg-white w-14 hover:bg-gray-300 py-1"
          value={16}
        >
          12pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[17.3px] bg-white w-14 hover:bg-gray-300 py-1"
          value={17.3}
        >
          13pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[18.7px] bg-white w-14 hover:bg-gray-300 py-1"
          value={18.7}
        >
          14pt
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fontSizeMark(editor, e.target.value);
          }}
          className="text-[20px] bg-white w-14 hover:bg-gray-300 py-1"
          value={20}
        >
          15pt
        </button>
      </div>
    </div>
  );
};

export const FontStyle = () => {
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
      <div className="relative group cursor-pointer z-40 align-bottom">
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
            className="font-noto bg-white w-20 hover:bg-gray-300 py-1"
            value="font-noto"
          >
            본명조
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-serif bg-white w-20 hover:bg-gray-300 py-1"
            value="font-serif"
          >
            고딕
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-noto_sans bg-white w-20 hover:bg-gray-300 py-1"
            value="font-noto_sans"
          >
            본고딕
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-Nanum_Gothic bg-white w-20 hover:bg-gray-300 py-1"
            value="font-Nanum_Gothic"
          >
            나눔고딕
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-Song_Myung bg-white w-20 hover:bg-gray-300 py-1"
            value="font-Song_Myung"
          >
            송명체
          </button>
          <button
            onMouseDown={(e) => {
              handleFontStyleButtonClick(e);
            }}
            className="font-Nanum_Myeongjo bg-white w-20 hover:bg-gray-300 py-1"
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

export const initialValue = [
  {
    type: "paragraph",
    children: [
      { type: "text", text: "", fontSize: 16, fontStyle: "font-noto" },
    ],
  },
];
