const ParagraphWithoutNum = (props) => {

  return (
    <p
      tabIndex={-1}
      className="flex items-center group focus:outline-none"
      {...props.attributes}
    >
      {props.children}
    </p>
  );
};

export default ParagraphWithoutNum;
