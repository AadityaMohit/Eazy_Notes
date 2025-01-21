import React, { useEffect, useState } from "react";
import EditorList from "./EditorList";
import FullPageEditor from "./FullPageEditor";
import db from "./db";  
import LZString from "lz-string";

import CryptoJS from "crypto-js";  
import "./editor.css";
import { FaLock,FaPlus } from "react-icons/fa";
const TiptapEditor = () => {
  const [editors, setEditors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedEditor, setSelectedEditor] = useState(null);
  const [accordionView, setAccordionView] = useState(false);
  const [locked, setLocked] = useState(true);  
  const [enteredKey, setEnteredKey] = useState("");  

  const encryptionKey = "123455";  
  const deleteEditor = async (id) => {
    // Delete editor from DB
    await db.editors.delete(id);

    // Update state
    setEditors(editors.filter((editor) => editor.id !== id));
  };

  const compressAndEncryptContent = (content) => {
    const encrypted = CryptoJS.AES.encrypt(content, encryptionKey).toString();
    return LZString.compressToBase64(encrypted);
  };
  const decompressAndDecryptContent = (compressedContent) => {
    const decompressed = LZString.decompressFromBase64(compressedContent);
    const bytes = CryptoJS.AES.decrypt(decompressed, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  
  useEffect(() => {
    const fetchEditors = async () => {
      const storedEditors = await db.editors.toArray();
      const isUnlocked = localStorage.getItem("isUnlocked") === "true";
  
      const processedEditors = storedEditors.map((editor) => ({
        ...editor,
        content: isUnlocked
          ? decompressAndDecryptContent(editor.content)
          : editor.content,
      }));
  
      setEditors(processedEditors);
      setLocked(!isUnlocked);
    };
  
    fetchEditors();
  }, []);
  

  const encryptContent = (content) => {
    return CryptoJS.AES.encrypt(content, encryptionKey).toString();
  };

  const decryptContent = (encryptedContent) => {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  const [reminderFormVisibility, setReminderFormVisibility] = useState({}); // Manage visibility of reminder forms

  const setReminderForEditor = (id, reminderTime) => {
    const updatedEditors = editors.map((editor) =>
      editor.id === id ? { ...editor, reminderTime: reminderTime } : editor
    );
    setEditors(updatedEditors);

    // Save reminder in DB
    const editorToUpdate = updatedEditors.find((editor) => editor.id === id);
    db.editors.put({ ...editorToUpdate, reminderTime });

    // Calculate time difference for reminder
    const reminderTimeMs = new Date(reminderTime).getTime();
    const currentTime = new Date().getTime();
    const timeToWait = reminderTimeMs - currentTime;

    if (timeToWait > 0) {
      setTimeout(() => {
        alert(`Reminder: Time's up for note ${id}!`);
      }, timeToWait);
    } else {
      alert("The reminder time has already passed!");
    }
  };

  const toggleReminderForm = (id) => {
    setReminderFormVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };;

  const addEditor = async () => {
    const newEditor = {
      id: editors.length + 1,
      content: compressAndEncryptContent("Start Typing"),
      timestamp: new Date(),
      pinned: false,
      reminderTime: null,
    };
  
    await db.editors.add(newEditor);
  
    const storedEditors = await db.editors.toArray();
    const decryptedEditors = storedEditors.map((editor) => ({
      ...editor,
      content: decompressAndDecryptContent(editor.content),
    }));
  
    setEditors(decryptedEditors);
  };
  

  const togglePinEditor = async (id) => {
    const updatedEditors = editors.map((editor) =>
      editor.id === id ? { ...editor, pinned: !editor.pinned } : editor
    );

    setEditors(updatedEditors);

    const editorToUpdate = updatedEditors.find((editor) => editor.id === id);
    await db.editors.put({ ...editorToUpdate, content: encryptContent(editorToUpdate.content) });
  };

  const updateEditorContent = async (id, newContent) => {
    const compressedEncryptedContent = compressAndEncryptContent(newContent);
    const updatedEditors = editors.map((editor) =>
      editor.id === id ? { ...editor, content: newContent } : editor
    );
  
    setEditors(updatedEditors);
  
    const editorToUpdate = updatedEditors.find((editor) => editor.id === id);
    await db.editors.put({ ...editorToUpdate, content: compressedEncryptedContent });
  };
  

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleLock = () => {
    const encryptedEditors = editors.map((editor) => ({
      ...editor,
      content: encryptContent(editor.content),
    }));

    setEditors(encryptedEditors);
    setLocked(true);
    localStorage.removeItem("isUnlocked");
    setEnteredKey("");
  };

  const openFullPageView = (editorData) => {
    setSelectedEditor(editorData);
  };

  const closeFullPageView = () => {
    setSelectedEditor(null);
  };

  const handleKeySubmit = () => {
    if (enteredKey === encryptionKey) {
      localStorage.setItem("isUnlocked", "true");

      const decryptedEditors = editors.map((editor) => ({
        ...editor,
        content: decryptContent(editor.content),
      }));

      setEditors(decryptedEditors);
      setLocked(false);
    } else {
      alert("Incorrect key! Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <div className="logo">
        <span className="logo-text">n</span>
      </div>

      {locked && (
        <div className="lock-screen">
          <h2>Enter Secret Key to Unlock Content</h2>
          <input
            type="password"
            value={enteredKey}
            onChange={(e) => setEnteredKey(e.target.value)}
            placeholder="Enter secret key"
          />
          <button onClick={handleKeySubmit}>Submit</button>
        </div>
      )}

      {!locked && (
        
        <>
          <EditorList editors={editors} searchQuery={searchQuery} setSearchQuery={setSearchQuery} sortOrder={sortOrder} toggleSortOrder={toggleSortOrder} accordionView={accordionView} setAccordionView={setAccordionView} togglePinEditor={togglePinEditor} updateEditorContent={updateEditorContent} openFullPageView={openFullPageView}
          />

<FaLock
  onClick={handleLock}
  className="lock-icon"
/>

<FaPlus className="PLUS" onClick={addEditor}> +</FaPlus>
          {selectedEditor && (
             <FullPageEditor
             editorData={selectedEditor}
             deleteEditor={deleteEditor}
             closeFullPageView={closeFullPageView}
             updateEditorContent={(newContent) =>
               updateEditorContent(selectedEditor.id, newContent)
             }
           />
         )}
{/* Reminder part */}
         {editors.map((editor) => (
           <div key={editor.id} style={{ margin: "10px 0" }}>
             <button onClick={() => toggleReminderForm(editor.id)}>
               {reminderFormVisibility[editor.id] ? `Hide Reminder for notes ${editor.id}` : `Set Reminder for notes ${editor.id}`}
             </button>
             {reminderFormVisibility[editor.id] && (
               <div>
                 <h4>{`Set Reminder for Note ${editor.id}`}</h4>
                 <input
                   type="datetime-local"
                   onChange={(e) => setReminderForEditor(editor.id, e.target.value)}
                   defaultValue={editor.reminderTime || ""}
                 />
               </div>
             )}
           </div>
         ))}
       </>
     )}
   </div>
 );
};

export default TiptapEditor;