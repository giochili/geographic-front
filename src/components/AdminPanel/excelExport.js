import SideBarPanel from "./sideBarPanel";
import React, { useEffect, useReducer, useState, useRerender } from "react";
import axios from "axios";
import ColumnNameTable from "./ReadExcelFile/ColumnNameTable";

const ExcelExport = () => {
  const [excelActualPath, setExcelActualPath] = useState(
    "D:\\Projects\\qarsafrebi\\kaspi\\final\\მესამე-ატაცი-დიდი-კასპი.xlsx"
  );
  const [ExcelOptions, setExcelOptions] = useState([]);

  const handleSubmit = async () => {
    const apiUrl = "https://localhost:7055/ColumnNameTransfer";
    const payload = {
      ExcelPath: excelActualPath,
    };
    const response = await axios.get(apiUrl, {
      params: {
        ExcelPath: excelActualPath,
      },
    });
    setExcelOptions(response.data.data);
  };
  return (
    <div className="Main-Container">
      <SideBarPanel />
      <div className="row-excel">
        <div className="input-container">
          <label>ამოირჩიეთ ექსელის ფაილი</label>
          <input
            type="file"
            accept=".xlsx"
            title="ამოირჩიეთ ექსელის ფაილი"
            // onChange={(e) => excelPath(e)}
          />
          <button onClick={handleSubmit}> წაკითხვა</button>

          <ColumnNameTable ExcelOptions={ExcelOptions} />
        </div>
      </div>
    </div>
  );
};

export default ExcelExport;
