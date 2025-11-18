import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import "../../Styles/Qarsafari/eqselisWakitxva.css";

const EqselisWakitxva = () => {
  const [UnicID, setUnicID] = useState(0);

  const [folderPath, setFolderPath] = useState("");
  const [gadanomriliaUNIQID, setGadanomriliaUNIQID] = useState(false);
  const [gadanomrilia, setGadanomrilia] = useState(false);
  const [gadanomriliaFotoebi, setGadanomriliaFotoebi] = useState(false);

  const [photoStartCountingNubmer, setPhotoStartCountingNumber] = useState();
  // const excelFilePath = async (e) => {
  //   try {
  //     const file = e.target.files[0];
  //     if (!file) {
  //       // User canceled file selection
  //       return;
  //     }

  //     const data = await file.arrayBuffer();
  //     const workbook = XLSX.read(data, { type: "array" });
  //     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet);
  //   } catch (error) {
  //     alert("Error reading Excel file:", error);
  //   }
  // };
  const [ExcelPath, setExcelPath] = useState("");
  const [newExcelDestination, setNewExcelDestination] = useState("");
  const [accessFilePath, setAccessFilePath] = useState("");
  const [calcVarjisFarti, setCalcVarjisFarti] = useState(false);
  const [options, setOptions] = useState([]);
  const [etapiOptions, setEtapiOptions] = useState([]);
  const [accessShitName, setAccessShitName] = useState("Mtskheta_Windbreak_State");
  const [projectNameID, setProjectNameID] = useState(0);
  const [etapiID, setEtapiID] = useState(0);
  const [IsDisabledGashvebaButton, setIsDisabledGashvebaButton] =
    useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "https://localhost:7027/GetProjectNamesList";
        const response = await axios.get(apiUrl);
        setOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "https://localhost:7027/GetEtapiIDList";
        const response = await axios.get(apiUrl);
        setEtapiOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setIsDisabledGashvebaButton(true);
      const apiUrl = "https://localhost:7027/ExcelCalculations";
      const payload = {
        UnicIDStartNumber: UnicID,
        ExcelPath: ExcelPath,
        ExcelDestinationPath: newExcelDestination,
        AccessFilePath: accessFilePath,
        ProjectNameID: projectNameID,
        CalcVarjisFartiCheckbox: calcVarjisFarti,
        AccessShitName: accessShitName,
        EtapiID: etapiID,
        FolderPath: folderPath,
        PhotoStartNumber: photoStartCountingNubmer,
        GadanomriliaUNIQID: gadanomriliaUNIQID,
        Gadanomrilia: gadanomrilia,
        GadanomriliaFotoebi: gadanomriliaFotoebi
      };
      const response = await axios.post(apiUrl, payload);
      alert("წარმატებით დასრულდა: " + response.data.message);
      setIsDisabledGashvebaButton(false);
      setLoading(false);
    } catch (error) {
      if (error.response.data.success) {
        alert("წარმატებით დასრულდა");
      } else {
        alert(error.response.data.message);
      }
      setIsDisabledGashvebaButton(false);
      setLoading(false);
    }
  };

  return (
    <div className="Main-for-eqselisWakitxva">
      <div className="obtainer">
        <div className="row-excel1">
          <Link className="back-button" to="/qarsafariNavigator">
            &#8592; უკან
          </Link>
          <label>ამოირჩიეთ ექსელის ფაილი</label>
          <input
            type="text"
            value={ExcelPath}
            onChange={(e) => setExcelPath(e.target.value)}
            placeholder="შეიყვანეთ .xlsx/.xls ფაილის სრული მისამართი სერვერზე"
            title="მიუთითეთ სერვერზე არსებული ექსელის ფაილის სრული მისამართი."
          />
        </div>
        <div className="row-excel1">
          <div>
            <input
              value={calcVarjisFarti}
              onChange={(e) => setCalcVarjisFarti(e.target.checked)}
              type="checkbox"
              id="calcVarjisFartiCheckbox"
            />

            <label htmlFor="calcVarjisFartiCheckbox" style={{ fontSize: "12px" }}>
              დავთვალოთ ვარჯის ფართები ?
            </label>
          </div>
        </div>
        {/* ფოტოების გადანომვრა ექსელის ოლდ უნიქკიდებით */}
        <div>
          <input
            value={gadanomriliaUNIQID}
            onChange={(e) => setGadanomriliaUNIQID(e.target.checked)}
            type="checkbox"
            id="uniqidRenamedCheckbox"
          />

          <label htmlFor="uniqidRenamedCheckbox" style={{ fontSize: "12px" }}>
            გადანომრილია UNIQID
          </label>
        </div>
        
        <div className="row-excel1">
          <label>შეიყვანეთ UNIC-ID საიდანაც უნდა დაიწყოს გადანომვრა</label>
          <input
            placeholder="შეიყვანეთ რიცხვი"
            value={UnicID}
            type="number"
            onChange={(e) => setUnicID(e.target.value)}
            title="გთხოვთ შეიყვანოთ რიცხვი თუ საიდან დაიწყოს გადანომვრა UNIQ-ID სთვის."
          />
        </div>
        <div className="row-excel1">
          <label>
            შეიყანეთ მისამართი სადაც უნდა შეიქმნას
            <br /> ექსელის ახალი ფაილი
          </label>
          <input
            value={newExcelDestination}
            type="text"
            placeholder="შეავსეთ მისამართი"
            onChange={(e) => setNewExcelDestination(e.target.value)}
            title="გთხოვთ შეავსოთ მისამართი რომ გადათვლილი ექსელის ფოლდერი ჩაკოპირდეს."
          />
        </div>

        <div className="row-excel1">
          <label>ამოირჩიეთ access ფაილი</label>
          <input
            type="text"
            value={accessShitName}
            onChange={(e) => setAccessShitName(e.target.value)}
            placeholder="შეიყვანეთ შიტის სახელი"
          />
          <input
            type="text"
            value={accessFilePath}
            onChange={(e) => setAccessFilePath(e.target.value)}
            placeholder="შეიყვანეთ .mdb ფაილის სრული მისამართი"
            title="მიუთითეთ სერვერზე არსებული Access (.mdb) ფაილის სრული მისამართი."
          />
        </div>

        {/* ფოტოების გადანომვრა ექსელის ოლდ უნიქკიდებით */}
        <div>
          <input
            value={gadanomriliaFotoebi}
            onChange={(e) => setGadanomriliaFotoebi(e.target.checked)}
            type="checkbox"
            id="photosRenamedCheckbox"
          />

          <label htmlFor="photosRenamedCheckbox" style={{ fontSize: "12px" }}>
            გადანომრილია ფოტოები
          </label>
        </div>

        {/* Gadanomvra Component */}
        <div className="main-container">
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
                  id="renamedCheckbox"
                />

                <label htmlFor="renamedCheckbox" style={{ fontSize: "12px" }}>
                  გადანომრილია
                </label>
              </div>
            </div>
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
        </div>

        <div className="row-excel1">
          <label>ამოირჩიეთ მუნიციპალიტეტი</label>
          <select
            title="აირჩიეთ მუნიციპალიტეტი"
            onChange={(e) => setProjectNameID(e.target.value)}
          >
            <option value={0}></option>
            {options.map((option) => (
              <option
                title="აირჩიეთ მუნიციპალიტეტი "
                key={option.id}
                value={option.id}
              >
                {option.name}
              </option>
            ))}
          </select>
          <select onChange={(e) => setEtapiID(e.target.value)}>
            <option value={0}></option>
            {etapiOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        {loading && <div className="spinner"></div>}
        <div className="row-excel-buttons">
          <button
            onClick={handleSubmit}
            disabled={IsDisabledGashvebaButton}
            style={{
              backgroundColor:
                IsDisabledGashvebaButton === true ? "gray" : "#4caf50",
            }}
          >
            {" "}
            გაშვება{" "}
          </button>
          <Link className="gadavifiqre-btn" to="/qarsafariNavigator">
            გადავიფიქრე
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EqselisWakitxva;
