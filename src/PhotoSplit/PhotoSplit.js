import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PhotoSplit.css";
import StatusMessage from "../components/common/StatusMessage";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { getFriendlyErrorMessage } from "../utils/errorUtils";

const PhotoSplit = () => {
  const [photosBefore, setPhotosBefore] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [destination, setDestination] = useState(
    ""
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({
    photosBefore: "",
    destination: "",
  });
  const [touched, setTouched] = useState({});

  const validateField = (fieldName, value) => {
    let error = "";
    
    switch (fieldName) {
      case "photosBefore":
        if (!value || value.trim() === "") {
          error = "ფოტოების ფოლდერის მისამართი აუცილებელია";
        }
        break;
      
      case "destination":
        if (!value || value.trim() === "") {
          error = "დანიშნულების ფოლდერის მისამართი აუცილებელია";
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
      { name: "photosBefore", value: photosBefore },
      { name: "destination", value: destination },
    ];

    let isValid = true;
    fieldsToValidate.forEach(({ name, value }) => {
      if (!validateField(name, value)) {
        isValid = false;
      }
    });

    setTouched({
      photosBefore: true,
      destination: true,
    });

    return isValid;
  };

  const handleBlur = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

  const handlePhotoLocation = (event) => {
    const value = event.target.value;
    setPhotosBefore(value);
    if (touched.photosBefore) {
      validateField("photosBefore", value);
    }
  };

  const handleDestinationChange = (event) => {
    const value = event.target.value;
    setDestination(value);
    if (touched.destination) {
      validateField("destination", value);
    }
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

    const apiUrl = `${API_BASE_URL}/PostPhotoSplitPaths`;
    const payload = {
      gadanomriliPhotoFolderPath: photosBefore,
      destinationFolderPath: destination,
    };

    try {
      const response = await axios.post(apiUrl, payload);
      if (response.data.success === true) {
        setStatus({
          type: "success",
          text: response.data.message || "ოპერაცია წარმატებით დასრულდა.",
        });
      } else {
        throw new Error(
          response.data.message || "ფოტოების გაყოფა ვერ შესრულდა."
        );
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: getFriendlyErrorMessage(
          error,
          "დაფიქსირდა შეცდომა. გთხოვთ გადაამოწმოთ მონაცემები და სცადოთ ხელახლა."
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header">ფოტოების გაყოფა</header>
      <Link className="back-button" to="/qarsafariNavigator">
        &#8592; უკან
      </Link>
      <div className="Main-for-eqselisWakitxva">
        <div className="obtainer">
          {/* Photos Before - Full Width */}
          <div className="row-excel1 full-width">
            <label>მიუთითეთ სად არის ფოტოების ფოლდერი</label>
            <input
              type="text"
              value={photosBefore}
              onChange={handlePhotoLocation}
              onBlur={(e) => handleBlur("photosBefore", e.target.value)}
              className={errors.photosBefore && touched.photosBefore ? "input-error" : ""}
              placeholder="შეიყვანეთ ფოტოების ფოლდერის სრული მისამართი"
              title="მიუთითეთ სერვერზე არსებული ფოტოების ფოლდერის სრული მისამართი"
            />
            {errors.photosBefore && touched.photosBefore && (
              <span style={{ color: "#d32f2f", fontSize: "14px", marginTop: "4px" }}>
                {errors.photosBefore}
              </span>
            )}
          </div>

          {/* Destination - Full Width */}
          <div className="row-excel1 full-width">
            <label>შეიყვანეთ ფოლდერი სად ჩაიწეროს შედეგი</label>
            <input
              type="text"
              value={destination}
              onChange={handleDestinationChange}
              onBlur={(e) => handleBlur("destination", e.target.value)}
              className={errors.destination && touched.destination ? "input-error" : ""}
              placeholder="შეიყვანეთ დანიშნულების ფოლდერის სრული მისამართი"
              title="მიუთითეთ სერვერზე არსებული დანიშნულების ფოლდერის სრული მისამართი"
            />
            {errors.destination && touched.destination && (
              <span style={{ color: "#d32f2f", fontSize: "14px", marginTop: "4px" }}>
                {errors.destination}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="row-excel-buttons">
            <button
              onClick={handleSubmitClick}
              disabled={loading}
              style={{
                backgroundColor: loading ? "gray" : "#4caf50",
              }}
            >
              {loading ? "მუშავდება..." : "გაშვება"}
            </button>
            <Link className="gadavifiqre-btn" to="/qarsafariNavigator">
              გადავიფიქრე
            </Link>
            {loading && <div className="spinner"></div>}
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

export default PhotoSplit;
