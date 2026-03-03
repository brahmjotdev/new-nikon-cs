export const lockScroll = () => {
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  const scrollY = window.scrollY;
  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;
  const originalPosition = document.body.style.position;
  const originalTop = document.body.style.top;
  const originalWidth = document.body.style.width;

  // prevent layout shift
  if (scrollBarWidth > 0) {
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  }

  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";

  return () => {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
    document.body.style.position = originalPosition;
    document.body.style.top = originalTop;
    document.body.style.width = originalWidth;

    window.scrollTo(0, scrollY);
  };
};
