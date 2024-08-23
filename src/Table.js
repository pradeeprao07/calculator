import React from "react";
import { Table as BootstrapTable, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Table({ tableData, handleInputTableCell, toggle }) {
    const windowSize = window.innerWidth;
    const fontSizeStyle = { fontSize: windowSize < 450 ? "12px" : "16px" };

    return (
        <div>
            <BootstrapTable striped bordered hover className={ toggle ? "table table-striped table-dark" : "table table-striped" }>
                <thead>
                    <tr>
                        <th style={fontSizeStyle}>ID</th>
                        <th style={fontSizeStyle}>Date</th>
                        <th style={fontSizeStyle}>Ravichandran</th>
                        <th style={fontSizeStyle}>Prajwal</th>
                        <th style={fontSizeStyle}>Ashwith</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((item) => (
                        <React.Fragment key={item.id}>
                            <tr>
                                <td style={fontSizeStyle}>{item.id}</td>
                                <td style={fontSizeStyle}>{item.date}</td>
                                <td>
                                    <Form.Control
                                        style={fontSizeStyle}
                                        type="text"
                                        value={item.ravi}
                                        onChange={(e) => handleInputTableCell(e, item.id, "ravi")}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        style={fontSizeStyle}
                                        type="text"
                                        value={item.prajwal}
                                        onChange={(e) => handleInputTableCell(e, item.id, "prajwal")}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        style={fontSizeStyle}
                                        type="text"
                                        value={item.ashwith}
                                        onChange={(e) => handleInputTableCell(e, item.id, "ashwith")}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={fontSizeStyle}>Description:</td>
                                <td>
                                    <Form.Control
                                        style={fontSizeStyle}
                                        type="text"
                                        value={item.description1}
                                        onChange={(e) => handleInputTableCell(e, item.id, "description1")}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        style={fontSizeStyle}
                                        type="text"
                                        value={item.description2}
                                        onChange={(e) => handleInputTableCell(e, item.id, "description2")}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        style={fontSizeStyle}
                                        type="text"
                                        value={item.description3}
                                        onChange={(e) => handleInputTableCell(e, item.id, "description3")}
                                    />
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </BootstrapTable>
        </div>
    );
}
