import Table from "../../ReactTable/Table";
import React, { useEffect, useReducer, useState } from "react";
import { randomColor, shortId } from "../../../components/ReactTable/utils";
import axios from "axios";
import "../../../Styles/AdminPanel/Loader.css";

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

const ColumnNameTable = (ExcelOptions) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "https://localhost:7027/GetSQLColumnNamesList";
        const response = await axios.get(apiUrl);

        if (ExcelOptions.ExcelOptions.length > 0) {
          await response.data.data.forEach((person, index) => {
            let copyFromPerson = ExcelOptions.ExcelOptions.find(
              (ele) => ele.excelName === person.excelName
            );
            if (copyFromPerson) person.colN = copyFromPerson.colN;
          });

          // // Assuming response.data.data is an array of objects with a common identifier
          // const updatedData = response.data.data.map((item) => {
          //   const matchingExcelOption = ExcelOptions.find(
          //     (option) => option.excelName === item.excelName
          //   );
          //   if (matchingExcelOption) {
          //     return { ...item, coln: matchingExcelOption.coln };
          //   }
          //   return item;
          // });

          //დისპაჩი აკეთებს data ში ენდფოინთის შედეგის ჩაწერას
          dispatch({ type: "UPDATE_DATA", payload: response.data.data });
        } else {
          //დისპაჩი აკეთებს data ში ენდფოინთის შედეგის ჩაწერას
          dispatch({ type: "UPDATE_DATA", payload: response.data.data });
        }
        //makeData(5, response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      id: "sqlname",
      label: "sqlname",
      accessor: "sqlname",
      minWidth: 250,
      dataType: "text",
      options: [],
    },
    {
      id: "ExcelName",
      label: "ExcelName",
      accessor: "ExcelName",
      minWidth: 100,
      dataType: "text",
      options: [],
      Cell: ({ row }) => {
        const [options, setOptions] = useState([]);
        const handleChange = (event) => {
          setSelectedValue(event.target.value);
          row.original.excelName = event.target.value;
          var ColnOnChange = "";

          if (ExcelOptions.ExcelOptions.length > 0) {
            ColnOnChange = ExcelOptions.ExcelOptions.find(
              (ele) => ele.excelName === event.target.value
            ).colN;
          } else {
            ColnOnChange = options.find(
              (ele) => ele.excelName === event.target.value
            ).colN;
          }

          row.original.colN = ColnOnChange;
        };

        const [selectedValue, setSelectedValue] = useState(
          row.original.excelName
        );
        useEffect(() => {
          setSelectedValue(row.original.excelName);
        }, [row.original.excelName]);
        useEffect(() => {
          const fetchData = async () => {
            try {
              const apiUrl = "https://localhost:7027/GetSQLColumnNamesList";
              const response = await axios.get(apiUrl);
              const filteredData = response.data.data.filter((item) => {
                return item.excelName !== null;
              });
              setOptions(filteredData);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
          fetchData();
        }, []);
        return (
          <select
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              margin: "5px",
            }}
            value={selectedValue}
            onChange={handleChange}
          >
            <option value={0}></option>

            {ExcelOptions.ExcelOptions.length > 0
              ? ExcelOptions.ExcelOptions.map((option) => (
                  <option
                    key={option.excelName}
                    title={option.colN}
                    value={option.excelName}
                  >
                    {option.excelName}
                  </option>
                ))
              : options.map((option) => (
                  <option
                    key={option.id}
                    title={option.colN}
                    value={option.excelName}
                  >
                    {option.excelName}
                  </option>
                ))}
          </select>
        );
      },
    },

    {
      id: "AccessName",
      label: "AccessName",
      accessor: "accessName",
      minWidth: 100,
      dataType: "text",
      options: [],
      Cell: ({ row }) => {
        const [accessOptions, setAccessOptions] = useState([]);
        const handleChange = (event) => {
          setSelectedValue(event.target.value);
          row.original.accessName = event.target.value;
        };

        const [selectedValue, setSelectedValue] = useState(
          row.original.accessName
        );
        useEffect(() => {
          setSelectedValue(row.original.accessName);
        }, [row.original.accessName]);
        useEffect(() => {
          const fetchData = async () => {
            try {
              const apiUrl = "https://localhost:7027/GetSQLColumnNamesList";
              const response = await axios.get(apiUrl);
              const filteredData = response.data.data.filter((item) => {
                return item.accessName !== null;
              });
              setAccessOptions(filteredData);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
          fetchData();
        }, []);
        return (
          <select
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              margin: "5px",
            }}
            value={selectedValue}
            onChange={handleChange}
          >
            <option value={0}></option>

            {ExcelOptions.AccessOptions.length > 0
              ? ExcelOptions.AccessOptions.map((option) => (
                  <option key={option.accessName} value={option.accessName}>
                    {option.accessName}
                  </option>
                ))
              : accessOptions.map((option) => (
                  <option key={option.id} value={option.accessName}>
                    {option.accessName}
                  </option>
                ))}
          </select>
        );
      },
    },
    {
      id: "IsAccessToExcel",
      label: "IsAccessToExcel",
      accessor: "IsAccessToExcel",
      maxWidth: 140,
      dataType: "checkbox",
      options: [],
      Cell: ({ row }) => {
        const [sQLColumnNamesList, setSQLColumnNamesList] = useState();

        const handleChangeCheckbox = (event) => {
          setSelectedValue(event.target.value);
          row.original.isAccessToExcel = event.target.checked;
        };
        const [selectedValue, setSelectedValue] = useState(
          row.original.isAccessToExcel
        );
        useEffect(() => {
          setSelectedValue(row.original.isAccessToExcel);
        }, [row.original.isAccessToExcel]);
        useEffect(() => {
          const fetchData = async () => {
            try {
              const apiUrl = "https://localhost:7027/GetSQLColumnNamesList";
              const response = await axios.get(apiUrl);
              const filteredData = response.data.data.filter((item) => {
                return item.accessName !== null;
              });
              setSQLColumnNamesList(filteredData);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
          fetchData();
        }, []);

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <input
              type="checkbox"
              checked={selectedValue}
              onChange={handleChangeCheckbox}
            />
          </div>
        );
      },
    },
    {
      id: "Sort",
      label: "Sort",
      accessor: "Sort",
      minWidth: 100,
      dataType: "text",
      options: [],
    },
    {
      id: "dataType",
      label: "DataType",
      accessor: "dataType",
      minWidth: 100,
      dataType: "text",
      options: [],
      Cell: ({ row }) => {
        const [selectedValue, setSelectedValue] = useState(false);

        const handleDataTypeChange = (event) => {
          setSelectedValue(event.target.value);
          row.original.dataType = event.target.value;
        };

        // Conditionally render the dropdown only for new rows
        if (!row.original.id) {
          return (
            <select
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                margin: "5px",
              }}
              value={selectedValue}
              onChange={handleDataTypeChange}
            >
              <option value=""></option>
              <option value="ტექსტური">ტექსტური</option>
              <option value="რიცხვითი">რიცხვითი</option>
              <option value="თარიღი">თარიღი</option>
            </select>
          );
        } else {
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
              {row.original.dataType}
            </div>
          ); // Display the existing value for existing rows
        }
      },
    },
    {
      id: "GroupMethod",
      label: "GroupMethod",
      accessor: "GroupMethod",
      minWidth: 100,
      dataType: "text",
      options: [],

      Cell: ({ row }) => {
        const [groupOptions, setGroupOptions] = useState([]);
        const handleChange = (event) => {
          setSelectedValue(event.target.value);
          row.original.groupMethod = event.target.value;
        };

        const [selectedValue, setSelectedValue] = useState(
          row.original.groupMethod
        );

        const defaultSuggestions = ["SUM", "SUBSTRING", "MAX"];
        const optionsToShow = defaultSuggestions.slice(0, 3);
        useEffect(() => {
          setSelectedValue(row.original.groupMethod);
        }, [row.original.groupMethod]);
        useEffect(() => {
          const fetchData = async () => {
            try {
              const apiUrl = "https://localhost:7027/GetSQLColumnNamesList";
              const response = await axios.get(apiUrl);
              const filteredData = response.data.data.filter((item) => {
                return item.groupMethod !== null;
              });
              setGroupOptions(filteredData);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
          fetchData();
        }, []);
        return (
          <select
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              margin: "5px",
            }}
            value={selectedValue}
            onChange={handleChange}
          >
            <option value={0}></option>
            {optionsToShow.map((groupMethod) => (
              <option key={groupMethod} value={groupMethod}>
                {groupMethod}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      id: "delete",
      label: "",
      accessor: "delete",
      maxWidth: 100,
      dataType: "text",
      options: [],

      Cell: ({ row }) => {
        const handleDeleteRow = async () => {
          const confirmed = window.confirm(
            "დარწმუნებული ხართ რომ გსურთ წაშლა ? "
          );

          // If the user confirms, proceed with deletion
          if (confirmed) {
            const apiUrl = "https://localhost:7027/DeleteRow";
            const payload = {
              Id: row.original.id,
            };

            try {
              const response = await axios.post(apiUrl, payload);
              // If deletion is successful, refresh the page
              if (response.status === 200) {
                window.location.reload();
              } else {
                // Handle other response statuses if needed
                console.error("Deletion failed");
              }
            } catch (error) {
              console.error("Error occurred during deletion:", error);
              // Handle error cases as needed
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
              onClick={handleDeleteRow}
              style={{ backgroundColor: "red" }}
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
    code: "",
  };
  const initialState = {
    data: [row], // Initial data as an empty array
    columns: columns,
    // Add other state properties if needed
  };
  const [loading, setLoading] = useState(false);
  // const handleButtonSave = () => {

  //   //აქ იწერება ვალიდაცია იმისთვის რომ შემოწმდეს არის თუ არა არჩეული ორი ან მეტი ექსელის სახელი
  //   const excelNameSet = new Set();
  //   let hasDuplicates = false;

  //   var ExcelData = state.data.filter((item) => {
  //     return item.excelName != null;
  //   });

  //   ExcelData.forEach((item) => {
  //     if (excelNameSet.has(item.excelName)) {
  //       hasDuplicates = true;
  //       return; // Exit forEach loop early if duplicate found
  //     }
  //     excelNameSet.add(item.excelName);
  //   });

  //   if (hasDuplicates) {
  //     alert(
  //       "Duplicate excelName values found. Cannot proceed with post method."
  //     );
  //     return; // Exit the function if duplicates found
  //   }
  //   //ხდება დაგაწოდება პარამეტრების ბექში
  //   const payLoad = {
  //     columnNameDTO: state.data.map((item) => ({
  //       ID: item.id,
  //       Sqlname: item.sqlname,
  //       ExcelName: item.excelName,
  //       AccessName: item.accessName,
  //       SortValue: item.shortValue,
  //       DataType: item.dataType,
  //       IsAccessToExcel: item.isAccessToExcel,
  //     })),
  //   };
  //   // უშუალოდ მეთოდი სად და რეები უნდა წავიდეს

  //   axios
  //     .post("https://localhost:7027/SaveColumnName", payLoad.columnNameDTO)
  //     .then((response) => {
  //       console.log(response);
  //       //setData(response.data)
  //     });
  // };

  const handleButtonSave = () => {
    // Validate if there are any duplicate excelName values
    const excelNameSet = new Set();
    let hasDuplicates = false;

    const ExcelData = state.data.filter((item) => item.excelName != null);

    ExcelData.forEach((item) => {
      if (excelNameSet.has(item.excelName)) {
        hasDuplicates = true;
        return; // Exit forEach loop early if duplicate found
      }
      excelNameSet.add(item.excelName);
    });

    if (hasDuplicates) {
      alert(
        "Duplicate excelName values found. Cannot proceed with post method."
      );
      return; // Exit the function if duplicates found
    }

    // Construct payload
    const payLoad = {
      columnNameDTO: state.data.map((item) => ({
        ID: item.id,
        Sqlname: item.sqlname,
        ExcelName: item.excelName,
        AccessName: item.accessName,
        SortValue: item.shortValue,
        DataType: item.dataType,
        GroupMethod: item.groupMethod,
        IsAccessToExcel: item.isAccessToExcel,
        ColN: item.colN,
      })),
    };

    // Ask for confirmation before proceeding
    const confirmed = window.confirm("გსურთ დამახსოვრება ცვლილებების ?");

    // If the user confirms, proceed with the save
    if (confirmed) {
      // Perform POST request to save changes
      axios
        .post("https://localhost:7027/SaveColumnName", payLoad.columnNameDTO)
        .then((response) => {
          console.log(response);
          // Optionally, handle response or update state
          // setData(response.data)
          // Refresh the page
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error occurred during save:", error);
          // Optionally, handle error cases
        });
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState); // ამას იმისთვის ვაკეთებთ რომ თავიდან სთეითში დატა იყოს ცარიელი ცხრილი რომ დახატოს

  const [options, setOptions] = useState([]);

  const [data, setData] = useState([]); //ეს იქმნება იმისთვის რომ გადააწოდოს ბაზას ცხრილი რომელიც რედაქტირდა ან შეიცვალა

  return (
    <div className="Main-Container">
      <div className="row-excel">
        <Table
          columns={state.columns}
          data={state.data}
          dispatch={dispatch}
          skipReset={state.skipReset}
        />
        <button onClick={handleButtonSave}>დამახსოვრება</button>
      </div>
    </div>
  );
};

export default ColumnNameTable;
