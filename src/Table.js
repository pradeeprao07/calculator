import React, { useEffect, useState } from "react";
import { Table as BootstrapTable, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { database } from "./firebaseConfig";
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { Button, Modal } from "antd";
import { v4 as uuidv4 } from 'uuid';
import { AiFillDelete } from "react-icons/ai";

const newID = uuidv4();

export default function Table({ toggle, buttonResponsivness, tableResponsivness, tableData, setTableData, savedTableData, setSavedTableData }) {
    const windowSize = window.innerWidth;
    const fontSizeStyle = { fontSize: windowSize < 470 ? "14px" : "16px" };
    const [popUp, setPopUp] = useState(false);
    const popUpWidth = windowSize < 470 ? 350 : 400;

    const saveTableDataInDb = async (tableData, date) => {
        try {
            const documentRef = doc(database, "tableData", date);
            await setDoc(documentRef, tableData);
            console.log("Table data successfully saved/updated!");
        } catch (error) {
            console.error("Failed to save table data", error);
        }
    };

    useEffect(() => {
        const unsubscribeTableData = onSnapshot(collection(database, "tableData"), (querySnapshot) => {
            const fetchedTableData = querySnapshot.docs.map((doc) => ({
                id: doc.newID,
                ...doc.data(),
            }));
            const sortFetchedTableData = fetchedTableData.sort((a, b) => new Date(a.date) - new Date(b.date))
            setSavedTableData(sortFetchedTableData);
        });
        return () => unsubscribeTableData();
    }, [setSavedTableData]);

    const deleteTableDataInDb = async (date) => {
        try {
            await deleteDoc(doc(database, "tableData", date))
            console.log("Table data has been deleted")
        } catch (error) {
            console.log("Failed to delete the table data")
        }
    }

    const deleteAllTableDataInDb = async () => {
        try {
            const querySnapshot = await getDocs(collection(database, "tableData"))
            for (const docSnapshot of querySnapshot.docs) {
                await deleteDoc(doc(database, "tableData", docSnapshot.id));
            }
            setSavedTableData([]);
            console.log("All the table data has been deleted")
        } catch (error) {
            console.log("Failed to delete all the table data")
        }
    }

    function handleSavingTableData() {
        const todayDate = new Date().toDateString();
        const existingEntryIndex = savedTableData.findIndex(data => data.date == todayDate);
        if (existingEntryIndex !== -1) {
            const updatedEntry = {
                ...savedTableData[existingEntryIndex],
                ravichandran: parseFloat(savedTableData[existingEntryIndex].ravichandran || 0) + parseFloat(tableData.ravichandran || 0),
                prajwal: parseFloat(savedTableData[existingEntryIndex].prajwal || 0) + parseFloat(tableData.prajwal || 0),
                ashwith: parseFloat(savedTableData[existingEntryIndex].ashwith || 0) + parseFloat(tableData.ashwith || 0),
                raviDescription: tableData.raviDescription + savedTableData[existingEntryIndex].raviDescription,
                prajwalDescription: tableData.prajwalDescription + savedTableData[existingEntryIndex].prajwalDescription,
                ashwithDescription: tableData.ashwithDescription + savedTableData[existingEntryIndex].ashwithDescription
            };
            const updatedTableData = [...savedTableData];
            updatedTableData[existingEntryIndex] = updatedEntry;
            setSavedTableData(updatedTableData);
            saveTableDataInDb(updatedEntry, todayDate);
        } else {
            const newTableData = {
                id: newID,
                date: todayDate,
                ...tableData,
            };
            setSavedTableData((prevData) => [...prevData, newTableData]);
            saveTableDataInDb(newTableData, todayDate);
        }
        setTableData({
            ravichandran: "",
            prajwal: "",
            ashwith: "",
            raviDescription: '',
            prajwalDescription: '',
            ashwithDescription: ''
        });
    }

    function handlePop() {
        setPopUp(true);
    }

    function handleConfirmDeleteOnPopUp() {
        deleteAllTableDataInDb();
        setPopUp(false);
    }

    function handleCancelOnPopUp() {
        setPopUp(false);
    }

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center">
            <BootstrapTable striped bordered hover className={toggle ? "table table-striped table-dark" : "table table-striped"}>
                <thead>
                    <tr style={fontSizeStyle}>
                        <th>Ravichandran</th>
                        <th>Prajwal</th>
                        <th>Ashwith</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={fontSizeStyle}>
                            <Form.Control
                                type="text"
                                value={tableData.ravichandran}
                                onChange={(e) => setTableData({ ...tableData, ravichandran: e.target.value })}
                            />
                        </td>
                        <td style={fontSizeStyle}>
                            <Form.Control
                                type="text"
                                value={tableData.prajwal}
                                onChange={(e) => setTableData({ ...tableData, prajwal: e.target.value })}
                            />
                        </td>
                        <td style={fontSizeStyle}>
                            <Form.Control
                                type="text"
                                value={tableData.ashwith}
                                onChange={(e) => setTableData({ ...tableData, ashwith: e.target.value })}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td style={fontSizeStyle}>
                            <Form.Control
                                type="text"
                                value={tableData.raviDescription}
                                onChange={(e) => setTableData({ ...tableData, raviDescription: e.target.value })}
                            />
                        </td>
                        <td style={fontSizeStyle}>
                            <Form.Control
                                type="text"
                                value={tableData.prajwalDescription}
                                onChange={(e) => setTableData({ ...tableData, prajwalDescription: e.target.value })}
                            />
                        </td>
                        <td style={fontSizeStyle}>
                            <Form.Control
                                type="text"
                                value={tableData.ashwithDescription}
                                onChange={(e) => setTableData({ ...tableData, ashwithDescription: e.target.value })}
                            />
                        </td>
                    </tr>
                </tbody>
            </BootstrapTable>
            <div className="d-flex flex-column align-items-center justify-content-center mt-3">
                <Button
                    type="primary"
                    className="btn-sm"
                    style={{ ...buttonResponsivness, fontSize: "13px", marginTop: "-15px", marginBottom: "15px" }}
                    onClick={handleSavingTableData}
                >
                    Save
                </Button>
                <BootstrapTable striped bordered hover style={{ tableResponsivness }}
                    className={toggle ? "table table-striped table-dark" : "table table-striped"}>
                    <thead>
                        <tr style={fontSizeStyle}>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Ravichandran</th>
                            <th>Prajwal</th>
                            <th>Ashwith</th>
                            <th></th>
                        </tr>
                    </thead>
                    {savedTableData.map((data, index) => {
                        return (
                            <tbody key={data.id} style={fontSizeStyle}>
                                <tr>
                                    <td rowSpan={2}>{index + 1}</td>
                                    <td rowSpan={2}>{data.date}</td>
                                    <td>{data.ravichandran}</td>
                                    <td>{data.prajwal}</td>
                                    <td>{data.ashwith}</td>
                                    <td rowSpan={2}>
                                        <AiFillDelete
                                            onClick={() => deleteTableDataInDb(data.date)}
                                            style={{ marginTop: "23px", cursor: "pointer" }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{data.raviDescription}</td>
                                    <td>{data.prajwalDescription}</td>
                                    <td>{data.ashwithDescription}</td>
                                </tr>
                            </tbody>
                        )
                    })}
                </BootstrapTable>
            </div>
            <Button
                type="primary"
                className="mt-2 btn-sm"
                onClick={handlePop}
                style={buttonResponsivness}
            >
                Delete All
            </Button>
            <Modal
                title="Are you sure you want to delete all?"
                open={popUp}
                onOk={handleConfirmDeleteOnPopUp}
                onCancel={handleCancelOnPopUp}
                okText="Yes"
                cancelText="No"
                width={popUpWidth}
            >
            </Modal>
        </div>
    );
}
