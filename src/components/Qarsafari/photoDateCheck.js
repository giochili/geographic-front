import "../../Styles/Qarsafari/eqselisWakitxva.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import React from "react";
import StatusMessage from "../common/StatusMessage";
import { sanitizeWindowsPath } from "../../utils/pathUtils";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";

const PhotoDateCheck = () => {
  const [folderPath, setFolderPath] = useState("");
  const [resultPath, setResultPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  // Validation states
  const [errors, setErrors] = useState({
    folderPath: "",
    resultPath: "",
  });
  const [touched, setTouched] = useState({});

  const validateField = (fieldName, value) => {
    let error = "";
    
    switch (fieldName) {
      case "folderPath":
        if (!value || value.trim() === "") {
          error = "ფოლდერის მისამართი აუცილებელია";
        }
        break;
      
      case "resultPath":
        if (!value || value.trim() === "") {
          error = "შედეგის მისამართი აუცილებელია";
        }
        break;
      
      default:
        break;
    }
    
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error === "";
  };

  const validateAllFields = () => {
    const fieldsToValidate = [
      { name: "folderPath", value: folderPath },
      { name: "resultPath", value: resultPath },
    ];

    let isValid = true;
    fieldsToValidate.forEach(({ name, value }) => {
      if (!validateField(name, value)) {
        isValid = false;
      }
    });

    setTouched({
      folderPath: true,
      resultPath: true,
    });

    return isValid;
  };

  const handleBlur = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

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

  const handleSubmit = async () => {
    setStatus(null);
    
    // Validate all fields before submission
    if (!validateAllFields()) {
      setStatus({
        type: "error",
        text: "გთხოვთ შეავსოთ ყველა აუცილებელი ველი სწორად.",
      });
      return;
    }
    
    setLoading(true);

    const apiUrl = `${API_BASE_URL}/GetCheckPhotoDate`;
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
    <div>
      <header className="header">ფოტოების თარიღის შემოწმება</header>
      <Link className="back-button" to="/qarsafariNavigator">
        &#8592; უკან
      </Link>
      <div className="Main-for-eqselisWakitxva">
        <div className="obtainer">
          {/* Folder Path - Full Width */}
          <div className="row-excel1 full-width">
            <label>ამოირჩიეთ ფაილი სადაც არის ფოტოები</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={folderPath}
                onChange={(e) => {
                  setFolderPath(e.target.value);
                  if (touched.folderPath) {
                    validateField("folderPath", e.target.value);
                  }
                }}
                onBlur={(e) => handleBlur("folderPath", e.target.value)}
                className={errors.folderPath && touched.folderPath ? "input-error" : ""}
                placeholder="შეიტანეთ სერვერზე არსებული ფოტოების მისამართი"
                style={{ flex: 1 }}
              />
              <button onClick={pickFolder} title="ამოირჩიეთ ფოლდერი (ბეტა)" style={{ whiteSpace: "nowrap" }}>
                ამორჩევა
              </button>
            </div>
          </div>

          {/* Result Path - Full Width */}
          <div className="row-excel1 full-width">
            <label>ამოირჩიეთ მისამართი სადაც უნდა ჩაიწეროს შედეგი</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={resultPath}
                onChange={(e) => {
                  setResultPath(e.target.value);
                  if (touched.resultPath) {
                    validateField("resultPath", e.target.value);
                  }
                }}
                onBlur={(e) => handleBlur("resultPath", e.target.value)}
                className={errors.resultPath && touched.resultPath ? "input-error" : ""}
                placeholder="შეიტანეთ სერვერზე არსებული შედეგების მისამართი"
                style={{ flex: 1 }}
              />
              <button onClick={pickResultFolder} title="ამოირჩიეთ ფოლდერი (ბეტა)" style={{ whiteSpace: "nowrap" }}>
                ამორჩევა
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="row-excel-buttons">
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "მუშავდება..." : "წაკითხვა"}
            </button>
            {loading && <div className="spinner"></div>}
          </div>
          <StatusMessage status={status} />
        </div>
      </div>
    </div>
  );
};
export default PhotoDateCheck;
