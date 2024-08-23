import React, { useEffect, useState, createContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "./Table";
import { Button, Switch } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import "./style.css";

export const ThemeMode = createContext();

export default function App() {
  const [toggle, setToggle] = useState(false);
  const [date, setDate] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [savedInputValue, setSavedInputValue] = useState(() => {
    const savedDataInWeb = localStorage.getItem("savedInputValue");
    return savedDataInWeb ? JSON.parse(savedDataInWeb) : [];
  });

  const [tableData, setTableData] = useState(() => {
    const savedTableData = localStorage.getItem("tableData");
    if (savedTableData) {
      try {
        const parsedTableData = JSON.parse(savedTableData);
        if (parsedTableData.length > 0) {
          return parsedTableData.map((item) => ({
            id: item.id || 1,
            date: item.date || new Date().toDateString(),
            description: item.description || "",
            ravi: item.ravi || "",
            prajwal: item.prajwal || "",
            ashwith: item.ashwith || "",
          }));
        }
      } catch (error) {
        console.error("Failter to parse the data", error);
      }
    }
    return [
      {
        id: 1,
        date: new Date().toDateString(),
        description: "",
        ravi: "",
        prajwal: "",
        ashwith: "",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [tableData]);

  useEffect(() => {
    localStorage.setItem("savedInputValue", JSON.stringify(savedInputValue));
  }, [savedInputValue]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (popUp) {
      const confirmDelete = window.confirm("Are you sure you want to delete?");
      if (confirmDelete) {
        deleteTableRow();
      }
      setPopUp(false);
    }
  }, [popUp]);

  const windowSize = windowWidth < 450;
  const fontSizeResponsivness = { fontSize: windowSize ? "14px" : "16px" };
  const headingResponsivness = {
    fontSize: windowSize ? "20px" : "24px",
    fontWeight: "bold",
  };
  const calendarResponsivness = {
    width: windowSize ? "300px" : "350px",
    lineHeight: windowSize ? "0.5em" : "1.125em",
    color: "black",
    height: "250px",
  };
  const buttonResponsivness = {
    padding: windowSize ? "3px 5px" : "4px 15px",
    fontSize: windowSize ? "12px" : "14px",
    marginTop: "25px",
  };
  const tableResponsivness = { fontSize: windowSize ? "5px" : "16px" };

  function handleInputTableCell(e, id, field) {
    const newTableData = tableData.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: e.target.value };
      }
      return item;
    });
    setTableData(newTableData);
  }

  function addNewTableRow() {
    const lastDate = new Date(tableData[tableData.length - 1].date);
    const newDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);
    const newTableRow = {
      id: tableData.length + 1,
      date: newDate.toDateString(),
      description: "",
      ravi: "",
      prajwal: "",
      ashwith: "",
    };
    setTableData([...tableData, newTableRow]);
  }

  function deleteTableRow() {
    const presentDay = new Date().toDateString();
    const presentData = tableData.filter((item) => item.date === presentDay);
    setTableData(presentData);
  }

  function handlePopUp() {
    setPopUp(true);
  }

  const totalOfRavi = tableData.reduce((total, item) => total + (parseFloat(item.ravi) || 0), 0);
  const totalOfPrajwal = tableData.reduce((total, item) => total + (parseFloat(item.prajwal) || 0), 0);
  const totalOfAshwith = tableData.reduce((total, item) => total + (parseFloat(item.ashwith) || 0), 0);
  const subTotal = totalOfRavi + totalOfPrajwal + totalOfAshwith;
  const divideSubTotal = subTotal / 3;
  const raviAmountPayable = divideSubTotal - totalOfRavi;
  const prajwalAmountPayable = divideSubTotal - totalOfPrajwal;
  const ashwithAmountPayable = divideSubTotal - totalOfAshwith;

  function colorOfNegativeNumber(value) {
    return value < 0 ? { color: "red" } : {};
  }

  function handleSavingInputValue() {
    const newID = { id: uuidv4(), value: inputValue }
    console.log(newID, 'newID')
    setSavedInputValue(copyOfInputValue => [...copyOfInputValue, newID])
    setInputValue('')
  }

  function handleDelete(removeID) {
    setSavedInputValue(savedInputValue.filter((data) => data.id !== removeID));
  }

  console.log("windowWidth", windowWidth);

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
            className="mb-4 btn-sm"
            style={{ ...buttonResponsivness, top: "-10px" }}
            onClick={() => setCalendarVisible(!calendarVisible)}
          >
            {calendarVisible ? "Hide Calendar" : "Show Calendar"}
          </Button>
          {calendarVisible && (
            <div className="mb-3" style={calendarResponsivness}>
              <Calendar onChange={setDate} value={date} />
            </div>
          )}
          <Button
            type="primary"
            className="mb-3 btn-sm mt-5"
            style={buttonResponsivness}
            onClick={addNewTableRow}
          >
            Add new Date
          </Button>
          <p className="mb-4" style={fontSizeResponsivness}>
            Selected Date - <b>{date.toDateString()}</b>
          </p>
          <Table
            tableData={tableData}
            handleInputTableCell={handleInputTableCell}
            toggle={toggle}
            style={tableResponsivness}
          />
          <div className="d-flex flex-column lh-1 text-center mt-3 ml-3">
            <p style={fontSizeResponsivness}>
              Total amount spent by Ravi : <b>{totalOfRavi}</b>
            </p>
            <p style={fontSizeResponsivness}>
              Total amount spent by Prajwal : <b>{totalOfPrajwal}</b>
            </p>
            <p style={fontSizeResponsivness}>
              Total amount spent by Ashwith : <b>{totalOfAshwith}</b>
            </p>
            <p style={fontSizeResponsivness}>
              <span style={{ color: "red" }}>
                Total amount : <b>{subTotal}</b>
              </span>
            </p>
            <p style={fontSizeResponsivness}>
              Divide of Total for each : <b style={colorOfNegativeNumber(divideSubTotal)}>{parseFloat(divideSubTotal.toFixed(1))}</b>
            </p>
            <span style={{ color: "green" }}>
              <p style={fontSizeResponsivness}>
                Amount payable for Ravi : <b style={colorOfNegativeNumber(raviAmountPayable)}>{parseFloat(raviAmountPayable.toFixed(1))}</b>
              </p>
              <p style={fontSizeResponsivness}>
                Amount payable for Prajwal : <b style={colorOfNegativeNumber(prajwalAmountPayable)}>{parseFloat(prajwalAmountPayable.toFixed(1))}
                </b>
              </p>
              <p style={fontSizeResponsivness}>
                Amount payable for Ashwith : <b style={colorOfNegativeNumber(ashwithAmountPayable)}>{parseFloat(ashwithAmountPayable.toFixed(1))}
                </b>
              </p>
            </span>
          </div>
          <Button
            type="primary"
            className="mt-3 mb-3 btn-sm pd-10"
            style={buttonResponsivness}
            onClick={handlePopUp}
          >
            Delete All
          </Button>
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
              style={{
                ...buttonResponsivness,
                fontSize: "13px",
                top: "-1px",
              }}
              onClick={handleSavingInputValue}
            >
              Save
            </Button>
            {savedInputValue.map((data, index) => (
              <p key={index} className="mt-2">
                {data.value}
                <AiFillDelete onClick={() => handleDelete(data.id)} style={{ marginLeft: "10px" }} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </ThemeMode.Provider>
  );
}