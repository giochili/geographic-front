import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/eqselisWakitxva.css";
import axios from "axios";
import StatusMessage from "../common/StatusMessage";
import ConfirmationModal from "../common/ConfirmationModal";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";

const Gadanomvra = () => {
  const [folderPath, setFolderPath] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [gadanomrilia, setGadanomrilia] = useState(false);
  const [folderStartCountingNumber, setFolderStartCountingNumber] = useState(1);
  const [photoStartCountingNubmer, setPhotoStartCountingNumber] = useState(1);
  const apiUrl = `${API_BASE_URL}/RenamePhotosInFolder`;
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({
    folderPath: "",
    folderStartCountingNumber: "",
    photoStartCountingNubmer: "",
  });
  const [touched, setTouched] = useState({});
  
  // Re-validate fields when checkbox state changes
  useEffect(() => {
    if (touched.folderStartCountingNumber) {
      validateField("folderStartCountingNumber", folderStartCountingNumber);
    }
  }, [gadanomrilia]);

  const validateField = (fieldName, value) => {
    let error = "";
    
    switch (fieldName) {
      case "folderPath":
        if (!value || value.trim() === "") {
          error = "ფოლდერის მისამართი აუცილებელია";
        }
        break;
      
      case "folderStartCountingNumber":
        // Only validate if checkbox is NOT checked (field is enabled)
        if (!gadanomrilia) {
          if (value && value !== "" && value !== 0) {
            if (isNaN(value) || Number(value) <= 0) {
              error = "ნომერი უნდა იყოს დადებითი რიცხვი";
            }
          }
        }
        // If checkbox is checked, no validation needed (field is disabled)
        break;
      
      case "photoStartCountingNubmer":
        if (value && value !== "" && value !== 0) {
          if (isNaN(value) || Number(value) <= 0) {
            error = "ნომერი უნდა იყოს დადებითი რიცხვი";
          }
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
      { name: "folderStartCountingNumber", value: folderStartCountingNumber },
      { name: "photoStartCountingNubmer", value: photoStartCountingNubmer },
    ];

    let isValid = true;
    fieldsToValidate.forEach(({ name, value }) => {
      if (!validateField(name, value)) {
        isValid = false;
      }
    });

    setTouched({
      folderPath: true,
      folderStartCountingNumber: true,
      photoStartCountingNubmer: true,
    });

    return isValid;
  };

  const handleBlur = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

  const handleSubmitClick = () => {
    // Validate all fields before showing confirmation modal
    if (!validateAllFields()) {
      setStatus({
        type: "error",
        text: "გთხოვთ შეავსოთ ყველა აუცილებელი ველი სწორად.",
      });
      return;
    }
    // Show confirmation modal
    setShowConfirmationModal(true);
  };

  const handleConfirm = async () => {
    // Close modal
    setShowConfirmationModal(false);
    
    // Proceed with submission
    await executeSubmit();
  };

  const handleCancel = () => {
    // Just close the modal
    setShowConfirmationModal(false);
  };

  const executeSubmit = async () => {
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
    <div>
      <header className="header">მეორე ეტაპი II</header>
      <Link className="back-button" to="/etapiOriNavigator">
        &#8592; უკან
      </Link>
      <div className="Main-for-eqselisWakitxva">
        <div className="obtainer">
          {/* Folder Path - Full Width */}
          <div className="row-excel1 full-width">
            <label>შეიყვანეთ გადასანომრი ფაილის მისამართი</label>
            <input
              onChange={(e) => {
                setFolderPath(e.target.value);
                if (touched.folderPath) {
                  validateField("folderPath", e.target.value);
                }
              }}
              onBlur={(e) => handleBlur("folderPath", e.target.value)}
              value={folderPath}
              className={errors.folderPath && touched.folderPath ? "input-error" : ""}
              title="მიუთითეთ ფოლდერის მისამართი სადაც ფოტოები/ფოლდერებია გადასანომრი"
              type="text"
              placeholder="D:\\Projects\\2025\\...\\Photoes"
            />
          </div>

          {/* Checkbox */}
          <div className="row-excel1">
            <div className="checkbox-group">
              <input
                value={gadanomrilia}
                onChange={(e) => {
                  setGadanomrilia(e.target.checked);
                  if (touched.folderStartCountingNumber) {
                    validateField("folderStartCountingNumber", folderStartCountingNumber);
                  }
                }}
                type="checkbox"
                id="myCheckbox"
              />
              <label htmlFor="myCheckbox">
                გადანომრილია ფოლდერები  
              </label>
            </div>
          </div>

          {/* Folder Start Number */}
          <div className="row-excel1">
            <label>საიდან დავიწყოთ ფოლდერების გადანომვრა</label>
            <input
              type="number"
              min="1"
              disabled={gadanomrilia}
              placeholder={gadanomrilia ? "გადანომრილია - არ არის საჭირო" : "შეიყვანეთ რიცხვი"}
              value={folderStartCountingNumber}
              onChange={(e) => {
                if (!gadanomrilia) {
                  setFolderStartCountingNumber(e.target.value);
                  if (touched.folderStartCountingNumber) {
                    validateField("folderStartCountingNumber", e.target.value);
                  }
                }
              }}
              onBlur={(e) => {
                if (!gadanomrilia) {
                  handleBlur("folderStartCountingNumber", e.target.value);
                }
              }}
              className={errors.folderStartCountingNumber && touched.folderStartCountingNumber && !gadanomrilia ? "input-error" : ""}
              title={gadanomrilia ? "გადანომრილია ფოლდერები მონიშნულია - ველი გამორთულია" : "გთხოვთ შეიყვანოთ რიცხვი თუ საიდან დაიწყოს გადანომვრა ფოლდერების."}
            />
          </div>

          {/* Photo Start Number */}
          <div className="row-excel1">
            <label>საიდან დავიწყოთ ფოტოების გადანომვრა</label>
            <input
              value={photoStartCountingNubmer}
              type="number"
              min="1"
              placeholder="შეიყვანეთ რიცხვი"
              onChange={(e) => {
                setPhotoStartCountingNumber(e.target.value);
                if (touched.photoStartCountingNubmer) {
                  validateField("photoStartCountingNubmer", e.target.value);
                }
              }}
              onBlur={(e) => handleBlur("photoStartCountingNubmer", e.target.value)}
              className={errors.photoStartCountingNubmer && touched.photoStartCountingNubmer ? "input-error" : ""}
              title="გთხოვთ შეიყვანოთ რიცხვი თუ საიდან დაიწყოს ფოტოების გადანომვრა."
            />
          </div>

          {/* Buttons */}
          <div className="row-excel-buttons">
            <button onClick={handleSubmitClick} disabled={loading}>
              {loading ? "გადამუშავება..." : "გადანომვრა"}
            </button>
            <Link className="gadavifiqre-btn" to={"/etapiOriNavigator"}>
              გადავიფიქრე
            </Link>
          </div>
          <StatusMessage status={status} />
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        message="დარწმუნებული ხართ რომ მზადააა გასაშვებად?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText="დიახ"
        cancelText="არა"
      />
    </div>
  );
};

export default Gadanomvra;
