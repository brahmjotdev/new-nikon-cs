import * as React from "react";

export const mergeRefs = <T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> => {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") ref(node);
      else (ref as React.RefObject<T | null>).current = node;
    });
  };
};
