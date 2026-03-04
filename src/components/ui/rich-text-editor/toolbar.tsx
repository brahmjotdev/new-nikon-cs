// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { DivElementProps } from "@/types";
import { Button, ButtonProps } from "../button";

import {
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconTextRecognition,
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconListNumbers,
  IconList,
  IconListCheck,
  IconIndentIncrease,
  IconIndentDecrease,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
  IconCircleFilled,
  IconLineDashed,
  IconBlockquote,
  IconTable,
  IconLink,
  IconPhoto,
  IconClearFormatting,
} from "@tabler/icons-react";

// ==============================
// Props
// ==============================

interface ToolbarProps extends DivElementProps {}

type ToolbarButtons =
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6"
  | "paragraph"
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "ordered-list"
  | "unordered-list"
  | "list-check"
  | "indent"
  | "outdent"
  | "justify-left"
  | "justify-center"
  | "justify-right"
  | "justify-justify"
  | "color"
  | "horizontal-rule"
  | "blockquote"
  | "table"
  | "link"
  | "image"
  | "clear-formatting";

interface ToolbarButtonProps extends ButtonProps {
  buttonType: ToolbarButtons;
  active?: boolean;
  disabled?: boolean;
}

const toolbarButtonIcons = {
  "heading-1": <IconH1 />,
  "heading-2": <IconH2 />,
  "heading-3": <IconH3 />,
  "heading-4": <IconH4 />,
  "heading-5": <IconH5 />,
  "heading-6": <IconH6 />,
  paragraph: <IconTextRecognition />,
  bold: <IconBold />,
  italic: <IconItalic />,
  underline: <IconUnderline />,
  strikethrough: <IconStrikethrough />,
  "ordered-list": <IconListNumbers />,
  "unordered-list": <IconList />,
  "list-check": <IconListCheck />,
  indent: <IconIndentIncrease />,
  outdent: <IconIndentDecrease />,
  "justify-left": <IconAlignLeft />,
  "justify-center": <IconAlignCenter />,
  "justify-right": <IconAlignRight />,
  "justify-justify": <IconAlignJustified />,
  color: <IconCircleFilled />,
  "horizontal-rule": <IconLineDashed />,
  blockquote: <IconBlockquote />,
  table: <IconTable />,
  link: <IconLink />,
  image: <IconPhoto />,
  "clear-formatting": <IconClearFormatting />,
};
// ==============================
// Component
// ==============================

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div data-slot="toolbar-wrapper" className="p-8 sticky top-0 bg-background z-10">
        <div
          ref={ref}
          data-slot="toolbar"
          className={cn("flex items-center justify-between gap-8", className)}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  },
);

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ buttonType, active, disabled, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        data-slot="toolbar-button"
        data-button-type={buttonType}
        data-active={active}
        disabled={disabled}
        variant={active ? "secondary" : "ghost"}
        size="icon-lg"
        className={cn("size-8 rounded-sm",className)}
        {...props}
      >
        {children || toolbarButtonIcons[buttonType]}
      </Button>
    );
  },
);

// ==============================
// Exports
// ==============================

Toolbar.displayName = "Toolbar";
ToolbarButton.displayName = "ToolbarButton";

export { Toolbar, ToolbarButton };
export type { ToolbarProps, ToolbarButtonProps };
