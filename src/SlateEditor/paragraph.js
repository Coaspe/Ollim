import { cx, css } from "@emotion/css";

const Paragraph = (props) => {
  return (
    <div className="relative">
      <span
        className={cx(
          "absolute -left-5",
          css`
            -moz-user-modify: read-only;
            -webkit-user-modify: read-only;
          `
        )}
      >
        {props.lineNum + 1}
      </span>
      <p className="ml-2" {...props.attributes}>
        {props.children}
      </p>
    </div>
  );
};

export default Paragraph;
