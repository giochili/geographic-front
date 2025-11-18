import "../../Styles/Qarsafari/PhotoDateCheck.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import React from "react";

const WashlaFolderebisMdbsMixedvit = () => {
  const [folderPath, setFolderPath] = useState("");
  const [resultPath, setResultPath] = useState("");

  const [loading, setLoading] = useState(false);

  const pickFolder = async (setter) => {
    try {
      if (window.nativePicker && window.nativePicker.selectFolder) {
        const fullPath = await window.nativePicker.selectFolder();
        if (fullPath) setter(fullPath);
        return;
      }
      if (window.showDirectoryPicker) {
        await window.showDirectoryPicker();
        alert(
          "ბრაუზერის შეზღუდვის გამო, გთხოვთ ხელით შეიყვანოთ სერვერის სრული მისამართი."
        );
      }
    } catch {}
  };

  const handlePickFolder = () => pickFolder(setFolderPath);
  const handlePickResultFolder = () => pickFolder(setResultPath);
  const handleSubmit = async () => {
    setLoading(true);

    const apiUrl = "https://localhost:7027/GetCheckPhotoDate";
    const payload = { folderPath: folderPath, resultPath: resultPath };

    try {
      const response = await axios.post(apiUrl, payload);
      if (response.data.success === true) {
        alert("წარმატებით განხორციელდა ოპერაცია");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="main-container">
      <Link className="back-button" to="/qarsafariNavigator">
        &#8592; უკან
      </Link>
      <div className="content-container">
        <div className="item-row">
          <label>ამოირჩიეთ ფაილი სადაც არის ფოტოები</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <input
              type="text"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              placeholder="შეიტანეთ სერვერზე არსებული ფოტოების მისამართი"
            />
            <button onClick={handlePickFolder} title="ამოირჩიეთ ფოლდერი (ბეტა)">
              ამორჩევა
            </button>
          </div>
        </div>
        <div className="item-row">
          <label>ამოირჩიეთ მისამართი სადაც უნდა ჩაიწეროს შედეგი</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <input
              type="text"
              value={resultPath}
              onChange={(e) => setResultPath(e.target.value)}
              placeholder="შეიტანეთ სერვერზე არსებული შედეგების მისამართი"
            />
            <button
              onClick={handlePickResultFolder}
              title="ამოირჩიეთ ფოლდერი (ბეტა)"
            >
              ამორჩევა
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={handleSubmit}>წაკითხვა</button>
          {loading && <div className="spinner"></div>}
          <button>2</button>
        </div>
      </div>
    </div>
  );
};
export default WashlaFolderebisMdbsMixedvit;
