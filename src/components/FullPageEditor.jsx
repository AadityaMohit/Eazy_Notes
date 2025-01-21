import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaLink, FaListUl, FaListOl, FaUnlink, FaTrashAlt } from "react-icons/fa";
import "./Fullpageeditor.css";

const FullPageEditor = ({ editorData, closeFullPageView, updateEditorContent, deleteEditor }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: true }),
      ListItem,
      BulletList,
      OrderedList,
    ],
    content: editorData.content,
    onUpdate: ({ editor }) => {
      updateEditorContent(editor.getHTML());
    },
  });

  const addLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleDeleteEditor = () => {
    if (window.confirm("Are you sure you want to delete this editor?")) {
      deleteEditor(editorData.id); // Call the deleteEditor function passed as prop
      closeFullPageView(); // Close the editor view after deletion
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#fff",
        zIndex: 1000,
        overflow: "auto",
        padding: "20px",
      }}
    >
      {/* Close Button */}
      <button
        onClick={closeFullPageView}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>

      <h1>Editor {editorData.id}</h1>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Created on: {new Date(editorData.timestamp).toLocaleString()}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        {/* Formatting Buttons */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} style={getButtonStyle(editor.isActive("bold"))}>
          <FaBold />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} style={getButtonStyle(editor.isActive("italic"))}>
          <FaItalic />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} style={getButtonStyle(editor.isActive("underline"))}>
          <FaUnderline />
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} style={getButtonStyle(editor.isActive("strike"))}>
          <FaStrikethrough />
        </button>
        {/* Text Alignment */}
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} style={getButtonStyle(editor.isActive({ textAlign: "left" }))}>
          <FaAlignLeft />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} style={getButtonStyle(editor.isActive({ textAlign: "center" }))}>
          <FaAlignCenter />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} style={getButtonStyle(editor.isActive({ textAlign: "right" }))}>
          <FaAlignRight />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("justify").run()} style={getButtonStyle(editor.isActive({ textAlign: "justify" }))}>
          <FaAlignJustify />
        </button>

        {/* Link Buttons */}
        <button onClick={addLink} style={getButtonStyle(editor.isActive("link"))}>
          <FaLink />
        </button>
        <button onClick={() => editor.chain().focus().unsetLink().run()} style={getButtonStyle(editor.isActive("link"))}>
          <FaUnlink />
        </button>

        {/* List Buttons */}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} style={getButtonStyle(editor.isActive("bulletList"))}>
          <FaListUl />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} style={getButtonStyle(editor.isActive("orderedList"))}>
          <FaListOl />
        </button>

        {/* DELETE Editor Button */}
        <button onClick={handleDeleteEditor} style={{ ...getButtonStyle(false), background: "#dc3545" }}>
          <FaTrashAlt />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

const getButtonStyle = (isActive) => ({
  padding: "5px 10px",
  background: isActive ? "#007bff" : "#f1f1f1",
  color: isActive ? "#fff" : "#000",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
});

export default FullPageEditor;
