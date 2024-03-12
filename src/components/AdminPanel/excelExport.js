import SideBarPanel from "./sideBarPanel";
import React, { useEffect, useReducer, useState, useRerender } from "react";
import axios from "axios";
import ColumnNameTable from "./ReadExcelFile/ColumnNameTable";
import "../../Styles/AdminPanel/Loader.css";

const ExcelExport = () => {
  const [accessActualPath, setAccessActualPath] = useState(
    "D:\\Projects\\qarsafrebi\\kaspi\\Kaspi_Windbreak.mdb"
  );
  const [excelActualPath, setExcelActualPath] = useState(
    "D:\\Projects\\qarsafrebi\\kaspi\\Kaspi_Windbreak.xlsx"
  );
  const [ExcelOptions, setExcelOptions] = useState([]);
  const [AccessOptions, setAccessOptions] = useState([]);
  const [key, setKey] = useState(0); // Initialize key state
  const [accesskey, setAccesskey] = useState(0);
  const [loading, setLoading] = useState(false);

  const [accessSheetName, setAccessSheetName] = useState("");

  const handleSubmit = async () => {
    setLoading(true);

    const apiUrl = "https://localhost:7055/ColumnNameTransfer";
    const payload = {
      ExcelPath: excelActualPath,
    };

    try {
      const response = await axios.get(apiUrl, {
        params: {
          ExcelPath: excelActualPath,
        },
      });

      setExcelOptions(response.data.data);

      // Increment the key to force re-render of ColumnNameTable
      setKey((prevKey) => prevKey + 1);

      if (response.data.data !== null) {
        alert("წარმატებით განხორციელდა წაკითხვა");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessSubmit = async () => {
    setLoading(true);
    const apiUrl = "https://localhost:7055/ColumnNameTransferFromAccess";
    const payload = {
      AccessPath: accessActualPath,
      AccessSheetName: accessSheetName,
    };

    try {
      const response = await axios.get(apiUrl, {
        params: {
          AccessPath: accessActualPath,
          AccessSheetName: accessSheetName,
        },
      });
      setAccessOptions(response.data.data);

      setKey((prevKey) => prevKey + 1);

      if (response.data.data !== null) {
        alert("წარმატებით განხორციელდა წაკითხვა");
      }
    } catch (error) {
      alert("მოხდა შეცდომა ექსესის წაკითხვისას", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="Main-Container">
      <SideBarPanel />
      <div style={{ position: "relative" }} className="row-excel">
        <div
          style={{
            display: "fkex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100%",
          }}
          className="input-container"
        >
          <div style={{ marginBottom: "20px", display: "flex" }}>
            <label style={{ marginRight: "20px" }}>
              ამოირჩიეთ ექსელის ფაილი
            </label>
            <input
              style={{ marginRight: "20px" }}
              type="file"
              accept=".xlsx"
              title="ამოირჩიეთ ექსელის ფაილი"
              // onChange={(e) => excelPath(e)}
            />
            <div style={{ display: "flex" }}>
              <button onClick={handleSubmit}>წაკითხვა</button>
              {loading && <div className="spinner"></div>}
            </div>
            {/* <button onClick={handleSubmit}> წაკითხვა</button> */}
          </div>

          <div style={{ marginBottom: "20px", display: "flex" }}>
            <label style={{ marginRight: "20px" }}>
              ამოირჩიეთ ექსესის ფაილი
            </label>
            <input
              style={{ marginRight: "20px" }}
              type="file"
              accept=".mdb"
              title="ამოირჩიეთ ექსესის ფაილი"
              // onChange={(e) => excelPath(e)}
            />
            <div style={{ display: "flex" }}>
              <button onClick={handleAccessSubmit}>წაკითხვა</button>
              {loading && <div className="spinner"></div>}
            </div>
          </div>
          <div>
            <label style={{ marginRight: "20px" }}>
              ამოირჩიეთ ექსესის ფაილი
            </label>
            <input
              style={{ marginRight: "20px" }}
              type="text"
              title="შეიყვანეთ შიტის სახელი"
              onChange={(e) => setAccessSheetName(e.target.value)}
            />
          </div>
        </div>
        <ColumnNameTable
          key={key}
          ExcelOptions={ExcelOptions}
          AccessOptions={AccessOptions}
        />
      </div>
    </div>
  );
};

export default ExcelExport;
