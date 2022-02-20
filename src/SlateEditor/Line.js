import { memo, useEffect, useState } from "react";
import { cx, css } from "@emotion/css";
import { ReactEditor, useSlate } from "slate-react";
import { useSelector } from "react-redux";

const Line = ({ element }) => {
  const editor = useSlate();
  const value = useSelector((state) => state.setValue.value);
  const [line, setline] = useState(-1);

  useEffect(() => {
    if (value[0] && value[0].children) {
      let tmp = value[0].children.map(
        (child) => ReactEditor.findKey(editor, child).id
      );
      setline(
        tmp.findIndex(
          (element) => element === ReactEditor.findKey(editor, element).id
        )
      );
    }
  }, [value[0].children.length]);

  return (
    <span
      className={cx(
        "absolute -left-5",
        css`
            -webkit-user-modify: read-only;
            --moz-user-modify: read-only:
          `
      )}
    >
      {line + 1}
    </span>
  );
};

export default Line;
