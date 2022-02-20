import blocks from "./block-list";
import Paragraph from "./paragraph";

const renderElement = ({ element, attributes, children }) => {
  const block = blocks.find((block) => block.type === element.type);

  if (block) {
    return block.renderBlock({ element, attributes, children });
  } else {
    return (
      <Paragraph
        element={element}
        attributes={attributes}
        children={children}
      />
    );
  }
};

export default renderElement;
