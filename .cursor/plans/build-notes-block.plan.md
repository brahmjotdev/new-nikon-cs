---
name: ""
overview: ""
todos: []
isProject: false
---

# Build notes block (refined)

## Requirements (summary)

- Every user has one note (content). Get note for the **logged-in** user.
- Convex: `convex/functions/notes.ts` — get note for logged-in user, create note, update note.
- Auto-save: use **onChange**; do **not** save while typing. When user **stops typing**, save after **300ms** debounce. Show status: saving / saved / etc.
- After save, the saved content is the **initial content** next time the note is loaded.
- Add **index** on notes table to get note by `userId`.
- **No toolbar** for now — only make the editor work.
- **UI**: The element with class `rich-text-editor` must be **full width** and **scrollable** when content overflows; no wrapping divs should cause overflow (overflow on the editor element itself).

---

## 1. Schema

**File:** [convex/schema.ts](convex/schema.ts)

- Add index to `notes` table: `by_userId` on `["userId"]` so we can query one note per user.

---

## 2. Convex notes API

**File:** `convex/functions/notes.ts` (new)

- **getNote** (query): no args; use `requireUser` from `./auth` to get current user; query `notes` with `by_userId`; return `null` or `{ _id, content, updatedAt }` (or minimal shape needed by the client). Use Convex `query` from `_generated/server` and validators per project rules.
- **createNote** (mutation): args `{ content: v.any() }`; require user; insert one `notes` doc for that user with `userId`, `content`, `updatedAt: Date.now()`; return `v.null()` or the new id if useful.
- **updateNote** (mutation): args `{ content: v.any() }` (or `noteId` if you prefer); require user; find note by `userId`; if exists `patch` with `content` and `updatedAt`; if not, optionally call create logic or insert. Return `v.null()`.

Design choice: you can either have getNote return the doc and have updateNote “upsert” (create if missing, else update) so the client only calls getNote + saveNote (one mutation that upserts). Per your request we have explicit create and update; the client can call create when getNote returns null and update when it exists, or we can have a single “saveNote” that upserts and keep create/update as internal or simple wrappers. Plan: implement **getNote**, **createNote**, **updateNote**; client will use getNote and then a single **saveNote** mutation that upserts (so one mutation from the UI: saveNote that does create-or-update). That matches “after the note is saved the saved note becomes initial content” without the client having to branch on create vs update.

---

## 3. Notes block (editor only, no toolbar)

**File:** [src/components/blocks/notes.tsx](src/components/blocks/notes.tsx)

- Remove or don’t render the toolbar; only render the editor (e.g. `Editor` + `EditorContent`).
- Use `useAuth()` for `currentUser` / loading; use `useQuery(api.functions.notes.getNote, ...)` (skip when not logged in). Initial content: from getNote result or default `{ type: "doc", content: [] }`.
- **onChange**: update local state and trigger a **300ms debounced** save. On debounced fire: set status to `"saving"`, call save mutation (upsert: create if no note, else update), then set `"saved"` then back to `"idle"` after a short delay; on error set `"error"`.
- Pass **initialContent** from the loaded note (or empty doc) into `EditorContent`; after save, next load will use the same content via getNote (no extra “sync” step).
- Render **AutoSave** with the current status (idle / saving / saved / error; and loading while getNote is loading).

---

## 4. Rich-text-editor full width and scrollable

- `**.rich-text-editor`** (the element that has this class is the one inside Tiptap’s EditorContent, set in [editor.tsx](src/components/ui/rich-text-editor/editor.tsx) via `attributes.class`).
- Ensure this element is **full width** and **scrollable** when content overflows, and that **no wrapping div** hides overflow. So:
  - In [src/styles/globals.css](src/styles/globals.css): adjust `.rich-text-editor` to be full width (e.g. `w-full` or `width: 100%`), and keep overflow on this element (e.g. `overflow-y-auto` or `overflow-y-scroll`). Remove or relax any `max-w-2xl` / centering on the editor container that would constrain width; if you want max-width for readability, apply it only to the inner content (e.g. the first child) while the scrollable area stays full width.
- In [editor.tsx](src/components/ui/rich-text-editor/editor.tsx): the wrapper (e.g. `Editor` div or the div that wraps `TiptapEditorContent`) should not restrict overflow; the `.rich-text-editor` node (ProseMirror container) should be the one that scrolls. So the outer structure should be something like: a full-width container that has `min-height` and `overflow-auto` (or the scroll is on the inner `.rich-text-editor`). Current globals have `.rich-text-editor { overflow-y-scroll; }` and inner `& > * { max-w-2xl mx-auto }`. So the scroll is already on `.rich-text-editor`. Ensure the parent of `.rich-text-editor` (the wrapper in the notes page or in Editor/EditorContent) doesn’t have a fixed height that would cause double scrollbars; ideally the notes block has a single full-width scrollable area (the `.rich-text-editor`), full width, and content inside can be constrained (e.g. max-w-2xl) for line length. So: keep full width and scrollable on `.rich-text-editor`; ensure no wrapping div has `overflow: hidden` or a height that prevents the editor from being the scroll container.

---

## 5. Implementation order

1. Add `by_userId` index to `notes` in [convex/schema.ts](convex/schema.ts).
2. Create [convex/functions/notes.ts](convex/functions/notes.ts) with getNote (query), createNote (mutation), updateNote (mutation); add a single saveNote (mutation) that upserts using the two, or have the client call create vs update based on getNote — prefer one saveNote upsert for simplicity.
3. In [src/components/blocks/notes.tsx](src/components/blocks/notes.tsx): editor only (no toolbar), wire getNote → initialContent, onChange → 300ms debounce → saveNote, AutoSave status.
4. In [src/styles/globals.css](src/styles/globals.css) (and if needed [editor.tsx](src/components/ui/rich-text-editor/editor.tsx)): ensure `.rich-text-editor` is full width and the only scroll container; no wrapping div overflow issues.

---

## Todos

- Add `by_userId` index to notes table in convex/schema.ts
- Create convex/functions/notes.ts (getNote, createNote, updateNote; and saveNote upsert for client)
- Notes block: editor only, getNote → initialContent, 300ms debounced save, AutoSave status
- .rich-text-editor full width and scrollable; no wrapping div overflow

