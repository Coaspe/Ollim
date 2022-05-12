import { useCallback, useEffect, useMemo, useState } from "react";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { cx, css } from "@emotion/css";
import { Leaf } from "./utils";
import { motion } from "framer-motion";
import ParagraphWithoutNum from "./paragraphWithoutNum";
import { useAppSelector } from "../hooks/useRedux";
const SlateEditorCompare = ({ valueProps }) => {
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const isFullScreen = useAppSelector(
    (state) => state.setIsFullScreen.isFullScreen
  );

  const renderElement = ({ element, attributes, children }) => {
    const elementKey = ReactEditor.findKey(editor, element);
    let target = 0;
    for (let i = 0; i < value.length; i++) {
      const element = ReactEditor.findKey(editor, value[i]);
      if (elementKey === element) {
        target = i;
        break;
      }
    }
    return (
      <ParagraphWithoutNum
        element={element}
        attributes={attributes}
        children={children}
        lineNum={target}
      />
    );
  };

  useEffect(() => {
    setLoading(false);
    setValue(valueProps);
  }, [valueProps]);

  useEffect(() => {
    value.length > 0 && setLoading(true);
  }, [value]);

  return (
    <>
      <motion.div className="mr-5" layout>
        {loading ? (
          <Slate
            editor={editor}
            value={value}
            onChange={(value) => {
              setValue(value);
            }}
          >
            <div
              style={{
                paddingBottom: !isFullScreen && "66px",
              }}
            ></div>
            <div
              style={{
                boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
                backgroundColor: "#FAF6F5",
              }}
              className={`z-50 overflow-y-scroll w-noneFullScreenMenu h-a4Height overflow-x-hidden ${
                isFullScreen && "my-5 h-a4FullScreenHeight"
              }`}
            >
              <Editable
                className={cx(
                  "whitespace-pre-wrap break-all",
                  css`
                    padding-top: 20px;
                    padding-bottom: 20px;
                    width: 220mm;
                    p {
                      cursor: text;
                      width: 210mm;
                      padding-right: 20px;
                      padding-left: 20px;
                    }
                    span {
                      max-width: 210mm;
                    }
                  `
                )}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck="false"
                readOnly
              />
            </div>
          </Slate>
        ) : (
          <div className="w-full h-full top-0 left-0 fixed flex items-center justify-center">
            <img
              style={{ width: "12%" }}
              src="/logo/Ollim-logos_black.png"
              alt="writing loading..."
            />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default SlateEditorCompare;
