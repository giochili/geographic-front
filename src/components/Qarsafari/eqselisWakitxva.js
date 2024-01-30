import React, { useState, useEffect } from "react";
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
    "D:\\Projects\\qarsafrebi\\დუშეთი\\დიდი-დუშეთი.xlsx"
  );
  const [newExcelDestination, setNewExcelDestination] = useState(
    "D:\\Documents\\Desktop\\ფოტოები"
  );
  const [accessFilePath, setAccessFilePath] = useState("");
  const [options, setOptions] = useState([]);
  const [projectNameID, setProjectNameID] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "https://localhost:7055/GetProjectNamesList";
        const response = await axios.get(apiUrl);
        setOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    const apiUrl = "https://localhost:7055/ExcelCalculations";
    const payload = {
      UnicIDStartNumber: UnicID,
      ExcelPath: ExcelPath,
      ExcelDestinationPath: newExcelDestination,
      AccessFilePath: accessFilePath,
      ProjectNameID: projectNameID,
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
            title="ამოირჩიეთ ექსელის ფაილი."
          />
        </div>
        <div className="row-excel">
          <label>შეიყვანეთ UNIC-ID საიდანაც უნდა დაიწყოს გადანომვრა</label>
          <input
            placeholder="შეიყვანეთ რიცხვი"
            value={UnicID}
            type="number"
            onChange={(e) => setUnicID(e.target.value)}
            title="გთხოვთ შეიყვანოთ რიცხვი თუ საიდან დაიწყოს გადანომვრა UNIQ-ID სთვის."
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
            placeholder="შეავსეთ მისამართი"
            // onChange={(e) => setNewExcelDestination(e.target.value)}
            title="გთხოვთ შეავსოთ მისამართი რომ გადათვლილი ექსელის ფოლდერი ჩაკოპირდეს."
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
            title="ამოირჩიეთ access ფაილი."
          />
        </div>
        <div className="row-excel">
          <label>ამოირჩიეთ მუნიციპალიტეტი</label>
          <select
            title="აირჩიეთ მუნიციპალიტეტი"
            onChange={(e) => setProjectNameID(e.target.value)}
          >
            <option value={0}></option>
            {options.map((option) => (
              <option
                title="აირჩიეთ მუნიციპალიტეტი "
                key={option.id}
                value={option.id}
              >
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className="row-excel-buttons">
          <button onClick={handleSubmit}> გაშვება </button>
          <Link className="gadavifiqre-btn" to="/qarsafariNavigator">
            გადავიფიქრე
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EqselisWakitxva;
