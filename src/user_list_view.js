import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "./firebaseConfig";

const NotesList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Real-time listener
    const unsubscribe = onSnapshot(collection(database, "notes"), (querySnapshot) => {
      const notesArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(notesArray)
      setNotes(notesArray);
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.email}: {note.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotesList;
