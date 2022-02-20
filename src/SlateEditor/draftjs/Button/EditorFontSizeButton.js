// import { useEffect, useState } from "react";
// import SizeButton from "./SizeButton";
// const EditorFontSizeButton = ({ editorState, setEditorState, styles }) => {
//   const size = {
//     13.3: "10pt",
//     14.7: "11pt",
//     16: "12pt",
//     17.3: "13pt",
//     18.7: "14pt",
//     20: "15pt",
//   };
//   //   const size = {
//   //     10: 13.3,
//   //     11: 14.7,
//   //     12: 16,
//   //     13: 17.3,
//   //     14: 18.7,
//   //     15: 20,
//   //   };
//   const sizeArray = [13.3, 14.7, 16, 17.3, 18.7, 20];
//   const [selected, setSelected] = useState("");
//   useEffect(() => {
//     console.log(editorState.getSelection());
//     let arr = editorState.getCurrentInlineStyle().toArray();
//     let target = "";
//     arr.forEach((el) => {
//       if (el.includes("CUSTOM_FONT_SIZE")) {
//         target = el.split("_")[3];
//         console.log(target);
//         return;
//       }
//     });
//     target && setSelected(target);
//   }, [editorState.getSelection()]);

//   const setFontSize = (e, value) => {
//     //Keep cursor focus inside Editor
//     e.preventDefault();

//     //remove current font size at selection
//     const newEditorState = styles.fontSize.remove(editorState);

//     //set editorState to display new font size
//     setEditorState(styles.fontSize.add(newEditorState, `${value}px`));
//     // setSelected(value);
//   };

//   return (
//     <div className="relative group cursor-pointer z-40 hover:bg-gray-300">
//       <span>{selected ? selected : 12}</span>
//       <div className="absolute flex flex-col pt-3 invisible group-hover:visible">
//         {sizeArray.map((el) => (
//           <button
//             key={el}
//             onClick={(e) => {
//               setFontSize(e, el);
//             }}
//             onMouseDown={(e) => {
//               e.preventDefault();
//             }}
//             className={`text-[${el}px] bg-white w-14`}
//           >
//             {size[el]}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EditorFontSizeButton;
