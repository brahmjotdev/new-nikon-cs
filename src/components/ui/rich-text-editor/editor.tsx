// ==============================
// Imports
// ==============================

"use client";

import * as React from "react";
import { cn } from "@/utils";

import { DivElementProps } from "@/types";

import { EditorContent as TiptapEditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { ListKit } from "@tiptap/extension-list";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";

import { useAutoSave } from "./auto-save";
import type { Status } from "./auto-save";

// ==============================
// Props & types
// ==============================

export type EditorJSON = Record<string, unknown>;

export const EMPTY_EDITOR_JSON: EditorJSON = {
  type: "doc",
  content: [],
};

const EmptyEditorJSON: EditorJSON = EMPTY_EDITOR_JSON;

export interface UseEditorContentOptions<T = EditorJSON> {
  content: T | undefined | null; // content from DB (undefined while loading, null when no doc yet)
  isLoading: boolean; // true while the content query/request is in flight
  save: (content: T) => Promise<void>; // persist content (e.g. Convex mutation)
  emptyContent?: T; // default EMPTY_EDITOR_JSON
  debounceMs?: number; // default 300
  savedResetMs?: number; // default 2000
}

export interface UseEditorContentReturn<T = EditorJSON> {
  initialContent: T; // use as initialContent for EditorContent; becomes saved content on next load
  status: Status; // for AutoSave and loading UI
  onChange: (content: T) => void; // pass to EditorContent onChange
  setStatus: React.Dispatch<React.SetStateAction<Status>>; // override status (e.g. set "loading" when content is loading)
}

function useEditorContent<T = EditorJSON>(
  options: UseEditorContentOptions<T>,
): UseEditorContentReturn<T> {
  const {
    content,
    isLoading,
    save,
    emptyContent = EMPTY_EDITOR_JSON as T,
    debounceMs = 300,
    savedResetMs = 2000,
  } = options;

  const { status, setStatus, scheduleSave } = useAutoSave<T>({
    save,
    debounceMs,
    savedResetMs,
  });

  React.useEffect(() => {
    if (isLoading) {
      setStatus("loading");
      return;
    }
    setStatus((prev) => (prev === "loading" ? "idle" : prev));
  }, [isLoading, setStatus]);

  const initialContent =
    content === undefined || content === null ? emptyContent : content;

  return {
    initialContent,
    status,
    onChange: scheduleSave,
    setStatus,
  };
}

interface EditorProps extends DivElementProps {}
interface EditorContentProps extends Omit<DivElementProps, "onChange"> {
  isEditable?: boolean;
  initialContent?: EditorJSON;
  onChange?: (json: EditorJSON) => void;
}

// ==============================
// Component
// ==============================

const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="editor"
        className={cn("flex flex-col relative w-full flex-1 min-h-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const EditorContent = React.forwardRef<HTMLDivElement, EditorContentProps>(
  (
    {
      isEditable = true,
      initialContent = EmptyEditorJSON,
      onChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const editor = useEditor({
      editorProps: {
        attributes: {
          class: cn("rich-text-editor", className),
        },
      },
      extensions: [
        StarterKit,
        ListKit,
        TextStyleKit,
        Typography,
        Link.configure({
          openOnClick: false,
        }),
      ],
      content: initialContent,
      editable: isEditable,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getJSON() as EditorJSON);
      },
    });
    return (
      <TiptapEditorContent
        ref={ref}
        editor={editor}
        data-slot="editor-content"
        data-state={isEditable ? "editable" : "readonly"}
        className={cn(className)}
        {...props}
      />
    );
  },
);

// ==============================
// Exports
// ==============================

Editor.displayName = "Editor";
EditorContent.displayName = "EditorContent";

export { Editor, EditorContent, useEditorContent };
export type { EditorProps, EditorContentProps };
