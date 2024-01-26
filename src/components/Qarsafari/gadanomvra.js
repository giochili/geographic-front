import React from "react";
import { useState } from "react";
// import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/qarsafari.css";
import axios from "axios";

const Gadanomvra = ({ cardDataArray }) => {
  const [folderPath, setFolderPath] = useState(
    "D:\\Documents\\Desktop\\ფოტოები"
  );
  const [gadanomrilia, setGadanomrilia] = useState(false);
  const [folderStartCountingNumber, setFolderStartCountingNumber] = useState();
  const [photoStartCountingNubmer, setPhotoStartCountingNumber] = useState();
  const apiUrl = "https://localhost:7055/RenamePhotosInFolder";

  const handleSubmit = async () => {
    const payload = {
      folderPath: folderPath,
      folderStartNumber: folderStartCountingNumber,
      photoStartNumber: photoStartCountingNubmer,
      Gadanomrilia: gadanomrilia,
    };
    const response = await axios.post(apiUrl, payload);
  };
  return (
    <div className="parent-container">
      {/* Top Arrow Button */}

      {/* Gadanomvra Component */}
      <div className="main-container">
        <Link className="back-button" to="/qarsafariNavigator">
          &#8592; უკან
        </Link>
        <div className="row">
          <div className="flex">
            <label>შეიყვანეთ გადასანომრი ფაილის მისამართი</label>
            <input
              // className="folderfileinput"
              // type="file"
              onChange={(e) => setFolderPath(e.target.value)}
              value={folderPath}
              // directory=""
              // webkitdirectory=""
              type="text"
            />
          </div>
          <div className="flex">
            <div>
              <input
                value={gadanomrilia}
                onChange={(e) => setGadanomrilia(e.target.checked)}
                type="checkbox"
                id="myCheckbox"
              />

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
        {/* Fourth Row: Two Buttons */}
        <div className="row">
          <button onClick={handleSubmit}>გადანომვრა</button>
          <button>გადავიფიქრე</button>
        </div>
      </div>
    </div>
  );
};

export default Gadanomvra;
