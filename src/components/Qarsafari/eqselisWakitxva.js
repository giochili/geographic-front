import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import "../../Styles/Qarsafari/eqselisWakitxva.css";
import StatusMessage from "../common/StatusMessage";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";

const EqselisWakitxva = () => {

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [UnicID, setUnicID] = useState(1);
  const [folderPath, setFolderPath] = useState("");
  const [gadanomriliaUNIQID, setGadanomriliaUNIQID] = useState(false);
  const [gadanomrilia, setGadanomrilia] = useState(false);
  const [gadanomriliaFotoebi, setGadanomriliaFotoebi] = useState(false);

  const [photoStartCountingNubmer, setPhotoStartCountingNumber] = useState(1);
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
  const [status, setStatus] = useState(null);
  
  // Validation states
  const [errors, setErrors] = useState({
    ExcelPath: "",
    UnicID: "",
    newExcelDestination: "",
    accessFilePath: "",
    folderPath: "",
    photoStartCountingNubmer: "",
    projectNameID: "",
    accessShitName: "",
  });
  const [touched, setTouched] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${API_BASE_URL}/GetProjectNamesList`;
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
        const apiUrl = `${API_BASE_URL}/GetEtapiIDList`;
        const response = await axios.get(apiUrl);
        setEtapiOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  
  // Re-validate fields when checkbox states change
  useEffect(() => {
    if (touched.UnicID) {
      validateField("UnicID", UnicID);
    }
  }, [gadanomriliaUNIQID]);
  
  useEffect(() => {
    if (touched.folderPath) {
      validateField("folderPath", folderPath);
    }
    if (touched.photoStartCountingNubmer) {
      validateField("photoStartCountingNubmer", photoStartCountingNubmer);
    }
  }, [gadanomriliaFotoebi, gadanomrilia]);

  const validateField = (fieldName, value) => {
    let error = "";
    
    switch (fieldName) {
      case "ExcelPath":
        if (!value || value.trim() === "") {
          error = "ექსელის ფაილის მისამართი აუცილებელია";
        } else if (!value.match(/\.(xlsx|xls)$/i)) {
          error = "ფაილი უნდა იყოს .xlsx ფორმატის";
        }
        break;
      
      case "UnicID":
        if (gadanomriliaUNIQID) {
          if (!value || value === "" || value === 0) {
            error = "UNIC-ID აუცილებელია როცა 'გადანომრილია UNIQID' მონიშნულია";
          } else if (isNaN(value) || Number(value) <= 0) {
            error = "UNIC-ID უნდა იყოს დადებითი რიცხვი";
          }
        } else {
          if (value && value !== "" && value !== 0) {
            if (isNaN(value) || Number(value) <= 0) {
              error = "UNIC-ID უნდა იყოს დადებითი რიცხვი";
            }
          }
        }
        break;
      
      case "newExcelDestination":
        if (!value || value.trim() === "") {
          error = "ახალი ექსელის მისამართი აუცილებელია";
        }
        break;
      
      case "accessFilePath":
        if (!value || value.trim() === "") {
          error = "Access ფაილის მისამართი აუცილებელია";
        } else if (!value.match(/\.(mdb|accdb)$/i)) {
          error = "ფაილი უნდა იყოს .mdb ან .accdb ფორმატის";
        }
        break;
      
      case "folderPath":
        if (gadanomrilia || gadanomriliaFotoebi) {
          if (!value || value.trim() === "") {
            error = "ფოლდერის მისამართი აუცილებელია როცა გადანომვრა მონიშნულია";
          }
        }
        break;
      
      case "photoStartCountingNubmer":
        if (gadanomriliaFotoebi) {
          if (!value || value === "" || value === 0) {
            error = "ფოტოების დაწყების ნომერი აუცილებელია როცა 'გადანომრილია ფოტოები' მონიშნულია";
          } else if (isNaN(value) || Number(value) <= 0) {
            error = "ნომერი უნდა იყოს დადებითი რიცხვი";
          }
        } else {
          if (value && value !== "" && value !== 0) {
            if (isNaN(value) || Number(value) <= 0) {
              error = "ნომერი უნდა იყოს დადებითი რიცხვი";
            }
          }
        }
        break;
      
      case "projectNameID":
        if (!value || value === 0 || value === "0") {
          error = "მუნიციპალიტეტი აუცილებელია";
        }
        break;
      
      case "accessShitName":
        if (!value || value.trim() === "") {
          error = "Access შიტის სახელი აუცილებელია";
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
      { name: "ExcelPath", value: ExcelPath },
      { name: "UnicID", value: UnicID },
      { name: "newExcelDestination", value: newExcelDestination },
      { name: "accessFilePath", value: accessFilePath },
      { name: "folderPath", value: folderPath },
      { name: "photoStartCountingNubmer", value: photoStartCountingNubmer },
      { name: "projectNameID", value: projectNameID },
      { name: "accessShitName", value: accessShitName },
    ];

    let isValid = true;
    fieldsToValidate.forEach(({ name, value }) => {
      if (!validateField(name, value)) {
        isValid = false;
      }
    });

    setTouched({
      ExcelPath: true,
      UnicID: true,
      newExcelDestination: true,
      accessFilePath: true,
      folderPath: true,
      photoStartCountingNubmer: true,
      projectNameID: true,
      accessShitName: true,
    });

    return isValid;
  };

  const handleBlur = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

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
    
    try {
      setLoading(true);
      setIsDisabledGashvebaButton(true);
      const apiUrl = `${API_BASE_URL}/ExcelCalculations`;
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
        GadanomriliaFotoebi: gadanomriliaFotoebi,
      };
      const response = await axios.post(apiUrl, payload);
      setStatus({
        type: "success",
        text: response.data.message || "ოპერაცია წარმატებით დასრულდა.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text: getFriendlyErrorMessage(
          error,
          "დაფიქსირდა შეცდომა. გთხოვთ გადაამოწმოთ მონაცემები და სცადოთ ხელახლა."
        ),
      });
    } finally {
      setIsDisabledGashvebaButton(false);
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header">
        მეორე ეტაპი II
      </header>
      <Link className="back-button" to="/etapiOriNavigator">
        &#8592; უკან
      </Link>
      <div className="Main-for-eqselisWakitxva">
        <div className="obtainer">
          {/* Excel Path - Full Width */}
          <div className="row-excel1 full-width">
            <label>ამოირჩიეთ ექსელის ფაილი</label>
            <input
              type="text"
              value={ExcelPath}
              onChange={(e) => {
                setExcelPath(e.target.value);
                if (touched.ExcelPath) {
                  validateField("ExcelPath", e.target.value);
                }
              }}
              onBlur={(e) => handleBlur("ExcelPath", e.target.value)}
              className={errors.ExcelPath && touched.ExcelPath ? "input-error" : ""}
              placeholder="შეიყვანეთ .xlsx ფაილის სრული მისამართი სერვერზე"
              title="მიუთითეთ სერვერზე არსებული ექსელის ფაილის სრული მისამართი."
            />
          </div>

          {/* Checkboxes Row */}
          <div className="row-excel1">
            <div className="checkbox-group">
              <input
                value={calcVarjisFarti}
                onChange={(e) => setCalcVarjisFarti(e.target.checked)}
                type="checkbox"
                id="calcVarjisFartiCheckbox"
              />
              <label htmlFor="calcVarjisFartiCheckbox">
                დავთვალოთ ვარჯის ფართები ?
              </label>
            </div>
          </div>

          <div className="row-excel1">
            <div className="checkbox-group">
              <input
                value={gadanomriliaUNIQID}
                onChange={(e) => {
                  setGadanomriliaUNIQID(e.target.checked);
                  if (touched.UnicID) {
                    validateField("UnicID", UnicID);
                  }
                }}
                type="checkbox"
                id="uniqidRenamedCheckbox"
              />
              <label htmlFor="uniqidRenamedCheckbox">
                გადანომრილია UNIQID
              </label>
            </div>
          </div>
          
          {/* UNIC-ID Input */}
          <div className="row-excel1">
            <label>შეიყვანეთ UNIC-ID საიდანაც უნდა დაიწყოს გადანომვრა</label>
            <input
              placeholder="შეიყვანეთ რიცხვი"
              value={UnicID}
              type="number"
              min="1"
              onChange={(e) => {
                setUnicID(e.target.value);
                if (touched.UnicID) {
                  validateField("UnicID", e.target.value);
                }
              }}
              onBlur={(e) => handleBlur("UnicID", e.target.value)}
              className={errors.UnicID && touched.UnicID ? "input-error" : ""}
              title="გთხოვთ შეიყვანოთ რიცხვი თუ საიდან დაიწყოს გადანომვრა UNIQ-ID სთვის."
            />
          </div>

          {/* Excel Destination - Full Width */}
          <div className="row-excel1 full-width">
            <label>შეიყანეთ მისამართი სადაც უნდა შეიქმნას ექსელის ახალი ფაილი</label>
            <input
              value={newExcelDestination}
              type="text"
              placeholder="შეავსეთ მისამართი"
              onChange={(e) => {
                setNewExcelDestination(e.target.value);
                if (touched.newExcelDestination) {
                  validateField("newExcelDestination", e.target.value);
                }
              }}
              onBlur={(e) => handleBlur("newExcelDestination", e.target.value)}
              className={errors.newExcelDestination && touched.newExcelDestination ? "input-error" : ""}
              title="გთხოვთ შეავსოთ მისამართი რომ გადათვლილი ექსელის ფოლდერი ჩაკოპირდეს."
            />
          </div>

          {/* Access File - Two Columns */}
          <div className="row-excel1">
            <label>Access შიტის სახელი</label>
            <input
              type="text"
              value={accessShitName}
              onChange={(e) => {
                setAccessShitName(e.target.value);
                if (touched.accessShitName) {
                  validateField("accessShitName", e.target.value);
                }
              }}
              onBlur={(e) => handleBlur("accessShitName", e.target.value)}
              className={errors.accessShitName && touched.accessShitName ? "input-error" : ""}
              placeholder="შეიყვანეთ შიტის სახელი"
            />
          </div>

          <div className="row-excel1">
            <label>Access ფაილის მისამართი</label>
            <input
              type="text"
              value={accessFilePath}
              onChange={(e) => {
                setAccessFilePath(e.target.value);
                if (touched.accessFilePath) {
                  validateField("accessFilePath", e.target.value);
                }
              }}
              onBlur={(e) => handleBlur("accessFilePath", e.target.value)}
              className={errors.accessFilePath && touched.accessFilePath ? "input-error" : ""}
              placeholder="შეიყვანეთ .mdb ფაილის სრული მისამართი"
              title="მიუთითეთ სერვერზე არსებული Access (.mdb) ფაილის სრული მისამართი."
            />
          </div>

          {/* Photo Checkbox */}
          <div className="row-excel1">
            <div className="checkbox-group">
              <input
                value={gadanomriliaFotoebi}
                onChange={(e) => {
                  setGadanomriliaFotoebi(e.target.checked);
                  if (touched.folderPath) {
                    validateField("folderPath", folderPath);
                  }
                  if (touched.photoStartCountingNubmer) {
                    validateField("photoStartCountingNubmer", photoStartCountingNubmer);
                  }
                }}
                type="checkbox"
                id="photosRenamedCheckbox"
              />
              <label htmlFor="photosRenamedCheckbox">
                გადანომრილია ფოტოები
              </label>
            </div>
          </div>

          {/* Gadanomvra Section - Full Width */}
          <div className="row-excel1 full-width">
            <div className="row">
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
              />
            </div>
            <div className="row">
              <div className="checkbox-group">
                <input
                  value={gadanomrilia}
                  onChange={(e) => {
                    setGadanomrilia(e.target.checked);
                    if (touched.folderPath) {
                      validateField("folderPath", folderPath);
                    }
                  }}
                  type="checkbox"
                  id="renamedCheckbox"
                />
                <label htmlFor="renamedCheckbox">
                  გადანომრილია
                </label>
              </div>
            </div>
            <div className="row">
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
          </div>

          {/* Municipality and Etapi - Two Columns */}
          <div className="row-excel1">
            <label>ამოირჩიეთ მუნიციპალიტეტი</label>
            <select
              title="აირჩიეთ მუნიციპალიტეტი"
              value={projectNameID}
              onChange={(e) => {
                setProjectNameID(e.target.value);
                if (touched.projectNameID) {
                  validateField("projectNameID", e.target.value);
                }
              }}
              onBlur={(e) => handleBlur("projectNameID", e.target.value)}
              className={errors.projectNameID && touched.projectNameID ? "select-error" : ""}
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
          </div>

          <div className="row-excel1">
            <label>ეტაპი</label>
            <select value={84} disabled>
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
            disabled={IsDisabledGashvebaButton || loading}
            style={{
              backgroundColor:
                IsDisabledGashvebaButton === true || loading
                  ? "gray"
                  : "#4caf50",
            }}
          >
            {loading ? "მუშავდება..." : "გაშვება"}
          </button>
          <Link className="gadavifiqre-btn" to="/etapiOriNavigator">
            გადავიფიქრე
          </Link>
        </div>
        <StatusMessage status={status} />
      </div>
    </div>
    </div>
  );
};

export default EqselisWakitxva;
