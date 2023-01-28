import { css, cx } from "@emotion/css";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import SlateEditor from "../SlateEditor/SlateEditor";
import SlateEditorCompare from "../SlateEditor/SlateEditorCompare";
import { editorValue } from "../../type";

interface props {
  writingDocID: string;
  genre: string;
  value: editorValue[];
  setValue: React.Dispatch<React.SetStateAction<editorValue[]>>;
}
const WritingWrite: React.FC<props> = ({
  writingDocID,
  genre,
  value,
  setValue,
}) => {
  const [slateCompareValue, setSlateCompareValue] = useState([]);
  const [slateCompareOpen, setSlateCompareOpen] = useState(false);
  const [openDiagram, setOpenDiagram] = useState(false);

  // Selected compare key
  const [selectedCompareKey, setSelectedCompareKey] = useState("");

  return (
    <div
      className={cx(
        "w-full h-full mt-10 flex items-center justify-center pb-32 editor-container relative",
        css`
          :fullscreen {
            background-color: #e6ddda;
            padding-bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `
      )}
    >
      <AnimatePresence>
        {slateCompareOpen && (
          <SlateEditorCompare key="compare" valueProps={slateCompareValue} />
        )}
        <SlateEditor
          key="origin"
          selectedCompareKey={selectedCompareKey}
          setSelectedCompareKey={setSelectedCompareKey}
          setSlateCompareOpen={setSlateCompareOpen}
          setSlateCompareValue={setSlateCompareValue}
          openDiagram={openDiagram}
          setOpenDiagram={setOpenDiagram}
          writingDocID={writingDocID}
          genre={genre}
          value={value}
          setValue={setValue}
        />
      </AnimatePresence>
    </div>
  );
};

export default WritingWrite;
