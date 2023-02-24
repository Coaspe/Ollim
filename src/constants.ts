import { contestType } from "./type";

export const alertVariants = {
  initial: {
    opacity: 0,
    y: -10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
};
export const divVariants = {
  initial: {
    y: "30%",
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      delay: 0.9,
    },
  },
};
export const pVariants = {
  initial: {
    y: "50%",
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
      delay: 0.3,
    },
  },
};
export const pVariants2 = {
  initial: {
    y: "40%",
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
      delay: 0.6,
    },
  },
};
export const memoVariants = {
  initial: {
    x: "100%",
  },
  animate: {
    x: "0%",
  },
  exit: {
    x: "100%",
  },
};
export const tempSaveDivVariants = {
  initial: {
    y: "100%",
    opacity: "0%",
  },
  animate: {
    y: "0%",
    opacity: "100%",
  },
  exit: {
    opacity: "0%",
  },
};
export const partiVariants = {
  initial: {
    opacity: 0,
    height: 0,
  },
  animate: {
    opacity: 1,
    height: "auto",
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: {
        delay: 0.15,
      },
    },
  },
};
export const expandVariants = {
  open: {
    rotate: 0,
  },
  collapsed: {
    rotate: 180,
  },
};

export const genreMatching = {
  NOVEL: "소설",
  POEM: "시",
  SCENARIO: "시나리오",
};

export const bgColor = {
  1: "rgb(251 207 232)",
  2: "rgb(249 168 212)",
  3: "rgb(244 114 182)",
  4: "rgb(236 72 153)",
  5: "rgb(219 39 119)",
  6: "rgb(190 24 93)",
  7: "rgb(157 23 77)",
  8: "rgb(131 24 67)",
};

export const options: Array<{ value: contestType; label: string }> = [
  { value: "PARTICIPATION", label: "참가" },
  { value: "HOST", label: "개최" },
  { value: "TOTAL", label: "전체" },
];

export const commentsModalVariants = {
  initial: {
    x: "100%",
  },
  animate: {
    x: "0%",
  },
  exit: {
    x: "100%",
  },
};