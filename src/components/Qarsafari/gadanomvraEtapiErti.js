import React, { useState } from "react";
// import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/qarsafari.css";
import axios from "axios";
import StatusMessage from "../common/StatusMessage";
import PathInputActions from "../common/PathInputActions";
import { sanitizeWindowsPath } from "../../utils/pathUtils";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";

const GadanomvraEtapiErti = () => {
  const [folderPath, setFolderPath] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [gadanomrilia, setGadanomrilia] = useState(false);
  const [folderStartCountingNumber, setFolderStartCountingNumber] = useState();
  const [photoStartCountingNubmer, setPhotoStartCountingNumber] = useState();
  const apiUrl = `${API_BASE_URL}/RenamePhotosInFolderFirstStep`;
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const pasteFolderFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFolderPath(sanitizeWindowsPath(text));
    } catch (e) {
      setStatus({
        type: "error",
        text: "კლიპბორდიდან ჩასმა მიუწვდომელია. სცადეთ ხელით ჩასმა.",
      });
    }
  };

  const handleSubmit = async () => {
    setStatus(null);
    setLoading(true);
    try {
      const payload = {
        folderPath: folderPath,
        folderStartNumber: folderStartCountingNumber,
        photoStartNumber: photoStartCountingNubmer,
        Gadanomrilia: gadanomrilia,
      };
      const response = await axios.post(apiUrl, payload);
      if (response.data.Success) {
        setStatus({
          type: "success",
          text: response.data.message || "ოპერაცია წარმატებით დასრულდა.",
        });
      } else {
        throw new Error(
          response.data.message || "ვერ მოხერხდა ფოტოების გადანომვრა."
        );
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: getFriendlyErrorMessage(
          error,
          "სერვერთან კავშირი ვერ მოხერხდა. გთხოვთ სცადოთ მოგვიანებით."
        ),
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    
    <div className="parent-container">
      {/* Top Arrow Button */}
      

      {/* Gadanomvra Component */}
      <div className="main-container">
        <Link className="back-button" to="/etapiErtiNavigator">
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
              placeholder="D:\\Projects\\2025\\...\\Photoes"
            />
            <PathInputActions
              onPaste={pasteFolderFromClipboard}
              onClear={() => setFolderPath("")}
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
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "გადამუშავება..." : "გადანომვრა"}
          </button>
          <Link className="gadavifiqre-btn" to={"/etapiErtiNavigator"}>
            გადავიფიქრე
          </Link>
        </div>
        <StatusMessage status={status} />
      </div>
    </div>
  );
};

export default GadanomvraEtapiErti;
