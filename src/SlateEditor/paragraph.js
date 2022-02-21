import { cx, css } from "@emotion/css";

const Paragraph = (props) => {
  return (
    <p
      tabIndex={-1}
      className="relative flex items-center group focus:outline-none"
      {...props.attributes}
    >
      <span
        className={cx(
          "select-none inline-block w-5 h-full text-right text-xs mr-5 text-blue-300 group-focus:text-red-500",
          css`
            -moz-user-modify: read-only;
            -webkit-user-focus: normal;
            -webkit-user-modify: read-only;
          `
        )}
      >
        {props.lineNum + 1}
      </span>
      {props.children}
    </p>
  );
};

export default Paragraph;
