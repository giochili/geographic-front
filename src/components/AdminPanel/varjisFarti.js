import React, { useEffect, useReducer, useState } from "react";
import SideBarPanel from "./sideBarPanel";
import "../../components/ReactTable/Styles.css";
// import "../../Styles/AdminPanel/varjisfarti.css";
import makeData from "../ReactTable/makeData";
import Table from "../../components/ReactTable/Table";
import { randomColor, shortId } from "../../components/ReactTable/utils";
import axios from "axios";
import SaxeobaTable from "./saxeobebiTable";
function reducer(state, action) {
  switch (action.type) {
    case "add_option_to_column":
      const optionIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, optionIndex),
          {
            ...state.columns[optionIndex],
            options: [
              ...state.columns[optionIndex].options,
              { label: action.option, backgroundColor: action.backgroundColor },
            ],
          },
          ...state.columns.slice(optionIndex + 1, state.columns.length),
        ],
      };
    case "add_row":
      return {
        ...state,
        skipReset: true,
        data: [...state.data, {}],
      };
    case "update_column_type":
      const typeIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      switch (action.dataType) {
        case "number":
          if (state.columns[typeIndex].dataType === "number") {
            return state;
          } else {
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              data: state.data.map((row) => ({
                ...row,
                [action.columnId]: isNaN(row[action.columnId])
                  ? ""
                  : Number.parseInt(row[action.columnId]),
              })),
            };
          }
        case "select":
          if (state.columns[typeIndex].dataType === "select") {
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              skipReset: true,
            };
          } else {
            let options = [];
            state.data.forEach((row) => {
              if (row[action.columnId]) {
                options.push({
                  label: row[action.columnId],
                  backgroundColor: randomColor(),
                });
              }
            });
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                {
                  ...state.columns[typeIndex],
                  dataType: action.dataType,
                  options: [...state.columns[typeIndex].options, ...options],
                },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              skipReset: true,
            };
          }
        case "text":
          if (state.columns[typeIndex].dataType === "text") {
            return state;
          } else if (state.columns[typeIndex].dataType === "select") {
            return {
              ...state,
              skipReset: true,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
            };
          } else {
            return {
              ...state,
              skipReset: true,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              data: state.data.map((row) => ({
                ...row,
                [action.columnId]: row[action.columnId] + "",
              })),
            };
          }
        default:
          return state;
      }
    case "update_column_header":
      const index = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, index),
          { ...state.columns[index], label: action.label },
          ...state.columns.slice(index + 1, state.columns.length),
        ],
      };
    case "update_cell":
      return {
        ...state,
        skipReset: true,
        data: state.data.map((row, index) => {
          if (index === action.rowIndex) {
            return {
              ...state.data[action.rowIndex],
              [action.columnId]: action.value,
            };
          }
          return row;
        }),
      };
    case "add_column_to_left":
      const leftIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      let leftId = shortId();
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, leftIndex),
          {
            id: leftId,
            label: "Column",
            accessor: leftId,
            dataType: "text",
            created: action.focus && true,
            options: [],
          },
          ...state.columns.slice(leftIndex, state.columns.length),
        ],
      };
    case "add_column_to_right":
      const rightIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      const rightId = shortId();
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, rightIndex + 1),
          {
            id: rightId,
            label: "Column",
            accessor: rightId,
            dataType: "text",
            created: action.focus && true,
            options: [],
          },
          ...state.columns.slice(rightIndex + 1, state.columns.length),
        ],
      };
    case "delete_column":
      const deleteIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, deleteIndex),
          ...state.columns.slice(deleteIndex + 1, state.columns.length),
        ],
      };
    case "enable_reset":
      return {
        ...state,
        skipReset: false,
      };
    case "UPDATE_DATA":
      return {
        ...state,
        data: action.payload, // Update the data in the state with the payload
      };
    default:
      return state;
  }
}

function VarjisFarti() {
  //const [state, dispatch] = useReducer(reducer, makeData(1));
  // Define initial state
  const [saxeobaDataList, setSaxeobaDataList] = useState([]);
  const [projectNameID, setProjectNameID] = useState(1500); // projectNameID გვჭირდება პოსტში გადასატანად
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  let columns = [
    {
      id: "id",
      label: "აიდი",
      accessor: "id",
      minWidth: 100,
      dataType: "text",
      options: [],
    },
    {
      id: "name",
      label: "სახეობა",
      accessor: "name",
      minWidth: 100,
      dataType: "text",
      options: [],

      Cell: ({ row }) => {
        // State to store the options for the select dropdown
        const [options, setOptions] = useState([]);
        const [selectedValue, setSelectedValue] = useState(row.original.name);

        useEffect(() => {
          setSelectedValue(row.original.name);
        }, [row.original.name]);

        const handleChange = (event) => {
          setSelectedValue(event.target.value);
          var selectedindex = event.target.selectedOptions[0].id;
          row.original.saxeobaId = selectedindex;
          row.original.areaNameId = document.getElementById(
            "projectNameIDselector"
          ).value;
          console.log(projectNameID);
        };
        // Fetch the data for the select dropdown
        useEffect(() => {
          const fetchData = async () => {
            try {
              const apiUrl = `${API_BASE_URL}/getSaxeobaList`;
              const response = await axios.get(apiUrl);
              setOptions(response.data.data);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };

          fetchData();
        }, []); // Run only once on component mount

        return (
          <select
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              margin: "5px",
              fontSize: "16px",
              paddingLeft: "10px",
            }}
            value={selectedValue}
            onChange={handleChange}
          >
            <option value={0}> </option>
            {options.map((option) => (
              <option id={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      id: "saxeobaId",
      label: "სახეობააიდი",
      accessor: "saxeobaId",
      minWidth: 100,
      dataType: "text",
      options: [],
    },
    {
      id: "areaNameId",
      label: "არეანეიმაიდი",
      accessor: "areaNameId",
      minWidth: 100,
      dataType: "text",
      options: [],
    },
    {
      id: "varjisFarti1",
      label: "ვარჯისფართი",
      accessor: "varjisFarti1",
      minwidth: 80,
      dataType: "number",
      options: [],
    },
    {
      id: "delete",
      label: "",
      accessor: "delete",
      width: 80,
      dataType: "number",
      options: [],

      Cell: ({ row }) => {
        const handleDeleteVarjisFarti = async () => {
          const confirmed = window.confirm(
            "დარწმუნებული ხართ რომ გსურთ წაშლა ?"
          );

          if (confirmed) {
            const apiUrl = `${API_BASE_URL}/DeleteVarjisfarti`;
            const payLoad = {
              id: row.original.id,
              name: row.original.name,
              saxeobaId: row.original.saxeobaId,
              areaNameId: row.original.areaNameId,
              varjisFarti1: row.original.varjisFarti1,
            };
            try {
              const response = await axios.post(apiUrl, payLoad);
              if (response.status === 200) {
                window.location.reload();
              } else {
                console.error("მოხდა შეცდომა!");
              }
            } catch (error) {
              console.error("აღმოჩენილია შეცდომა", error);
            }
          }
        };
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              margin: "5px",
            }}
          >
            <button
              style={{ backgroundColor: "red" }}
              onClick={handleDeleteVarjisFarti}
            >
              წაშლა
            </button>
          </div>
        );
      },
    },
  ];

  let row = {
    id: 0,
    name: "",
    varjisFarti: "",
  };
  const initialState = {
    data: [row], // Initial data as an empty array
    columns: columns,
    // Add other state properties if needed
  };

  const [state, dispatch] = useReducer(reducer, initialState); // ამას იმისთვის ვაკეთებთ რომ თავიდან სთეითში დატა იყოს ცარიელი ცხრილი რომ დახატოს
  const [options, setOptions] = useState([]);

  const [data, setData] = useState([]); //ეს იქმნება იმისთვის რომ გადააწოდოს ბაზას ცხრილი რომელიც რედაქტირდა ან შეიცვალა
  //პროექტის სახელების დროფდაუნის ცვლილება
  const handleProjectNameChange = async (e) => {
    var projectID = e.target.value;
    setProjectNameID(projectID);

    //state.columns = columns;
    try {
      const apiUrl = `${API_BASE_URL}/GetVarjisFartebiList`;
      const response = await axios.get(apiUrl, {
        params: {
          AreaNameID: projectID,
        },
      });
      //დისპაჩი აკეთებს data ში ენდფოინთის შედეგის ჩაწერას
      dispatch({ type: "UPDATE_DATA", payload: response.data.data });
      //makeData(5, response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //ამას მოაქვს პროექტების ლისტი
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
    dispatch({ type: "enable_reset" });
  }, [state.data, state.columns]);
  const handleButtonSave = () => {
    console.log(state.data);
    // Make the POST request to your API endpoint

    const payLoad = {
      varjisFartiDTO: state.data.map((item) => ({
        ID: item.id,
        Name: item.name,
        SaxeobaId: item.saxeobaId,
        AreaNameId: item.areaNameId,
        VarjisFarti1: item.varjisFarti1,
      })),
    };
    axios
      .post(`${API_BASE_URL}SaveVarjisFarti`, payLoad.varjisFartiDTO)
      .then((response) => {
        // Assuming the response.data is the updated list
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error while saving:", error);
      });
  };
  return (
    <div className="Main-Container">
      <SideBarPanel />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          width: "100%",
          height: "100vh",
          padding: "20px 150px",
          backgroundColor: "lightsteelblue",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Container for side-by-side layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "100px",
            width: "100%",
            height: "100%",
            alignItems: "stretch",
            flexWrap: "wrap",
            overflow: "hidden",
          }}
        >
          {/* First Section: ვარჯის ფართები პროექტის სახელის მიხედვით */}
          <div
            style={{
              flex: "1 1 calc(50% - 200px)",
              minWidth: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              height: "100%",
              backgroundColor: "lightsteelblue",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: "25px",
                paddingBottom: "15px",
                borderBottom: "2px solid #ecf0f1",
                flexWrap: "wrap",
                gap: "15px",
                flexShrink: 0,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#2c3e50",
                }}
              >
                ვარჯის ფართები პროექტის სახელის მიხედვით
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
                maxWidth: "500px",
                marginBottom: "30px",
                marginLeft: "auto",
                marginRight: "auto",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                flexShrink: 0,
              }}
            >
              <label
                style={{
                  fontWeight: 600,
                  color: "#1a252f",
                  fontSize: "16px",
                  marginBottom: "4px",
                }}
              >
                ამოირჩიეთ პროექტის დასახელება
              </label>
              <select
                style={{
                  padding: "10px 12px",
                  fontSize: "15px",
                  height: "42px",
                  width: "100%",
                  border: "1px solid #bdc3c7",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  color: "#2c3e50",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  fontFamily: "inherit",
                }}
                id="projectNameIDselector"
                title="აირჩიეთ პროექტის დასახელება"
                onChange={(e) => handleProjectNameChange(e)}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3498db";
                  e.target.style.boxShadow = "0 0 0 2px rgba(52, 152, 219, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#bdc3c7";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value={0}>აირჩიეთ პროექტი...</option>
                {options.map((option) => (
                  <option
                    title="აირჩიეთ პროექტის დასახელება "
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div
              style={{
                width: "100%",
                flex: "1 1 auto",
                overflow: "auto",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ overflow: "auto", display: "flex", flex: "1 1 auto", justifyContent: "center" }}>
                <div
                  style={{
                    flex: "1 1 auto",
                    padding: "1rem",
                    maxWidth: 500,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Table
                    columns={state.columns}
                    data={state.data}
                    dispatch={dispatch}
                    skipReset={state.skipReset}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid #ecf0f1",
                }}
              >
                <button
                  onClick={handleButtonSave}
                  type="button"
                  style={{
                    padding: "12px 30px",
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 600,
                    transition: "background-color 0.3s, transform 0.1s",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#45a049";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#4caf50";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseDown={(e) => {
                    e.target.style.transform = "translateY(0)";
                  }}
                  onMouseUp={(e) => {
                    e.target.style.transform = "translateY(-1px)";
                  }}
                >
                  შენახვა
                </button>
              </div>
            </div>
          </div>

          {/* Second Section: სახეობების ცხრილი */}
          <div
            style={{
              flex: "1 1 calc(50% - 700px)",
              minWidth: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              height: "100%",
              backgroundColor: "lightsteelblue",
            }}
          >
            <SaxeobaTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VarjisFarti;
