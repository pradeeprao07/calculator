import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { database } from "./firebaseConfig"; 

const WriteDataComponent = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const writeUserData = async(userId, name, email) => {
    console.log(name,email,userId)

    try {
        const newID =  uuidv4()
        await setDoc(doc(database, "notes",newID), { 
          username: userName,
          email: userEmail
        });
        console.log("Document successfully written!");
      } catch (e) {
        console.error("Error writing document: ", e);
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    writeUserData("1", userName, userEmail);  // Using "1" as a sample user ID
  };

  return (
    <div>
      <h1>Write Data to Firebase</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <button type="submit">Save Data</button>
      </form>
    </div>
  );
};

export default WriteDataComponent;
