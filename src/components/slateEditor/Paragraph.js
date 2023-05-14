import { cx, css } from "@emotion/css";
const Paragraph = (props) => {

  return (
    <p
      tabIndex={-1}
      className="flex items-center group focus:outline-none"
      {...props.attributes}
    >
      <span
        className={cx(
          "pointer-events-none select-none block h-full text-center text-xs w-5 text-gray-300 font-semibold group-focus:text-red-500",
          css`
            -moz-user-modify: read-only;
            -webkit-user-focus: ignore;
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
