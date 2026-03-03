// ==============================
// Imports
// ==============================

"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/db/use-auth";
import {
  Toolbar,
  Editor,
  EditorContent,
  AutoSave,
  useEditorContent,
} from "../ui/rich-text-editor";
import { Skeleton } from "../ui/skeleton";

// ==============================
// Component
// ==============================

const NotesBlock = () => {
  const { isLoadingUser } = useAuth();
  const note = useQuery(
    api.functions.notes.getNote,
    isLoadingUser ? "skip" : {},
  );
  const saveNoteMutation = useMutation(api.functions.notes.saveNote);

  const { initialContent, status, onChange } = useEditorContent({
    content: note === undefined ? undefined : (note?.content ?? null),
    isLoading: isLoadingUser || note === undefined,
    save: async (content) => {
      await saveNoteMutation({ content });
    },
    debounceMs: 300,
    savedResetMs: 2000,
  });

  if (status === "loading") {
    return (
      <Editor>
        <Toolbar>
          <div />
          <AutoSave status="loading" />
        </Toolbar>
        <div className="px-8 py-6 *:h-3 *:max-w-2xl *:mx-auto *:rounded-sm *:mb-3">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </Editor>
    );
  }

  return (
    <Editor>
      <Toolbar>
        <div />
        <AutoSave status={status} />
      </Toolbar>
      <EditorContent initialContent={initialContent} onChange={onChange} />
    </Editor>
  );
};

export { NotesBlock };
