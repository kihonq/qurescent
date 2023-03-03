import type { Component, JSX } from "solid-js";

import { sukunRegex } from "@helpers/verse";

const Letter: Component<
  Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> & { children: string }
> = (props) => {
  return (
    <span class={props.class}>
      {props.children
        ?.replace(/((?<=َ)ٲ|(?<!َ)ٲ)/g, "ٰ")
        .replace(sukunRegex, "\u064B")}
    </span>
  );
};

export default Letter;
