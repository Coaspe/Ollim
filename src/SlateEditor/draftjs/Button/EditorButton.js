// import { RichUtils } from "draft-js";
// import { useEffect, useState } from "react";

// const EditorButton = ({ editorState, value, setEditorState }) => {
//   const [selected, setSelected] = useState(false);

//   const handleChange = (editorState) => {
//     setEditorState(editorState);
//   };

//   const onBoldClick = (e) => {
//     e.preventDefault();
//     handleChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
//   };

//   useEffect(() => {
//     setSelected(editorState.getCurrentInlineStyle().toArray().includes(value));
//   }, [editorState.getCurrentInlineStyle()]);

//   return (
//     <span
//       className={`${
//         selected ? "text-black" : "text-[#aaa]"
//       } material-icons w-[18px]`}
//       onClick={onBoldClick}
//       onMouseDown={(e) => {
//         e.preventDefault();
//       }}
//     >
//       format_bold
//     </span>
//   );
// };
// export default EditorButton;
