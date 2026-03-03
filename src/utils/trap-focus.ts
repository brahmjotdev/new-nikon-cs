type TrapFocusOptions = {
  autoFocus?: boolean;
  restoreFocus?: boolean;
};

export const trapFocus = (
  container: HTMLElement,
  options: TrapFocusOptions = {},
) => {
  const { autoFocus = true, restoreFocus = true } = options;

  if (!container) return () => {};

  const previouslyFocused = document.activeElement as HTMLElement | null;

  const getFocusableElements = () =>
    Array.from(
      container.querySelectorAll<HTMLElement>(
        [
          "a[href]",
          "button:not([disabled])",
          "textarea:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          '[tabindex]:not([tabindex="-1"])',
        ].join(","),
      ),
    ).filter(
      (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
    );

  const focusable = getFocusableElements();
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    const focusableEls = getFocusableElements();
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (!firstEl || !lastEl) {
      e.preventDefault();
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  container.addEventListener("keydown", handleKeyDown);

  // autofocus first element
  if (autoFocus && first) {
    first.focus();
  }

  // cleanup
  return () => {
    container.removeEventListener("keydown", handleKeyDown);

    if (restoreFocus && previouslyFocused) {
      previouslyFocused.focus();
    }
  };
}
