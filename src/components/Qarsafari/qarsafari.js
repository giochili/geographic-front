import React from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/qarsafari.css";
import axios from "axios";

const Qarsafari = ({ cardDataArray }) => {
  const [excelPath, setExcelPath] = useState([]);
  const [folderStartCountingNumber, setFolderStartCountingNumber] = useState();
  const [photoStartCountingNubmer, setPhotoStartCountingNumber] = useState();
  const apiUrl = "https://localhost:7055/RenamePhotosInFolder";

  const handleSubmit = async () => {
    const payload = {
      excelPath: excelPath,
      folderStartNumber: folderStartCountingNumber,
      photoStartNumber: photoStartCountingNubmer,
    };
    const response = await axios.post(apiUrl, payload);
  };
  return (
    <div className="parent-container">
      {/* Top Arrow Button */}
      <Link className="back-button" to="/">
        &#8592; Back to Main
      </Link>

      {/* Qarsafari Component */}
      <div className="main-container">
        <div className="row">
          <div className="flex">
            <label>შეიყვანეთ გადასანომრი ფაილის მისამართი</label>
            <input
              className="excelfileinput"
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setExcelPath(e.target.value)}
              value={excelPath}
            />
          </div>

          <div className="flex">
            <div>
              <input type="checkbox" id="myCheckbox" />

              <label htmlFor="myCheckbox" style={{ fontSize: "12px" }}>
                გადანომრილია
              </label>
            </div>
          </div>
        </div>
        {/* Second Row: Paragraph and Input */}
        <div className="row">
          <p>საიდან დავიწყოთ ფოლდერების გადანომვრა</p>
          <input
            type="number"
            placeholder="Input"
            value={folderStartCountingNumber}
            onChange={(e) => setFolderStartCountingNumber(e.target.value)}
          />
        </div>
        {/* Third Row: Paragraph and Input */}
        <div className="row">
          <p>საიდან დავიწყოთ ფოტოების გადანომვრა </p>
          <input
            value={photoStartCountingNubmer}
            type="number"
            placeholder="Input"
            onChange={(e) => setPhotoStartCountingNumber(e.target.value)}
          />
        </div>
        start: {folderStartCountingNumber}
        start: {photoStartCountingNubmer}
        {/* Fourth Row: Two Buttons */}
        <div className="row">
          <button onClick={handleSubmit}>გადანომვრა</button>
          <button>გადავიფიქრე</button>
        </div>
      </div>
    </div>
  );
};

export default Qarsafari;
