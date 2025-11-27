import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import MDBReader from "mdb-reader";
import "../../Styles/Qarsafari/eqselisWakitxva.css";
import StatusMessage from "../common/StatusMessage";
import ConfirmationModal from "../common/ConfirmationModal";
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
  const [calcVarjisFarti, setCalcVarjisFarti] = useState(true);
  const [options, setOptions] = useState([]);
  const [etapiOptions, setEtapiOptions] = useState([]);
  const [accessShitName, setAccessShitName] = useState("");
  const [accessTables, setAccessTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [projectNameID, setProjectNameID] = useState(0);
  const [etapiID, setEtapiID] = useState(0);
  const [IsDisabledGashvebaButton, setIsDisabledGashvebaButton] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({
    ExcelPath: "",
    UnicID: "",
    newExcelDestination: "",
    accessFilePath: "",
    accessShitName: "",
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
        // Sort options by Georgian alphabet
        const sortedOptions = [...response.data.data].sort((a, b) => 
          (a.name || "").localeCompare(b.name || "", 'ka', { sensitivity: 'base' })
        );
        setOptions(sortedOptions);
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

  // Handle file selection to read .mdb file and extract tables
  const handleAccessFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    // Check if file is .mdb or .accdb
    if (!file.name.match(/\.(mdb|accdb)$/i)) {
      setStatus({
        type: "error",
        text: "გთხოვთ აირჩიოთ .mdb ან .accdb ფაილი",
      });
      return;
    }

    // Set the file path in the input field
    // In Electron, file.path contains the full path; in browser, only file.name is available
    const filePath = file.path || file.name;
    setAccessFilePath(filePath);
    if (touched.accessFilePath) {
      validateField("accessFilePath", filePath);
    }

    setLoadingTables(true);
    setAccessTables([]);
    setAccessShitName("");

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Create MDBReader instance
      const reader = new MDBReader(buffer);
      
      // Get all table names
      const tableNames = reader.getTableNames();
      
      // Filter out system tables (usually start with MSys)
      const userTables = tableNames.filter(name => !name.startsWith('MSys') && !name.startsWith('~'));
      
      console.log("Found tables:", userTables);
      
      setAccessTables(userTables);
    } catch (error) {
      console.error("Error reading Access file:", error);
      setStatus({
        type: "error",
        text: `ფაილის წაკითხვის შეცდომა: ${error.message}`,
      });
      setAccessTables([]);
    } finally {
      setLoadingTables(false);
      // Reset file input so same file can be selected again
      e.target.value = '';
    }
  };

  // Read Access file and extract tables from file path
  const readAccessFileForTables = async (filePath) => {
    setLoadingTables(true);
    setAccessTables([]);
    setAccessShitName("");

    try {
      // In Electron, we can read the file directly
      if (window.require) {
        const fs = window.require('fs');
        const fileBuffer = fs.readFileSync(filePath);
        const buffer = Buffer.from(fileBuffer);
        
        // Create MDBReader instance
        const reader = new MDBReader(buffer);
        
        // Get all table names
        const tableNames = reader.getTableNames();
        
        // Filter out system tables (usually start with MSys)
        const userTables = tableNames.filter(name => !name.startsWith('MSys') && !name.startsWith('~'));
        
        console.log("Found tables:", userTables);
        
        if (userTables.length === 0) {
          setStatus({
            type: "error",
            text: "ცხრილები ვერ მოიძებნა Access ფაილში",
          });
        } else {
          setAccessTables(userTables);
          setStatus({
            type: "success",
            text: `ნაპოვნია ${userTables.length} ცხრილი`,
          });
        }
      }
    } catch (error) {
      console.error("Error reading Access file:", error);
      setStatus({
        type: "error",
        text: `ფაილის წაკითხვის შეცდომა: ${error.message}`,
      });
      setAccessTables([]);
    } finally {
      setLoadingTables(false);
    }
  };


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
        // Only validate if checkbox is NOT checked (field is enabled)
        if (!gadanomriliaUNIQID) {
          if (value && value !== "" && value !== 0) {
            if (isNaN(value) || Number(value) <= 0) {
              error = "UNIC-ID უნდა იყოს დადებითი რიცხვი";
            }
          }
        }
        // If checkbox is checked, no validation needed (field is disabled)
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
        // Only validate if checkbox is NOT checked (field is enabled)
        if (!gadanomriliaFotoebi) {
          if (value && value !== "" && value !== 0) {
            if (isNaN(value) || Number(value) <= 0) {
              error = "ნომერი უნდა იყოს დადებითი რიცხვი";
            }
          }
        }
        // If checkbox is checked, no validation needed (field is disabled)
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
        Gadanomrilia: gadanomriliaUNIQID,
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
              placeholder="შეიყვანეთ .xlsx ფაილის სრული მისამართი"
              title="მიუთითეთ სერვერზე არსებული ექსელის ფაილის სრული მისამართი."
            />
          </div>

          {/* Checkboxes Row */}
          {/* <div className="row-excel1">
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
          </div> */}

          
          
          {/* UNIC-ID Input
          <div className="row-excel1">
            <label>შეიყვანეთ UNIC-ID საიდანაც უნდა დაიწყოს გადანომვრა</label>
            <input
              placeholder={gadanomriliaUNIQID ? "გადანომრილია - არ არის საჭირო" : "შეიყვანეთ რიცხვი"}
              value={UnicID}
              type="number"
              min="1"
              disabled={gadanomriliaUNIQID}
              onChange={(e) => {
                if (!gadanomriliaUNIQID) {
                  setUnicID(e.target.value);
                  if (touched.UnicID) {
                    validateField("UnicID", e.target.value);
                  }
                }
              }}
              onBlur={(e) => {
                if (!gadanomriliaUNIQID) {
                  handleBlur("UnicID", e.target.value);
                }
              }}
              className={errors.UnicID && touched.UnicID && !gadanomriliaUNIQID ? "input-error" : ""}
              title={gadanomriliaUNIQID ? "გადანომრილია UNIQID მონიშნულია - ველი გამორთულია" : "გთხოვთ შეიყვანოთ რიცხვი თუ საიდან დაიწყოს გადანომვრა UNIQ-ID სთვის."}
            />
          </div> */}
          {/* <div className="row-excel1">
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
          </div> */}

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

          {/* Access File - File Selection First */}
          <div className="row-excel1">
            <label>Access ფაილის მისამართი</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                value={accessFilePath}
                onChange={(e) => {
                  setAccessFilePath(e.target.value);
                  if (touched.accessFilePath) {
                    validateField("accessFilePath", e.target.value);
                  }
                  // Clear tables when path changes manually
                  if (accessTables.length > 0) {
                    setAccessTables([]);
                    setAccessShitName("");
                  }
                }}
                onBlur={async (e) => {
                  handleBlur("accessFilePath", e.target.value);
                  // Try to read tables if path is valid and in Electron
                  if (e.target.value && e.target.value.match(/\.(mdb|accdb)$/i) && window.require) {
                    await readAccessFileForTables(e.target.value);
                  }
                }}
                onKeyPress={async (e) => {
                  if (e.key === 'Enter') {
                    // Try to read tables if path is valid and in Electron
                    if (accessFilePath && accessFilePath.match(/\.(mdb|accdb)$/i) && window.require) {
                      await readAccessFileForTables(accessFilePath);
                    }
                  }
                }}
                className={errors.accessFilePath && touched.accessFilePath ? "input-error" : ""}
                placeholder="შეიყვანეთ .mdb ფაილის სრული მისამართი ან აირჩიეთ ფაილი"
                title="მიუთითეთ სერვერზე არსებული Access (.mdb) ფაილის სრული მისამართი ან აირჩიეთ ფაილი ცხრილების სანახავად."
                style={{
                  width: "100%",
                  paddingRight: loadingTables ? "50px" : "120px",
                  padding: "10px 12px",
                  fontSize: "15px",
                  height: "42px",
                  border: errors.accessFilePath && touched.accessFilePath ? "1px solid #dc3545" : "1px solid #bdc3c7",
                  borderRadius: "6px",
                }}
              />
              <div style={{ 
                position: "absolute", 
                right: "5px", 
                top: "50%", 
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                {loadingTables && (
                  <div className="spinner" style={{ width: "20px", height: "20px", marginRight: "5px" }}></div>
                )}
                <label
                  style={{
                    padding: "6px 12px",
                    backgroundColor: loadingTables ? "#ccc" : "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loadingTables ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    margin: 0
                  }}
                >
                  {loadingTables ? "იტვირთება..." : "აირჩიეთ"}
                  <input
                    type="file"
                    accept=".mdb,.accdb"
                    onChange={handleAccessFileChange}
                    disabled={loadingTables}
                    style={{ display: "none" }}
                    title="აირჩიეთ Access ფაილი ცხრილების სანახავად"
                  />
                </label>
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              შეგიძლიათ შეიყვანოთ მისამართი ხელით ან აირჩიოთ ფაილი ცხრილების სანახავად
            </div>
          </div>

          {/* Access Table Selection - After File Selection */}
          <div className="row-excel1">
            <label>Access შიტის სახელი</label>
            {loadingTables ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  value="იტვირთება..."
                  disabled
                  style={{ flex: 1 }}
                />
                <div className="spinner" style={{ width: "20px", height: "20px" }}></div>
              </div>
            ) : (
              <select
                value={accessShitName}
                onChange={(e) => {
                  setAccessShitName(e.target.value);
                  if (touched.accessShitName) {
                    validateField("accessShitName", e.target.value);
                  }
                }}
                onBlur={(e) => handleBlur("accessShitName", e.target.value)}
                className={errors.accessShitName && touched.accessShitName ? "select-error" : ""}
                disabled={accessTables.length === 0}
                style={{
                  padding: "10px 12px",
                  fontSize: "15px",
                  height: "42px",
                  width: "100%",
                  border: errors.accessShitName && touched.accessShitName ? "1px solid #dc3545" : "1px solid #bdc3c7",
                  borderRadius: "6px",
                  backgroundColor: accessTables.length === 0 ? "#f5f5f5" : "#ffffff",
                  color: "#2c3e50",
                  cursor: accessTables.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <option value="">
                  {accessTables.length === 0 
                    ? "ჯერ აირჩიეთ Access ფაილი" 
                    : "აირჩიეთ ცხრილი"}
                </option>
                {accessTables.map((table, index) => (
                  <option key={index} value={table}>
                    {table}
                  </option>
                ))}
              </select>
            )}
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
              <label>საიდან დავიწყოთ ფოტოების გადანომვრა</label>
              <input
                value={photoStartCountingNubmer}
                type="number"
                min="1"
                disabled={gadanomriliaFotoebi}
                placeholder={gadanomriliaFotoebi ? "გადანომრილია - არ არის საჭირო" : "შეიყვანეთ რიცხვი"}
                onChange={(e) => {
                  if (!gadanomriliaFotoebi) {
                    setPhotoStartCountingNumber(e.target.value);
                    if (touched.photoStartCountingNubmer) {
                      validateField("photoStartCountingNubmer", e.target.value);
                    }
                  }
                }}
                onBlur={(e) => {
                  if (!gadanomriliaFotoebi) {
                    handleBlur("photoStartCountingNubmer", e.target.value);
                  }
                }}
                className={errors.photoStartCountingNubmer && touched.photoStartCountingNubmer && !gadanomriliaFotoebi ? "input-error" : ""}
                title={gadanomriliaFotoebi ? "გადანომრილია ფოტოები მონიშნულია - ველი გამორთულია" : "გთხოვთ შეიყვანოთ რიცხვი თუ საიდან დაიწყოს ფოტოების გადანომვრა."}
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
            onClick={handleSubmitClick}
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
    </div>
  );
};

export default EqselisWakitxva;
