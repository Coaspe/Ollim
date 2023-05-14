import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { cx, css } from "@emotion/css";
import { motion } from "framer-motion";
export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? "white"
              : "#aaa"
            : active
              ? "black"
              : "#ccc"};
        `
      )}
    />
  )
);

export const EditorValue = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const textLines = value.document.nodes
      .map((node) => node.text)
      .toArray()
      .join("\n");
    return (
      <div
        ref={ref}
        {...props}
        className={cx(
          className,
          css`
            margin: 30px -20px 0;
          `
        )}
      >
        <div
          className={css`
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          `}
        >
          Slate's value as text
        </div>
        <div
          className={css`
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          `}
        >
          {textLines}
        </div>
      </div>
    );
  }
);

export const Icon = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      {...props}
      ref={ref}
      className={cx(
        "material-icons",
        className,
        "hover:text-slate-400",
        css`
          font-size: 18px;
          vertical-align: middle;
        `
      )}
    />
  );
});

export const Instruction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        white-space: pre-wrap;
        margin: 0 -20px 10px;
        padding: 10px 20px;
        font-size: 14px;
        background: #f8f8e8;
      `
    )}
  />
));

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      `drop-shadow-md border-t border-black border-opacity-5 justify-start flex items-center sticky space-x-3.5 > * + *`,
      css`
        border-radius: 10px;
        margin-bottom: 10px;
        & > * {
          display: inline-block;
        }
      `
    )}
  />
));

export const FullScreenMenu = React.forwardRef(
  ({ className, ...props }, ref) => {
    const [windowSize, setWindowSize] = useState([0, 0]);

    useEffect(() => {
      setWindowSize([window.innerHeight, window.innerWidth]);
    }, []);

    return (
      <motion.div
        drag
        dragConstraints={{
          left: 16,
          top: 16,
          right: windowSize[1] ? windowSize[1] - 304 : 0,
          bottom: windowSize[0] ? windowSize[0] - 16 : 0,
        }}
        {...props}
        ref={ref}
        className={cx(
          className,
          `drop-shadow-md border-t border-black border-opacity-5 justify-start items-center absolute grid grid-cols-3 place-items-center gap-2`,
          css`
            border-radius: 10px;
            margin-bottom: 10px;
            & > * {
              display: inline-block;
            }
          `
        )}
      />
    );
  }
);
export const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export const Toolbar = React.forwardRef(
  ({ className, isFullScreen, ...props }, ref) => {
    if (isFullScreen) {
      return (
        <FullScreenMenu
          {...props}
          ref={ref}
          style={{
            backgroundColor: "#FAF6F5",
            padding: "10px 0px",
            zIndex: 1000,
          }}
          className={cx(className, "w-72 top-4 left-4")}
        />
      );
    } else {
      return (
        <Menu
          {...props}
          ref={ref}
          style={{
            backgroundColor: "#FAF6F5",
            padding: "12px 18px",
            zIndex: 1000,
          }}
          className={cx(className, `w-noneFullScreenMenu top-0`)}
        />
      );
    }
  }
);
