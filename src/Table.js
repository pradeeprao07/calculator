import React from "react";
import { Table as BootstrapTable, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import TextArea from "antd/es/input/TextArea";

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
                                <td colSpan={3}>
                                    <Form.Control
                                        as="textarea"
                                        rows={1}
                                        style={fontSizeStyle}
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => handleInputTableCell(e, item.id, "description")}
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
