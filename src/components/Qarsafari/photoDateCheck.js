
import "../../Styles/Qarsafari/PhotoDateCheck.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import React from "react";
import StatusMessage from "../common/StatusMessage";
import PathInputActions from "../common/PathInputActions";
import { sanitizeWindowsPath } from "../../utils/pathUtils";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";

const PhotoDateCheck = () => {
  const [folderPath, setFolderPath] = useState("");
  const [resultPath, setResultPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const showPickerWarning = () =>
    setStatus({
      type: "error",
      text:
        "ბრაუზერის შეზღუდვის გამო, გთხოვთ ხელით შეიყვანოთ სერვერის სრული მისამართი.",
    });

  const requestFolderFromPicker = async (setter) => {
    try {
      if (window.nativePicker && window.nativePicker.selectFolder) {
        const fullPath = await window.nativePicker.selectFolder();
        if (fullPath) setter(fullPath);
        return;
      }
      if (window.showDirectoryPicker) {
        await window.showDirectoryPicker();
        showPickerWarning();
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: getFriendlyErrorMessage(
          error,
          "ფოლდერის ამორჩევა ვერ მოხერხდა. გთხოვთ შეიყვანოთ მისამართი ხელით."
        ),
      });
    }
  };

  const pickFolder = () => requestFolderFromPicker(setFolderPath);
  const pickResultFolder = () => requestFolderFromPicker(setResultPath);

  const pasteFromClipboard = async (setter) => {
    try {
      const text = await navigator.clipboard.readText();
      setter(sanitizeWindowsPath(text));
    } catch {
      setStatus({
        type: "error",
        text: "კლიპბორდიდან ჩასმა ვერ მოხერხდა. სცადეთ Ctrl + V.",
      });
    }
  };
  const handleSubmit = async () => {
    setStatus(null);
    setLoading(true);

    const apiUrl = "https://localhost:7027/GetCheckPhotoDate";
    const payload = { folderPath: folderPath, resultPath: resultPath };

    try {
      const response = await axios.post(apiUrl, payload);
      if (response.data.success === true) {
        setStatus({
          type: "success",
          text: response.data.message || "ოპერაცია წარმატებით დასრულდა.",
        });
      } else {
        throw new Error(
          response.data.message || "ფოტოების დათვალიერება ვერ შესრულდა."
        );
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: getFriendlyErrorMessage(
          error,
          "დაფიქსირდა შეცდომა. შეამოწმეთ მისამართები და სცადეთ ხელახლა."
        ),
      });
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
              onChange={(event) => setFolderPath(event.target.value)}
              placeholder="შეიტანეთ სერვერზე არსებული ფოტოების მისამართი"
            />
            <button onClick={pickFolder} title="ამოირჩიეთ ფოლდერი (ბეტა)">ამორჩევა</button>
          </div>
          <PathInputActions
            onPaste={() => pasteFromClipboard(setFolderPath)}
            onClear={() => setFolderPath("")}
          />
        </div>
        <div className="item-row">
          <label>ამოირჩიეთ მისამართი სადაც უნდა ჩაიწეროს შედეგი</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <input
              type="text"
              value={resultPath}
              onChange={(event) => setResultPath(event.target.value)}
              placeholder="შეიტანეთ სერვერზე არსებული შედეგების მისამართი"
            />
            <button onClick={pickResultFolder} title="ამოირჩიეთ ფოლდერი (ბეტა)">ამორჩევა</button>
          </div>
          <PathInputActions
            onPaste={() => pasteFromClipboard(setResultPath)}
            onClear={() => setResultPath("")}
          />
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "მუშავდება..." : "წაკითხვა"}
          </button>
          {loading && <div className="spinner"></div>}
          <button>2</button>
        </div>
        <StatusMessage status={status} />
      </div>
    </div>
  );
};
export default PhotoDateCheck;
