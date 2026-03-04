"use client";

import * as React from "react";
import { cn } from "@/utils";
import { DivElementProps } from "@/types";
import { DOMSerializer } from "@tiptap/pm/model";
import { EditorContent as TiptapEditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { ListKit } from "@tiptap/extension-list";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";

import { useAutoSave } from "./auto-save";
import type { Status } from "./auto-save";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type EditorJSON = Record<string, unknown>;

export const EMPTY_EDITOR_JSON: EditorJSON = {
  type: "doc",
  content: [],
};

export interface UseEditorContentOptions<T = EditorJSON> {
  content: T | undefined | null;
  isLoading: boolean;
  save: (content: T) => Promise<void>;
  emptyContent?: T;
  debounceMs?: number;
  savedResetMs?: number;
}

export interface UseEditorContentReturn<T = EditorJSON> {
  initialContent: T;
  status: Status;
  onChange: (content: T) => void;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
}

export interface EditorProps extends DivElementProps {}

export interface EditorContentProps extends Omit<DivElementProps, "onChange"> {
  isEditable?: boolean;
  initialContent?: EditorJSON;
  onChange?: (json: EditorJSON) => void;
}

// -----------------------------------------------------------------------------
// useEditorContent
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Copy HTML transform
// -----------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isParagraphEmpty(p: HTMLParagraphElement): boolean {
  const text = p.textContent?.trim() ?? "";
  if (text.length > 0) return false;
  const br = p.querySelector("br");
  return p.childNodes.length <= 1 && (p.childNodes.length === 0 || br != null);
}

function getParagraphText(p: HTMLParagraphElement): string {
  return p.textContent?.trim() ?? "";
}

function processListItem(li: HTMLElement): string {
  const firstChild = li.firstElementChild;
  if (firstChild?.tagName === "P" && li.childElementCount === 1) {
    return `<li>${escapeHtml(getParagraphText(firstChild as HTMLParagraphElement))}</li>`;
  }
  const parts: string[] = [];
  for (const el of Array.from(li.children)) {
    if (el.tagName === "P") {
      parts.push(escapeHtml(getParagraphText(el as HTMLParagraphElement)));
    } else if (
      el instanceof HTMLOListElement ||
      el instanceof HTMLUListElement
    ) {
      parts.push(processList(el));
    }
  }
  if (parts.length) return `<li>${parts.join("")}</li>`;
  return `<li>${escapeHtml(li.textContent ?? "")}</li>`;
}

function processList(list: HTMLOListElement | HTMLUListElement): string {
  const tag = list.tagName.toLowerCase();
  const items = Array.from(list.querySelectorAll(":scope > li"))
    .map((li) => processListItem(li as HTMLElement))
    .join("");
  return `<${tag}>${items}</${tag}>`;
}

/**
 * Strips inline styles, classes, and common data attributes from pasted HTML
 * so the content takes on the editor’s styles (e.g. paste from Google Docs).
 * Preserves structure (paragraphs, bold, lists, links).
 */
export function stripPastedHtmlStyles(html: string): string {
  if (typeof document === "undefined") return html;
  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  wrap.querySelectorAll("*").forEach((el) => {
    el.removeAttribute("style");
    el.removeAttribute("class");
    el.removeAttribute("id");
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith("data-")) el.removeAttribute(attr.name);
    }
  });
  // Replace &nbsp; with normal space so spacing follows editor
  const textNodes = document.createTreeWalker(
    wrap,
    NodeFilter.SHOW_TEXT,
    null,
  );
  const nodesToReplace: { node: Text; value: string }[] = [];
  let n: Text | null;
  while ((n = textNodes.nextNode() as Text | null)) {
    if (n?.textContent?.includes("\u00A0")) {
      nodesToReplace.push({
        node: n,
        value: n.textContent.replace(/\u00A0/g, " "),
      });
    }
  }
  for (const { node, value } of nodesToReplace) {
    node.textContent = value;
  }
  return wrap.innerHTML;
}

/** Converts editor clipboard HTML to copy format: paragraphs as text + <br/>, lists without inner <p>. */
export function editorHtmlToCopyHtml(html: string): string {
  if (typeof document === "undefined") return html;
  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  const parts: string[] = [];
  for (const node of Array.from(wrap.childNodes)) {
    if (node instanceof HTMLParagraphElement) {
      if (isParagraphEmpty(node)) {
        parts.push("<br/>");
      } else {
        parts.push(escapeHtml(getParagraphText(node)), "<br/>");
      }
    } else if (
      node instanceof HTMLOListElement ||
      node instanceof HTMLUListElement
    ) {
      parts.push(processList(node));
    } else if (node instanceof HTMLElement) {
      parts.push(node.outerHTML);
    } else if (node instanceof Text) {
      const t = node.textContent?.trim();
      if (t) parts.push(escapeHtml(t), "<br/>");
    }
  }
  let out = parts.join("");
  if (out.endsWith("<br/>")) out = out.slice(0, -5);
  return out;
}

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="editor"
      className={cn("flex flex-col relative w-full flex-1 min-h-0", className)}
      {...props}
    >
      {children}
    </div>
  ),
);

const EditorContent = React.forwardRef<HTMLDivElement, EditorContentProps>(
  (
    {
      isEditable = true,
      initialContent = EMPTY_EDITOR_JSON,
      onChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const editor = useEditor({
      editorProps: {
        attributes: { class: cn("rich-text-editor", className) },
        transformPastedHTML(html) {
          return stripPastedHtmlStyles(html);
        },
        handleDOMEvents: {
          copy: (view, event) => {
            const slice = view.state.selection.content();
            if (slice.size === 0) return false;
            event.preventDefault();
            const serializer = DOMSerializer.fromSchema(view.state.schema);
            const fragment = serializer.serializeFragment(slice.content, {
              document: typeof document !== "undefined" ? document : undefined,
            });
            const div = document.createElement("div");
            div.appendChild(fragment);
            const transformedHtml = editorHtmlToCopyHtml(div.innerHTML);
            const plainText = slice.content.textBetween(
              0,
              slice.content.size,
              "\n",
            );
            event.clipboardData?.setData("text/html", transformedHtml);
            event.clipboardData?.setData("text/plain", plainText);
            return true;
          },
        },
      },
      extensions: [
        StarterKit,
        ListKit,
        TextStyleKit,
        Typography,
        Link.configure({ openOnClick: false }),
      ],
      coreExtensionOptions: {
        clipboardTextSerializer: { blockSeparator: "\n" },
      },
      content: initialContent,
      editable: isEditable,
      immediatelyRender: false,
      onUpdate: ({ editor }) => onChange?.(editor.getJSON() as EditorJSON),
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

Editor.displayName = "Editor";
EditorContent.displayName = "EditorContent";

export { Editor, EditorContent, useEditorContent };
