import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PhotoSplit = () => {
  const [photosBefore, setPhotosBefore] = useState("");
  const [destination, setDestination] = useState(
    "D:\\Projects\\2024\\CHromeBotT"
  );
  const [loading, setLoading] = useState(false);

  const handlePhotoLocation = (event) => {
    const photosBefore = event.target.value;
    setPhotosBefore(photosBefore);
  };

  const handleDestinationChange = (event) => {
    const selectedFolder = event.target.value;
    setDestination(selectedFolder);
  };

  const handleSubmit = async () => {
    if (!photosBefore || !destination) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const apiUrl = "https://localhost:7027/PostPhotoSplitPaths";
    const payload = {
      gadanomriliPhotoFolderPath: photosBefore,
      destinationFolderPath: destination,
    };

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
      <Link className="back-button" to="/qarsafariNavigator">
        &#8592; Back
      </Link>
      <div className="content-container">
        <div className="item-row">
          <label>მიუთითეთ სად არის ფოტოების ფოლდერი (copy/paste)</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <input type="text" onChange={handlePhotoLocation}></input>
            {/* <input
              type="file"
              accept=".xlsx"
              onChange={handleExcelFileChange}
            /> */}
          </div>
        </div>
        <div className="item-row">
          <label>შეიყვანეთ ფოლდერი ხელით სად ჩაიწეროს შედეგი (copy/pase)</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <input type="text" onChange={handleDestinationChange}></input>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={handleSubmit}>გაშვება</button>
          {loading && <div className="spinner"></div>}
        </div>
      </div>
    </div>
  );
};

export default PhotoSplit;
