import React, { useEffect, useState, createContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "./Table";
import { Button, Switch } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { database } from "./firebaseConfig";
import "./style.css";

export const ThemeMode = createContext();
const newID = uuidv4();

export default function App() {
  const [toggle, setToggle] = useState(false);
  const [date, setDate] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [tableData, setTableData] = useState({
    id: newID,
    date: new Date().toDateString(),
    ravichandran: '',
    prajwal: '',
    ashwith: '',
    raviDescription: '',
    prajwalDescription: '',
    ashwithDescription: ''
  });
  const [savedTableData, setSavedTableData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [savedInputValue, setSavedInputValue] = useState([]);

  const saveInputValueInDb = async (inputValue) => {
    try {
      await setDoc(doc(database, "inputValue", newID), {
        value: inputValue
      });
      console.log("Input value is successfully saved!");
    } catch (error) {
      console.error("Failed to save input value", error);
    }
  };

  useEffect(() => {
    const unsubscribeInputValue = onSnapshot(collection(database, "inputValue"), (querySnapshot) => {
      const fetchedInputValue = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        value: doc.data().value,
      }));
      setSavedInputValue(fetchedInputValue);
    });
    return () => { unsubscribeInputValue() };
  }, []);

  const deleteInputValueInDb = async (deleteID) => {
    try {
      await deleteDoc(doc(database, "inputValue", deleteID))
      console.log("Input value has been deleted")
    } catch (error) {
      console.log("Failed to delete the Input value")
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const windowSize = windowWidth < 470;
  const fontSizeResponsivness = { fontSize: windowSize ? "14px" : "16px" };
  const headingResponsivness = {
    fontSize: windowSize ? "20px" : "24px",
    fontWeight: "bold",
  };
  const calendarResponsivness = {
    width: windowSize ? "300px" : "350px",
    lineHeight: windowSize ? "0.5em" : "1.125em",
  };
  const buttonResponsivness = {
    padding: windowSize ? "3px 5px" : "4px 15px",
    fontSize: windowSize ? "12px" : "14px",
    marginTop: "25px",
  };
  const tableResponsivness = { fontSize: windowSize ? "5px" : "16px" };

  const totalOfRavi = savedTableData.reduce((total, item) => total + (parseFloat(item.ravichandran) || 0), 0);
  const totalOfPrajwal = savedTableData.reduce((total, item) => total + (parseFloat(item.prajwal) || 0), 0);
  const totalOfAshwith = savedTableData.reduce((total, item) => total + (parseFloat(item.ashwith) || 0), 0);
  const subTotal = totalOfRavi + totalOfPrajwal + totalOfAshwith;
  const divideSubTotal = subTotal / 3;
  const raviAmountPayable = divideSubTotal - totalOfRavi;
  const prajwalAmountPayable = divideSubTotal - totalOfPrajwal;
  const ashwithAmountPayable = divideSubTotal - totalOfAshwith;

  function colorOfNegativeNumber(value) {
    return value < 0 ? { color: "red" } : {};
  }

  function handleSavingInputValue() {
    const newInputValue = { id: newID, value: inputValue };
    setSavedInputValue(prevValue => [...prevValue, newInputValue]);
    setInputValue('');
    saveInputValueInDb(inputValue);
  }

  return (
    <ThemeMode.Provider value={toggle}>
      <div
        style={
          toggle
            ? { backgroundColor: "#212121", color: "white", minHeight: "100vh" }
            : { backgroundColor: "#e7f1ff", color: "black", minHeight: "100vh" }
        }
      >
        <div className="container-fluid pt-2 ps-2">
          <Switch onClick={() => setToggle(!toggle)} />
        </div>
        <div className="container d-flex flex-column align-items-center justify-content-center">
          <p style={headingResponsivness}>
            <center>Monthly Expense Calculator</center>
          </p>
          <Button
            type="primary"
            className="mb-2 btn-sm"
            style={{ ...buttonResponsivness, top: "-15px" }}
            onClick={() => setCalendarVisible(!calendarVisible)}
          >
            {calendarVisible ? "Hide Calendar" : "Show Calendar"}
          </Button>
          <div className="container d-flex flex-column align-items-center justify-content-center">
            {calendarVisible && (
              <div style={{...calendarResponsivness, marginBottom: '15px' }}>
                <Calendar onChange={setDate} value={date} />
              </div>
            )}
            <p style={fontSizeResponsivness}>
              Today's Date - <b>{date.toDateString()}</b>
            </p>
          </div>
          <Table
            tableData={tableData}
            setTableData={setTableData}
            savedTableData={savedTableData}
            setSavedTableData={setSavedTableData}
            toggle={toggle}
            buttonResponsivness={buttonResponsivness}
            tableResponsivness={tableResponsivness}
            style={tableResponsivness}
          />
          <div className="d-flex flex-column lh-1 text-center mt-3 ml-3">
            <p style={fontSizeResponsivness}>Total amount spent by Ravi : <b>{totalOfRavi}</b></p>
            <p style={fontSizeResponsivness}>Total amount spent by Prajwal : <b>{totalOfPrajwal}</b></p>
            <p style={fontSizeResponsivness}>Total amount spent by Ashwith : <b>{totalOfAshwith}</b></p>
            <p style={fontSizeResponsivness}><span style={{ color: "red" }}>Total amount : <b>{subTotal}</b></span></p>
            <p style={fontSizeResponsivness}>
              Divide of Total for each : <b style={colorOfNegativeNumber(divideSubTotal)}>{parseFloat(divideSubTotal.toFixed(1))}</b>
            </p>
            <span style={{ color: "green" }}>
              <p style={fontSizeResponsivness}>
                Amount payable for Ravi : <b style={colorOfNegativeNumber(raviAmountPayable)}>{parseFloat(raviAmountPayable.toFixed(1))}</b>
              </p>
              <p style={fontSizeResponsivness}>
                Amount payable for Prajwal : <b style={colorOfNegativeNumber(prajwalAmountPayable)}>{parseFloat(prajwalAmountPayable.toFixed(1))}</b>
              </p>
              <p style={fontSizeResponsivness}>
                Amount payable for Ashwith : <b style={colorOfNegativeNumber(ashwithAmountPayable)}>{parseFloat(ashwithAmountPayable.toFixed(1))}</b>
              </p>
            </span>
          </div>
          <div className={toggle ? "text-center border-top border-2 border-white mt-2 mb-3" : "text-center border-top border-2 border-dark mt-2 mb-3"}>
            <input
              style={{ marginRight: "13px" }}
              type="text"
              placeholder="Enter the text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              className="btn-sm pd-10"
              type="primary"
              style={{ ...buttonResponsivness, fontSize: "13px", top: "-1px" }}
              onClick={handleSavingInputValue}
            >
              Save
            </Button>
            {savedInputValue.map((data) => {
              return (
                <div key={data.id} className="mt-2 d-flex align-items-center justify-content-center">
                  <span>{data.value}</span>
                  <AiFillDelete
                    onClick={() => deleteInputValueInDb(data.id)}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ThemeMode.Provider>
  );
}
