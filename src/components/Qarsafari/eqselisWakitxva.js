import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import "../../Styles/Qarsafari/eqselisWakitxva.css";

const EqselisWakitxva = () => {
  const [UnicID, setUnicID] = useState(0);
  const excelFilePath = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) {
        // User canceled file selection
        return;
      }

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
    } catch (error) {
      alert("Error reading Excel file:", error);
    }
  };
  const [ExcelPath, setExcelPath] = useState(
    "D:\\Projects\\qarsafrebi\\დუშეთი\\testexcel.xls"
  );
  const [newExcelDestination, setNewExcelDestination] = useState(
    "D:\\Documents\\Desktop\\ფოტოები"
  );
  const [accessFilePath, setAccessFilePath] = useState("");
  const apiUrl = "https://localhost:7055/ExcelCalculations";
  const handleSubmit = async () => {
    const payload = {
      UnicIDStartNumber: UnicID,
      ExcelPath: ExcelPath,
      ExcelDestinationPath: newExcelDestination,
      AccessFilePath: accessFilePath,
    };
    const response = await axios.post(apiUrl, payload);
  };

  return (
    <div className="Main-for-eqselisWakitxva">
      <div className="obtainer">
        <div className="row-excel">
          <Link className="back-button" to="/qarsafariNavigator">
            &#8592; უკან
          </Link>
          <label>ამოირჩიეთ ექსელის ფაილი</label>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => excelFilePath(e)}
          />
        </div>
        <div className="row-excel">
          <label>შეიყვანეთ UNIC-ID საიდანაც უნდა დაიწყოს გადანომვრა</label>
          <input
            placeholder="insert number"
            value={UnicID}
            type="number"
            onChange={(e) => setUnicID(e.target.value)}
          />
        </div>
        <div className="row-excel">
          <label>
            შეიყანეთ მისამართი სადაც უნდა შეიქმნას
            <br /> ექსელის ახალი ფაილი
          </label>
          <input
            // value={newExcelDestination}
            type="text"
            placeholder="insert path"
            // onChange={(e) => setNewExcelDestination(e.target.value)}
          />
        </div>
        <div className="row-excel">
          <label>ამოირჩიეთ access ფაილი</label>
          <input
            value={accessFilePath}
            onChange={(e) => setAccessFilePath(e.target.value)}
            type="file"
            accept=".mdb"
            placeholder="insert path"
          />
        </div>
        <div className="row-excel-buttons">
          <button onClick={handleSubmit}> გაშვება </button>
          <button>გადავიფიქრე</button>
        </div>
      </div>
    </div>
  );
};

export default EqselisWakitxva;
