import React from "react";
import { useState } from "react";
// import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/qarsafari.css";
import axios from "axios";

const Gadanomvra = ({ cardDataArray }) => {
  const [folderPath, setFolderPath] = useState(
    // "D:\\Documents\\Desktop\\Photoes"
    // "D:\\Documents\\Desktop\\I_etapi\\Photoes"
    "D:\\MyWork\\2023\\Telavi_Qarsafari\\GARDABANI\\Photoes"
  );
  const [gadanomrilia, setGadanomrilia] = useState(false);
  const [folderStartCountingNumber, setFolderStartCountingNumber] = useState();
  const [photoStartCountingNubmer, setPhotoStartCountingNumber] = useState();
  const apiUrl = "https://localhost:7027/RenamePhotosInFolder";

  const handleSubmit = async () => {
    const payload = {
      folderPath: folderPath,
      folderStartNumber: folderStartCountingNumber,
      photoStartNumber: photoStartCountingNubmer,
      Gadanomrilia: gadanomrilia,
    };
    const response = await axios.post(apiUrl, payload);
    if (response.data.Success) {
    }
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
              title="მიუთითეთ ფოლდერის მისამართი სადაც ფოტოები/ფოლდერებია გადასანომრი"
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
            placeholder="შეიყვანეთ რიცხვი"
            value={folderStartCountingNumber}
            onChange={(e) => setFolderStartCountingNumber(e.target.value)}
            title="გთხოვთ შეიყვანოთ რიცხვი თუ საიდან დაიწყოს გადანომვრა ფოლდერების."
          />
        </div>
        {/* Third Row: Paragraph and Input */}
        <div className="row">
          <p>საიდან დავიწყოთ ფოტოების გადანომვრა </p>
          <input
            value={photoStartCountingNubmer}
            type="number"
            placeholder="შეიყვანეთ რიცხვი"
            onChange={(e) => setPhotoStartCountingNumber(e.target.value)}
            title="გთხოვთ შეიყვანოთ რიცხვი თუ საიდან დაიწყოს ფოტოების გადანომვრა."
          />
        </div>
        {/* Fourth Row: Two Buttons */}
        <div className="row">
          <button onClick={handleSubmit}>გადანომვრა</button>
          <Link className="gadavifiqre-btn" to={"/qarsafariNavigator"}>
            გადავიფიქრე
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gadanomvra;
