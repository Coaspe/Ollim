// import { Editor, EditorBlock, EditorState, RichUtils } from "draft-js";
// import React, { useState } from "react";
// import "./draft.css";
// import createStyles from "draft-js-custom-styles";
// import EditorButton from "./Button/EditorButton";
// import EditorFontSizeButton from "./Button/EditorFontSizeButton";
// const Line = (props) => {
//   const { block, contentState } = props;
//   const lineNumber =
//     contentState
//       .getBlockMap()
//       .toList()
//       .findIndex((item) => item.key === block.key) + 1;
//   return (
//     <div className="line" data-line-number={lineNumber}>
//       <div className="line-text">
//         <EditorBlock {...props} />
//       </div>
//     </div>
//   );
// };

// const blockRendererFn = () => ({
//   component: Line,
// });

// const DraftEditor = () => {
// const { styles, customStyleFn } = createStyles(["font-size", "font-family"]);
// const [editorState, setEditorState] = useState(EditorState.createEmpty());
// const handleChange = (editorState) => {
//   setEditorState(editorState);
// };
// const onItalicClick = (e) => {
//   e.preventDefault();
//   handleChange(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
// };
// const getCurrentTextSelection = () => {
//   const selectionState = editorState.getSelection();
//   const anchorKey = selectionState.getAnchorKey();
//   const currentContent = editorState.getCurrentContent();
//   const currentContentBlock = currentContent.getBlockForKey(anchorKey);
//   const start = selectionState.getStartOffset();
//   const end = selectionState.getEndOffset();
//   const selectedText = currentContentBlock.getText().slice(start, end);
//   return selectedText;
// };
// return (
//   <div className="container">
//     <div className="flex gap-5">
//       {editorState && (
//         <EditorButton
//           editorState={editorState}
//           setEditorState={setEditorState}
//           value="BOLD"
//         />
//       )}
//       <button
//         onClick={onItalicClick}
//         onMouseDown={(e) => {
//           e.preventDefault();
//         }}
//       >
//         Italic
//       </button>
//       <EditorFontSizeButton
//         styles={styles}
//         editorState={editorState}
//         setEditorState={setEditorState}
//       />
//     </div>
//     <div
//       onMouseUp={() => {
//         console.log(getCurrentTextSelection());
//       }}
//     >
//       <Editor
//         customStyleFn={customStyleFn}
//         customStyleMaps={customStyleMaps}
//         // customStyleFn={customStyleFn}
//         editorState={editorState}
//         onChange={handleChange}
//         blockRendererFn={blockRendererFn}
//       />
//     </div>
//   </div>
// );
// };
// export default DraftEditor;
// export const customStyleMaps = {
//   FONT_SIZE_10: {
//     fontSize: 10,
//   },
// };
//   {
//     group: "FONT_FAMILY",
//     exclusive: true,
//     styles: {
//       NOTO: {
//         fontFamily: '"Noto Serif KR"',
//       },
//       NOTO_SANS: {
//         fontFamily: '"Noto Sans KR"',
//       },
//     },
//   },
//   {
//     group: "FONT_SIZE",
//     exclusive: true,
//     styles: {
//       TEN: { fontSize: 13.3 },
//       11: { fontSize: 14.7 },
//       12: { fontSize: 16 },
//       13: { fontSize: 17.3 },
//       14: { fontSize: 18.7 },
//       15: { fontSize: "20px" },
//     },
//   },
//   {
//     group: "COLOR",
//     exclusive: true,
//     styles: {
//       RED: { color: "red" },
//       GREEN: { color: "green" },
//     },
//   },
// ];

// const FontStyle = () => {
//   const fontStlyeObject = {
//     "font-noto": "본명조",
//     "font-serif": "고딕",
//     "font-noto_sans": "본고딕",
//     "font-Nanum_Gothic": "나눔고딕",
//     "font-Song_Myung": "송명체",
//     "font-Nanum_Myeongjo": "나눔명조",
//   };
//   const handleFontStyleButtonClick = (e) => {
//     e.preventDefault();

//   return (
//     <>
//       <div className="relative group cursor-pointer z-40 hover:bg-gray-300 align-bottom">
//         {/* <button>
//           <span class="material-icons align-bottom px-1 text-[18px]">
//             format_size
//           </span>
//         </button> */}
//         <span className={`${getFontStyle(editor)}`}>
//           {fontStlyeObject[getFontStyle(editor)]}
//         </span>
//         <div className="absolute flex flex-col pt-3 invisible group-hover:visible">
//           <button
//             onMouseDown={(e) => {
//               handleFontStyleButtonClick(e);
//             }}
//             className="font-noto bg-white w-20"
//             value="font-noto"
//           >
//             본명조
//           </button>
//           <button
//             onMouseDown={(e) => {
//               handleFontStyleButtonClick(e);
//             }}
//             className="font-serif bg-white w-20"
//             value="font-serif"
//           >
//             고딕
//           </button>
//           <button
//             onMouseDown={(e) => {
//               handleFontStyleButtonClick(e);
//             }}
//             className="font-noto_sans bg-white w-20"
//             value="font-noto_sans"
//           >
//             본고딕
//           </button>
//           <button
//             onMouseDown={(e) => {
//               handleFontStyleButtonClick(e);
//             }}
//             className="font-Nanum_Gothic bg-white w-20"
//             value="font-Nanum_Gothic"
//           >
//             나눔고딕
//           </button>
//           <button
//             onMouseDown={(e) => {
//               handleFontStyleButtonClick(e);
//             }}
//             className="font-Song_Myung bg-white w-20"
//             value="font-Song_Myung"
//           >
//             송명체
//           </button>
//           <button
//             onMouseDown={(e) => {
//               handleFontStyleButtonClick(e);
//             }}
//             className="font-Nanum_Myeongjo bg-white w-20"
//             value="font-Nanum_Myeongjo"
//           >
//             나눔명조
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };
