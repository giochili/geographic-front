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
        const apiUrl = "https://localhost:7055/getSaxeobaList";
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
        const apiUrl = "https://localhost:7055/GetProjectNamesList";
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
      .post("https://localhost:7055/SaveSaxeobebi", payLoad.DictionaryDTO)
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
      }}
    >
      <h1>სახეობების ცხრილი</h1>

      <div
        style={{
          width: "100%",
          height: "100%",
          overflowX: "hidden",
        }}
      >
        <div style={{ overflow: "auto", display: "flex" }}>
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
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div>
            <p>
              <button id="SaveSaxeobebi" onClick={SaveButton} type="button">
                დამახსოვრება
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaxeobaTable;
