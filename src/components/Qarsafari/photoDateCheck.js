import "../../Styles/Qarsafari/PhotoDateCheck.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import React from "react";

const PhotoDateCheck = () => {
  const [folderPath, setolderPath] = useState(
    // "D:\\Documents\\Desktop\\publistcsa"
    // "D:\\Documents\\Desktop\\I_etapi\\Photoes"
    // "D:\\Projects\\2023\\Qarsafrebi\\გარდაბანი\\Photoes"
    // "D:\\Projects\\2023\\Qarsafrebi\\წალკა\\walka_photo_Resize"
    // "D:\\Projects\\2023\\Qarsafrebi\\ბოლნისი_V1\\bolnisi_photo_Resize"
    // "D:\\Documents\\Desktop\\Photoes"
    // "D:\\Projects\\2023\\Qarsafrebi\\გარდაბანი-II-ეტაპი\\Photoes"
    // "D:\\Projects\\2023\\Qarsafrebi\\გარდაბანი-II-ეტაპი\\V2\\Photoes"
    // "D:\\Projects\\2023\\Qarsafrebi\\თეთრიწყარო_v2\\Photo"
    "D:\\Projects\\2023\\Qarsafrebi\\ბოლნისი_old\\bolnisi_photo_Resize"
  );
  const [resultPath, setResultPath] = useState(
    // "D:\\Projects\\2023\\Qarsafrebi\\გარდაბანი\\Photoes"
    // "D:\\Projects\\2023\\Qarsafrebi\\წალკა"
    // "D:\\Projects\\2023\\Qarsafrebi\\ბოლნისი_V1\\result"
    // "D:\\Projects\\2023\\Qarsafrebi\\გარდაბანი-II-ეტაპი\\results"
    // "D:\\Projects\\2023\\Qarsafrebi\\გარდაბანი-II-ეტაპი\\V2\\results"
    // "D:\\Projects\\2023\\Qarsafrebi\\თეთრიწყარო_v2\\result"
    "D:\\Projects\\2023\\Qarsafrebi\\ბოლნისი_old\\result"
  );

  const [loading, setLoading] = useState(false);
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
            <input type="text" defaultValue={folderPath} />
            <button>ამორჩევა</button>
          </div>
        </div>
        <div className="item-row">
          <label>ამოირჩიეთ მისამართი სადაც უნდა ჩაიწეროს შედეგი</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <input type="text" defaultValue={resultPath} />
            <button>ამორჩევა</button>
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
export default PhotoDateCheck;
