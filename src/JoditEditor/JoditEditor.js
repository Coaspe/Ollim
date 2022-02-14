import { useEffect, useRef, forwardRef, useLayoutEffect } from "react";
import { func, number, object, string } from "prop-types";
import { Jodit } from "./include.jodit";

const JoditEditor = forwardRef(
  (
    { config, id, name, onBlur, onChange, onDrag, tabIndex, value, editorRef },
    ref
  ) => {
    const textArea = useRef();

    useLayoutEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(textArea.current);
        } else {
          ref.current = textArea.current;
        }
      }
    }, [textArea]);

    useEffect(() => {
      const element = textArea.current;
      textArea.current = Jodit.make(element, config);
      textArea.current.workplace.tabIndex = tabIndex || -1;
      // adding event handlers
      textArea.current.events.on(
        "blur",
        (e) => onBlur && onBlur(textArea.current.value, e)
      );
      textArea.current.events.on("change", (value) => {
        onChange && onChange(value);
      });

      textArea.current.events.on("mouseup", (e) => {
        // console.log(textArea.current.selection.sel.toString());
        // let ctl = document.getSelection();

        // console.log(ctl.type);
        // if (window.getSelection().toString()) {
        //   let pos = window.getSelection().getRangeAt(0).getBoundingClientRect();
        //   let scrollY = window.scrollY;
        //   let posX = pos.left + pos.width;
        //   let posY = pos.top - pos.height - 10 + scrollY;
        //   document
        //     .getElementsByClassName("jodit-wysiwyg")[0]
        //     .addEventListener("scroll", (ex) => {
        //       let posX = e.pageX + pos.width;
        //       let posY = e.pageY - pos.height - 30 - ex.target.scrollTop;
        //       let visible = e.layerY > ex.target.scrollTop;
        //       onDrag &&
        //         onDrag(window.getSelection().toString(), [posX, posY], visible);
        //     });
        //   } else {
        //     onDrag("", [0, 0], false);
        //   }
        onDrag && onDrag(window.getSelection().toString(), true);
      });

      if (id) element.id = id;
      if (name) element.name = name;

      if (typeof editorRef === "function") {
        editorRef(textArea.current);
      }

      return () => {
        if (textArea?.current) {
          textArea.current.destruct();
        }
        textArea.current = element;
      };
    }, [config]);

    useEffect(() => {
      if (textArea?.current?.value !== value) {
        textArea.current.value = value;
      }
    }, [value]);

    return <textarea ref={textArea} />;
  }
);

JoditEditor.propTypes = {
  config: object,
  id: string,
  name: string,
  onBlur: func,
  onChange: func,
  editorRef: func,
  tabIndex: number,
  value: string,
};

export default JoditEditor;
