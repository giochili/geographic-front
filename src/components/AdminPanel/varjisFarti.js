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
              const apiUrl = "https://localhost:7027/getSaxeobaList";
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
            const apiUrl = "https://localhost:7027/DeleteVarjisfarti";
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
      const apiUrl = "https://localhost:7027/GetVarjisFartebiList";
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
      .post("https://localhost:7027/SaveVarjisFarti", payLoad.varjisFartiDTO)
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

      <div className="row-excel">
        <h1
          style={{
            marginBottom: "20px",
          }}
        >
          ვარჯის ფართები პროექტის სახელის მიხედვით
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <label>ამოირჩიეთ პროექტის დასახელება</label>
          <select
            style={{
              paddingLeft: "10px",
              fontSize: "16px",
              height: "35px",
              minWidth: "150px",
            }}
            id="projectNameIDselector"
            title="აირჩიეთ პროექტის დასახელება"
            onChange={(e) => handleProjectNameChange(e)}
          >
            <option value={0}></option>
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
            height: "100%",
            overflowX: "hidden",
          }}
        >
          {/* <div
            style={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          ></div> */}
          <div
            style={{
              flex: "1 1 auto",
              padding: "1rem",
              maxWidth: 500,
              // marginLeft: "auto",
              // marginRight: "auto",
            }}
          >
            <Table
              columns={state.columns}
              data={state.data}
              dispatch={dispatch}
              skipReset={state.skipReset}
            />
          </div>
          <div
            style={{
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div>
              <p>
                <button onClick={handleButtonSave} type="button">
                  შენახვა
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row-excel">
        <SaxeobaTable>{/* Table content goes here */}</SaxeobaTable>
      </div>
    </div>
  );
}

export default VarjisFarti;
