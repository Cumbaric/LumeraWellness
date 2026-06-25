"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadBlogImage } from "@/app/admin/blog/actions";

const btnBase = "rounded px-2.5 py-1 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed";
const btnIdle = `${btnBase} text-charcoal hover:bg-sand`;
const btnActive = `${btnBase} bg-charcoal text-white font-semibold`;

function TB({ onClick, active, disabled, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      className={active ? btnActive : btnIdle}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="mx-1 h-5 w-px bg-sage/20" aria-hidden="true" />;
}

export default function BlogEditor({ content, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TiptapLink.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Start writing your post…" }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "blog-content min-h-[360px] outline-none px-5 py-4 text-charcoal",
      },
    },
  });

  if (!editor) return null;

  async function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadBlogImage(fd).catch(() => null);
    if (result?.ok) {
      editor.chain().focus().setImage({ src: result.url, alt: file.name }).run();
    }
    setUploading(false);
    e.target.value = "";
  }

  function handleSetLink() {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("URL:", prev);
    if (url === null) return;
    if (!url) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sage/20 bg-white transition focus-within:ring-2 focus-within:ring-sage/20">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-sage/10 bg-cream/60 px-3 py-2">
        <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><strong>B</strong></TB>
        <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><em>I</em></TB>
        <TB onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}><s>S</s></TB>
        <Sep />
        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</TB>
        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</TB>
        <Sep />
        <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• List</TB>
        <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1. List</TB>
        <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>❝</TB>
        <Sep />
        <TB onClick={handleSetLink} active={editor.isActive("link")}>Link</TB>
        <TB onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} active={false}>Unlink</TB>
        <Sep />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={btnIdle}
        >
          {uploading ? "Uploading…" : "📷 Image"}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageFile} />
        <Sep />
        <TB onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} active={false}>↩</TB>
        <TB onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} active={false}>↪</TB>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
