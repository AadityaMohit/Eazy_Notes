import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

const EditorInstance = ({ editorData, togglePin, openFullPage, updateEditorContent }) => {
  const { id, content, timestamp, pinned } = editorData;

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      updateEditorContent(id, editor.getHTML());
    },
  });

  return (
    <div
      style={{
        marginBottom: "20px",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        background: pinned ? "#fffbea" : "#fff",
        cursor: "pointer",
      }}
      onClick={() => openFullPage(editorData)}
    >
      <h3>
   
        <FontAwesomeIcon 
  icon={faThumbtack} // Use FontAwesome pin icon
  onClick={(e) => {
    e.stopPropagation(); // Prevent triggering full-page view
    togglePin(id); // Function to handle pinning logic
  }}
  style={{
    marginLeft: "10px",
    padding: "5px 10px",
    background: pinned ? "#ffc107" : "#6c757d", // Yellow for pinned, gray for unpinned
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }}
  title={pinned ? "Unpin" : "Pin"} // Tooltip text
/>
      </h3>
      <p style={{ fontSize: "12px", color: "#666" }}>
        Created on: {new Date(timestamp).toLocaleString()}
      </p>
      <EditorContent editor={editor} />
    </div>
  );
};

export default EditorInstance;
