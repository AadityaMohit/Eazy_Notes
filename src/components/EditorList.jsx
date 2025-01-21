import React from "react";
import { FaFolder, FaClock } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import EditorInstance from "./EditorInstance";

const EditorList = ({
  editors,
  searchQuery,
  setSearchQuery,
  sortOrder,
  toggleSortOrder,
  accordionView,
  setAccordionView,
  togglePinEditor,
  updateEditorContent,
  openFullPageView,
}) => {
  const sortedEditors = [...editors]
    .filter((editor) =>
      editor.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned - a.pinned;
      return sortOrder === "asc"
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp);
    });

  return (
    <div>
      <input
        type="text"
        placeholder="Search editor content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
 
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <div>
          <FaClock
            onClick={toggleSortOrder}
            data-tooltip-id="sort-tooltip"
            data-tooltip-content="Sort by Time"
            style={{
              padding: "10px 15px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
          <Tooltip id="sort-tooltip" />
        </div>

        <div>
          <FaFolder
            onClick={() => setAccordionView((prev) => !prev)}
            data-tooltip-id="accordion-tooltip"
            data-tooltip-content="Toggle Accordion View"
            style={{
              padding: "10px 15px",
              background: "#ff9900",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
          <Tooltip id="accordion-tooltip" />
        </div>
      </div>

      {accordionView ? (
        <div>
          {sortedEditors.map((editorData) => (
            <details
              key={editorData.id}
              style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "10px" }}
            >
              <summary style={{ fontWeight: "bold" }}>
                Editor ID: {editorData.id}
              </summary>
              <EditorInstance
                editorData={editorData}
                togglePin={togglePinEditor}
                openFullPage={openFullPageView}
                updateEditorContent={updateEditorContent}
              />
            </details>
          ))}
        </div>
      ) : (
        <div>
          {sortedEditors.map((editorData) => (
            <EditorInstance
              key={editorData.id}
              editorData={editorData}
              togglePin={togglePinEditor}
              openFullPage={openFullPageView}
              updateEditorContent={updateEditorContent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EditorList;
