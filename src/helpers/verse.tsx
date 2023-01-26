import type { JSX } from "solid-js";

export const wordsSplitter = (
  sentence: (JSX.Element | JSX.Element[])[],
  acc: JSX.Element[][] = []
) => {
  let isContinue = true;

  [...sentence].forEach((el) => {
    if (typeof el === "string") {
      const [firstChunk, ...chunks] = el.split(" ");
      if (firstChunk) {
        if (acc[acc.length - 1]?.length && isContinue) {
          acc[acc.length - 1].push(firstChunk);
        } else {
          acc.push([firstChunk]);
        }
      }

      const isUntrimmed = chunks.length && !chunks[chunks.length - 1];

      (isUntrimmed ? chunks.slice(0, -1) : chunks).forEach((word) =>
        acc.push([word])
      );

      isContinue = !isUntrimmed;
    } else if (Array.isArray(el)) {
      wordsSplitter(el, acc);
    } else {
      if (acc[acc.length - 1]?.length && isContinue) {
        acc[acc.length - 1].push(el);
      } else {
        acc.push([el]);
      }
      isContinue = true;
    }
  });

  return acc;
};
