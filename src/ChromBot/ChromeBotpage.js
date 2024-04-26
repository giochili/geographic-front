import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ChromeBotPage = () => {
  const [excelPath, setExcelPath] = useState("D:\\My Documents\\Desktop\\test.xlsx");
  const [destination, setDestination] = useState("D:\\My Documents\\Desktop");
  const [loading, setLoading] = useState(false);


  const handleExcelFileChange = (event) => {
    const selectedFolder = event.target.value;
    setExcelPath(selectedFolder);
    // const file = event.target.files[0];
    // if (file) {
    //   // Check if the selected file is an Excel file
    //   if (
    //     file.type ===
    //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //   ) {
    //     setExcelPath(file.name);
    //   } else {
    //     alert("Please select an Excel file.");
    //   }
    // }
  };

  const handleDestinationChange = (event) => {
    const selectedFolder = event.target.value;
    setDestination(selectedFolder);
  };

  const handleSubmit = async () => {
    if (!excelPath || !destination) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const apiUrl = "https://localhost:7027/BotChromeArguments";
    const payload = { Excelpath: excelPath, Destination: destination };

    try {
      const response = await axios.post(apiUrl, payload);
      console.log(response.data);
      if (response.data.success === true) {
        alert("Operation completed successfully");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <Link className="back-button" to="/">
        &#8592; Back
      </Link>
      <div className="content-container">
        <div className="item-row">
          <label>ამოირჩიეთ ექსელის ფაილი (copy/paste)</label>
          <div style={{ display: "flex", gap: "20px" }}>
          <input type="text" onChange={handleExcelFileChange}></input>
            {/* <input
              type="file"
              accept=".xlsx"
              onChange={handleExcelFileChange}
            /> */}
          </div>
        </div>
        <div className="item-row">
          <label>შეიყვანეთ ფოლდერი ხელით (copy/pase)</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <input type="text" onChange={handleDestinationChange}></input>
            {/* <select value={destination} onChange={handleDestinationChange}>
              <option value="">Select a folder</option>
              <option value="/path/to/desktop">Desktop</option>
              <option value="/path/to/downloads">Downloads</option>
            </select> */}
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={handleSubmit}>Submit</button>
          {loading && <div className="spinner"></div>}
        </div>
      </div>
    </div>
  );
};

export default ChromeBotPage;
