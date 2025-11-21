import React, { useEffect, useReducer, useState } from "react";
import "../../components/ReactTable/Styles.css";
import "../../Styles/AdminPanel/varjisfarti.css";
import makeData from "../ReactTable/makeData";
import Table from "../../components/ReactTable/Table";
import { randomColor, shortId } from "../../components/ReactTable/utils";
import axios from "axios";

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

const SaxeobaTable = () => {
  const [projectNameID, setProjectNameID] = useState(1500);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  let columns = [
    {
      id: "name",
      label: "სახეობა",
      accessor: "name",
      minWidth: 100,
      dataType: "text",
      options: [],
    },
    {
      id: "code",
      label: "კოუდი",
      accessor: "code",
      minWidth: 100,
      dataType: "text",
      options: [],
      Cell: ({ row }) => {
        // State to store the options for the select dropdown
        const [selectedValue, setSelectedValue] = useState(row.original.code);
        console.log(row.original);
        useEffect(() => {
          row.original.code = 1;
        }, [row.original.code]);

        return <p>{row.original.code}</p>;
      },
    },
  ];

  let row = {
    id: 0,
    name: "",
    code: "",
  };
  const initialState = {
    data: [row], // Initial data as an empty array
    columns: columns,
    // Add other state properties if needed
  };
  const [state, dispatch] = useReducer(reducer, initialState); // ამას იმისთვის ვაკეთებთ რომ თავიდან სთეითში დატა იყოს ცარიელი ცხრილი რომ დახატოს

  const [options, setOptions] = useState([]);

  const [data, setData] = useState([]); //ეს იქმნება იმისთვის რომ გადააწოდოს ბაზას ცხრილი რომელიც რედაქტირდა ან შეიცვალა

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${API_BASE_URL}/getSaxeobaList`;
        const response = await axios.get(apiUrl);
        //დისპაჩი აკეთებს data ში ენდფოინთის შედეგის ჩაწერას
        dispatch({ type: "UPDATE_DATA", payload: response.data.data });
        //makeData(5, response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
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
  const SaveButton = () => {
    console.log(state.data);
    // Make the POST request to your API endpoint

    const payLoad = {
      DictionaryDTO: state.data.map((item) => ({
        ID: item.id,
        Name: item.name,
        Code: 1,
      })),
    };
    axios
      .post(`${API_BASE_URL}/SaveSaxeobebi`, payLoad.DictionaryDTO)
      .then((response) => {
        // Assuming the response.data is the updated list
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error while saving:", error);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        objectFit: "fill",
        width: "100%",
        height: "100%",
        overflow: "hidden",
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
          სახეობების ცხრილი
        </h1>
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
            id="SaveSaxeobebi"
            onClick={SaveButton}
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
            დამახსოვრება
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaxeobaTable;
