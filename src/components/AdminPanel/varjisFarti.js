import React, { useEffect, useReducer, useState } from "react";
import SideBarPanel from "./sideBarPanel";
import "../../components/ReactTable/Styles.css";
import "../../Styles/AdminPanel/varjisfarti.css";
import makeData from "../ReactTable/makeData";
import Table from "../../components/ReactTable/Table";
import { randomColor, shortId } from "../../components/ReactTable/utils";
import axios from "axios";
import SaxeobaTable from "./";
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
          var selectedindex = event.target.selectedIndex;
          row.original.saxeobaId = event.target.selectedIndex;
          row.original.areaNameId = document.getElementById(
            "projectNameIDselector"
          ).value;
          console.log(projectNameID);
        };
        // Fetch the data for the select dropdown
        useEffect(() => {
          const fetchData = async () => {
            try {
              const apiUrl = "https://localhost:7055/getSaxeobaList";
              const response = await axios.get(apiUrl);
              setOptions(response.data.data);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };

          fetchData();
        }, []); // Run only once on component mount

        return (
          <select value={selectedValue} onChange={handleChange}>
            <option value={0}> </option>
            {options.map((option) => (
              <option key={option.id} value={option.name}>
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
      width: 80,
      dataType: "number",
      options: [],
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
      const apiUrl = "https://localhost:7055/GetVarjisFartebiList";
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
      .post("https://localhost:7055/SaveVarjisFarti", payLoad.varjisFartiDTO)
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
        <h1>ვარჯის ფართები პროექტის სახელის მიხედვით</h1>
        <label>ამოირჩიეთ პროექტის დასახელება</label>
        <select
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
        <div
          style={{
            width: "100%",
            height: "100%",
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          ></div>
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
      {/* <div className="row-excel">
        <h1
          style={{
            marginBottom: "20px",
          }}
        >
          სახეობების ცხრილი
        </h1>
        <label
          style={{
            marginBottom: "20px",
          }}
        >
          ამოირჩიეთ პროექტის დასახელება
        </label>
        <select
          style={{
            width: "30%",
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
        <div
          style={{
            width: "100%",
            height: "100%",
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          ></div>
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
                <button onClick={handleButtonSave} type="button">
                  შენახვა
                </button>
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default VarjisFarti;

//original withaout delete up there

// //ALEKS

// import React, { useEffect, useState, useMemo, useReducer } from "react";
// import styled from "styled-components";
// import {
//   useTable,
//   usePagination,
//   useFlexLayout,
//   useResizeColumns,
//   useSortBy,
// } from "react-table";
// import axios from "axios";
// import SideBarPanel from "./sideBarPanel";
// import "../../Styles/AdminPanel/varjisfarti.css";
// import PlusIcon from "../../img/Plus";

// function reducer(state, action) {
//   switch (action.type) {
//     case "add_row":
//       return {
//         ...state,
//         skipReset: true,
//         data: [...state.data, {}],
//       };

//     case "delete_column":
//       const deleteIndex = state.columns.findIndex(
//         (column) => column.id === action.columnId
//       );
//       return {
//         ...state,
//         skipReset: true,
//         columns: [
//           ...state.columns.slice(0, deleteIndex),
//           ...state.columns.slice(deleteIndex + 1, state.columns.length),
//         ],
//       };
//     case "enable_reset":
//       return {
//         ...state,
//         skipReset: false,
//       };
//     default:
//       return state;
//   }
// }

// const makeData = async (e) => {
//   let data = [];
// const apiUrl = "https://localhost:7055/GetVarjisFartebiList";

// try {
//   const response = await axios.get(apiUrl, {
//     params: {
//       AreaNameID: 52,
//     },
//   });
//   data = response.data;
// } catch (error) {
//   console.error("Error fetching varjis fartebi data:", error);
// }

//   let columns = [
//     {
//       id: "id",
//       label: "First Name",
//       accessor: "firstName",
//       minWidth: 100,
//       dataType: "text",
//       options: [],
//     },
//     {
//       id: "name",
//       label: "Last Name",
//       accessor: "lastName",
//       minWidth: 100,
//       dataType: "text",
//       options: [],
//     },
//     {
//       id: "varjisFarti",
//       label: "Age",
//       accessor: "age",
//       width: 80,
//       dataType: "number",
//       options: [],
//     },
//   ];
//   return { columns: columns, data: data, skipReset: false };
// };
// const Styles = styled.div`
//   padding: 1rem;

//   table {
//     border-spacing: 0;
//     border: 1px solid black;

//     tr {
//       :last-child {
//         td {
//           border-bottom: 0;
//         }
//       }
//     }

//     th,
//     td {
//       margin: 0;
//       padding: 0.5rem;
//       border-bottom: 1px solid black;
//       border-right: 1px solid black;

//       :last-child {
//         border-right: 0;
//       }

//       input {
//         font-size: 1rem;
//         padding: 0;
//         margin: 0;
//         border: 0;
//       }
//     }
//   }

//   .pagination {
//     padding: 0.5rem;
//   }
// `;

// // Create an editable cell renderer
// const EditableCell = ({
//   value: initialValue,
//   row: { index },
//   column: { id },
//   updateMyData, // This is a custom function that we supplied to our table instance
// }) => {
//   // We need to keep and update the state of the cell normally
//   const [value, setValue] = React.useState(initialValue);

//   const onChange = (e) => {
//     setValue(e.target.value);
//   };

//   // We'll only update the external data when the input is blurred
//   const onBlur = () => {
//     updateMyData(index, id, value);
//   };

//   // If the initialValue is changed external, sync it up with our state
//   React.useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   return <input value={value} onChange={onChange} onBlur={onBlur} />;
// };

// // Set our editable cell renderer as the default Cell renderer
// const defaultColumn = {
//   Cell: EditableCell,
//   minWidth: 50,
//   width: 150,
//   maxWidth: 400,
//   sortType: "alphanumericFalsyLast",
// };

// // Be sure to pass our updateMyData and the skipPageReset option
// function Table({
//   columns,
//   data,
//   updateMyData,
//   skipPageReset,
//   dispatch: dataDispatch,
// }) {
//   const sortTypes = useMemo(
//     () => ({
//       alphanumericFalsyLast(rowA, rowB, columnId, desc) {
//         if (!rowA.values[columnId] && !rowB.values[columnId]) {
//           return 0;
//         }

//         if (!rowA.values[columnId]) {
//           return desc ? -1 : 1;
//         }

//         if (!rowB.values[columnId]) {
//           return desc ? 1 : -1;
//         }

//         return isNaN(rowA.values[columnId])
//           ? rowA.values[columnId].localeCompare(rowB.values[columnId])
//           : rowA.values[columnId] - rowB.values[columnId];
//       },
//     }),
//     []
//   );

//   // For this example, we're using pagination to illustrate how to stop
//   // the current page from resetting when our data changes
//   // Otherwise, nothing is different here.
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state: { pageIndex, pageSize, sortBy },
//   } = useTable(
//     {
//       columns,
//       data,
//       defaultColumn,
//       dataDispatch,
//       // use the skipPageReset option to disable page resetting temporarily
//       autoResetPage: !skipPageReset,
//       // updateMyData isn't part of the API, but
//       // anything we put into these options will
//       // automatically be available on the instance.
//       // That way we can call this function from our
//       // cell renderer!
//       updateMyData,
//       sortTypes, // Add useSortBy hook
//     },

//     //useFlexLayout,
//     useResizeColumns,
//     useSortBy,
//     usePagination
//   );

//   // Render the UI for your table
//   return (
//     <>
//       <table {...getTableProps()}>
//         <thead>
//           {headerGroups.map((headerGroup) => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column) => (
//                 <th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                   {column.render("Header")}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {page.map((row, i) => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map((cell) => {
//                   return (
//                     <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                   );
//                 })}
//               </tr>
//             );
//           })}
//           <div
//             className="tr add-row"
//             onClick={() => dataDispatch({ type: "add_row" })}
//           >
//             <span className="svg-icon svg-gray" style={{ marginRight: 4 }}>
//               <PlusIcon />
//             </span>
//             New
//           </div>
//         </tbody>
//       </table>
//       <div className="pagination">
//         <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//           {"<<"}
//         </button>{" "}
//         <button onClick={() => previousPage()} disabled={!canPreviousPage}>
//           {"<"}
//         </button>{" "}
//         <button onClick={() => nextPage()} disabled={!canNextPage}>
//           {">"}
//         </button>{" "}
//         <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//           {">>"}
//         </button>{" "}
//         <span>
//           Page{" "}
//           <strong>
//             {pageIndex + 1} of {pageOptions.length}
//           </strong>{" "}
//         </span>
//         <span>
//           | Go to page:{" "}
//           <input
//             type="number"
//             defaultValue={pageIndex + 1}
//             onChange={(e) => {
//               const page = e.target.value ? Number(e.target.value) - 1 : 0;
//               gotoPage(page);
//             }}
//             style={{ width: "100px" }}
//           />
//         </span>{" "}
//         <select
//           value={pageSize}
//           onChange={(e) => {
//             setPageSize(Number(e.target.value));
//           }}
//         >
//           {[10, 20, 30, 40, 50].map((pageSize) => (
//             <option key={pageSize} value={pageSize}>
//               Show {pageSize}
//             </option>
//           ))}
//         </select>
//       </div>
//     </>
//   );
// }

// function Varjisfarti() {
//   const handleButtonSave = () => {
//     console.log(data);
//   };

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "id",
//         accessor: "id",
//         canSort: true,
//       },
//       {
//         Header: "name",
//         accessor: "name",
//       },
//       {
//         Header: "varjisFarti",
//         accessor: "varjisFarti",
//       },
//     ],
//     []
//   );

//   //const [data, setData] = React.useState(() => makeData(20));
//   const [steiti, setsteiti] = useState([]);
//   const [options, setOptions] = useState([]);
//   const [data, setData] = React.useState([]);
//   const [originalData] = React.useState(data);
//   const [skipPageReset, setSkipPageReset] = React.useState(false);
//   const [projectNameID, setProjectNameID] = useState();
//   const [varjisFartebiList, setVarjisFartebiList] = useState([]);
//   //const [dispatch, setDispatch] = useState([]);

//   // const [state, dispatch] = useReducer(reducer, steiti);
//   // const [dataDispatch, dispatch] = React.useReducer(reducer, [steiti]);
//   const [state, dispatch] = useReducer(reducer, makeData());
//   useEffect(() => {
//     dispatch({ type: "enable_reset" });
//   }, [state.data]);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const apiUrl = "https://localhost:7055/GetProjectNamesList";
//         const response = await axios.get(apiUrl);
//         setOptions(response.data.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleProjectNameChange = async (e) => {
//     setProjectNameID(e.target.value);

//     const apiUrl = "https://localhost:7055/GetVarjisFartebiList";

//     try {
//       const response = await axios.get(apiUrl, {
//         params: {
//           AreaNameID: e.target.value,
//         },
//       });
//       setsteiti(response.data.data);
//       setData(response.data.data); // Update state with fetched data
//     } catch (error) {
//       console.error("Error fetching varjis fartebi data:", error);
//     }
//   };

//   // We need to keep the table from resetting the pageIndex when we
//   // Update data. So we can keep track of that flag with a ref.

//   // When our cell renderer calls updateMyData, we'll use
//   // the rowIndex, columnId and new value to update the
//   // original data
//   const updateMyData = (rowIndex, columnId, value) => {
//     // We also turn on the flag to not reset the page
//     setSkipPageReset(true);
//     setData((old) =>
//       old.map((row, index) => {
//         if (index === rowIndex) {
//           return {
//             ...old[rowIndex],
//             [columnId]: value,
//           };
//         }
//         return row;
//       })
//     );
//   };

//   // After data chagnes, we turn the flag back off
//   // so that if data actually changes when we're not
//   // editing it, the page is reset
//   React.useEffect(() => {
//     setSkipPageReset(false);
//   }, [data]);

//   // Let's add a data resetter/randomizer to help
//   // illustrate that flow...
//   const resetData = () => setData(originalData);

//   return (
//     <div className="Main-Container">
//       <SideBarPanel />
//       <div className="row-excel">
//         <label>ამოირჩიეთ მუნიციპალიტეტი</label>
//         <select
//           title="აირჩიეთ მუნიციპალიტეტი"
//           onChange={(e) => handleProjectNameChange(e)}
//         >
//           <option value={0}></option>
//           {options.map((option) => (
//             <option
//               title="აირჩიეთ მუნიციპალიტეტი "
//               key={option.id}
//               value={option.id}
//             >
//               {option.name}
//             </option>
//           ))}
//         </select>

//         <Styles>
//           <button onClick={resetData}>Reset Data</button>
//           <Table
//             columns={columns}
//             data={state.data}
//             dispatch={dispatch}
//             updateMyData={updateMyData}
//             skipPageReset={skipPageReset}
//           />
//         </Styles>

//         <button onClick={handleButtonSave} type="button">
//           შენახვა
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Varjisfarti;
// //ALEKS zemot
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideBarPanel from "./sideBarPanel";
// import "../../Styles/AdminPanel/varjisfarti.css";
// import {
//   useTable,
//   useRowSelect,
//   usePagination,
//   useSortBy,
//   useFilters,
//   useGroupBy,
//   useExpanded,
//   useRowState,
//   useBlockLayout,
//   useResizeColumns,
// } from "react-table";

// const VarjisFartebi = () => {
//   const [options, setOptions] = useState([]);
//   const [projectNameID, setProjectNameID] = useState();
//   const [varjisFartebiList, setVarjisFartebiList] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const apiUrl = "https://localhost:7055/GetProjectNamesList";
//         const response = await axios.get(apiUrl);
//         setOptions(response.data.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleProjectNameChange = async (e) => {
//     setProjectNameID(e.target.value);

//     const apiUrl = "https://localhost:7055/GetVarjisFartebiList";

//     try {
//       const response = await axios.get(apiUrl, {
//         params: {
//           AreaNameID: e.target.value,
//         },
//       });
//       setVarjisFartebiList(response.data.data); // Update state with fetched data
//     } catch (error) {
//       console.error("Error fetching varjis fartebi data:", error);
//     }
//   };

//   const data = React.useMemo(() => varjisFartebiList, [varjisFartebiList]);
//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "ID",
//         accessor: "id",
//       },
//       {
//         Header: "სახეობა",
//         accessor: "name",
//       },
//       {
//         Header: "ვარჯის ფართი",
//         accessor: "varjisFarti",

//         Cell: ({ value, row, column }) => (
//           <input
//             value={value}
//             onChange={(e) => {
//               const newValue = e.target.value;
//               const updatedRows = varjisFartebiList.map((rowData, index) => {
//                 if (index === row.index) {
//                   // Update the specific row
//                   return {
//                     ...rowData,
//                     [column.id]: newValue, // Update the column with new value
//                   };
//                 }
//                 return rowData;
//               });
//               setVarjisFartebiList(updatedRows); // Update the state with modified data
//             }}
//           />
//           // <div style={{ display: "flex", justifyContent: "space-around" }}>
//           //   <button onClick={() => handleEdit(value)}>Edit</button>
//           //   <button className="delete.btn" onClick={() => handleDelete(value)}>
//           //     Delete
//           //   </button>
//           // </div>
//         ),
//       },
//     ],
//     []
//   );

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable({ columns, data });
//   const handleEdit = (id) => {
//     // Handle edit operation here
//     // alert(id);
//   };

//   const handleDelete = (id) => {
//     // Handle delete operation here
//     if (window.confirm("დარწმუნებული ხართ რომ გსურთ წაშლა ?") == true) {
//       alert(id);
//     }
//   };
//   return (
//     <div className="Main-Container">
//       <SideBarPanel />
//       <div className="row-excel">
//         <label>ამოირჩიეთ მუნიციპალიტეტი</label>
//         <select
//           title="აირჩიეთ მუნიციპალიტეტი"
//           onChange={(e) => handleProjectNameChange(e)}
//         >
//           <option value={0}></option>
//           {options.map((option) => (
//             <option
//               title="აირჩიეთ მუნიციპალიტეტი "
//               key={option.id}
//               value={option.id}
//             >
//               {option.name}
//             </option>
//           ))}
//         </select>

// <table className="styled-table" {...getTableProps()}>
//   <thead>
//     {headerGroups.map((headerGroup) => (
//       <tr {...headerGroup.getHeaderGroupProps()}>
//         {headerGroup.headers.map((column) => (
//           <th {...column.getHeaderProps()}>
//             {column.render("Header")}
//           </th>
//         ))}
//       </tr>
//     ))}
//   </thead>
//   <tbody {...getTableBodyProps()}>
//     {rows.map((row) => {
//       prepareRow(row);
//       return (
//         <tr {...row.getRowProps()}>
//           {row.cells.map((cell) => {
//             return (
//               <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//             );
//           })}
//         </tr>
//       );
//     })}
//   </tbody>
// </table>
//       </div>
//     </div>
//   );
// };

// export default VarjisFartebi;

///ess kaiaa

// GIO

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SideBarPanel from "./sideBarPanel";
// import "../../Styles/AdminPanel/varjisfarti.css";
// import {
//   useTable,
//   useSortBy,
//   usePagination,
//   useFilters,
//   useGroupBy,
//   useExpanded,
//   useRowState,
//   useBlockLayout,
//   useResizeColumns,
// } from "react-table";

// const VarjisFartebi = () => {
//   const [options, setOptions] = useState([]);
//   const [projectNameID, setProjectNameID] = useState();
//   const [varjisFartebiList, setVarjisFartebiList] = useState([]);
//   const [editedValues, setEditedValues] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const apiUrl = "https://localhost:7055/GetProjectNamesList";
//         const response = await axios.get(apiUrl);
//         setOptions(response.data.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleProjectNameChange = async (e) => {
//     setProjectNameID(e.target.value);

//     const apiUrl = "https://localhost:7055/GetVarjisFartebiList";

//     try {
//       const response = await axios.get(apiUrl, {
//         params: {
//           AreaNameID: e.target.value,
//         },
//       });
//       setVarjisFartebiList(response.data.data); // Update state with fetched data
//     } catch (error) {
//       console.error("Error fetching varjis fartebi data:", error);
//     }
//   };

//   const handleEdit = (rowIndex) => {
//     setEditedValues((prev) => ({ ...prev, [rowIndex]: true }));
//   };

//   const handleSave = (rowIndex) => {
//     // Handle save operation here
//     const editedRow = varjisFartebiList[rowIndex];
//     // Perform an API call to save the edited row data
//     setEditedValues((prev) => ({ ...prev, [rowIndex]: false }));
//   };

//   const handleCancel = (rowIndex) => {
//     setEditedValues((prev) => ({ ...prev, [rowIndex]: false }));
//   };

//   const data = React.useMemo(() => varjisFartebiList, [varjisFartebiList]);

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "ID",
//         accessor: "id",
//       },
//       {
//         Header: "სახეობა",
//         accessor: "name",
//       },
//       {
//         Header: "ვარჯის ფართი",
//         accessor: "varjisFarti",
//         Cell: ({ value, row, column }) => {
//           const rowIndex = row.index;
//           const isEditing = editedValues[rowIndex];

//           return isEditing ? (
//             <input
//               value={value}
//               onChange={(e) => {
//                 const newValue = e.target.value;
//                 const updatedRows = varjisFartebiList.map((rowData, index) =>
//                   index === rowIndex
//                     ? { ...rowData, [column.id]: newValue }
//                     : rowData
//                 );
//                 setVarjisFartebiList(updatedRows);
//               }}
//             />
//           ) : (
//             <div>
//               {value}
//               <div style={{ display: "flex", justifyContent: "space-around" }}>
//                 <button onClick={() => handleEdit(rowIndex)}>Edit</button>
//                 {/* <button onClick={() => handleDelete(value)}>Delete</button> */}
//               </div>
//             </div>
//           );
//         },
//       },
//       {
//         Header: "ექშენს",
//         accessor: "actions",
//       },
//     ],
//     [editedValues, varjisFartebiList]
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     page,
//     state: { pageIndex, pageSize },
//     gotoPage,
//     previousPage,
//     nextPage,
//     canPreviousPage,
//     canNextPage,
//   } = useTable(
//     { columns, data, initialState: { pageSize: 5 } },
//     useFilters,
//     useGroupBy,
//     useSortBy,
//     useExpanded,
//     usePagination,
//     useRowState,
//     useBlockLayout,
//     useResizeColumns
//   );

//   return (
//     <div className="Main-Container">
//       <SideBarPanel />
//       <div className="row-excel">
//         <label>ამოირჩიეთ მუნიციპალიტეტი</label>
//         <select
//           title="აირჩიეთ მუნიციპალიტეტი"
//           onChange={(e) => handleProjectNameChange(e)}
//         >
//           <option value={0}></option>
//           {options.map((option) => (
//             <option
//               title="აირჩიეთ მუნიციპალიტეტი "
//               key={option.id}
//               value={option.id}
//             >
//               {option.name}
//             </option>
//           ))}
//         </select>

//         <table className="styled-table" {...getTableProps()}>
//           <thead>
//             {headerGroups.map((headerGroup) => (
//               <tr {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map((column) => (
//                   <th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                     {column.render("Header")}
//                     <span>
//                       {column.isSorted
//                         ? column.isSortedDesc
//                           ? " 🔽"
//                           : " 🔼"
//                         : ""}
//                     </span>
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {page.map((row, rowIndex) => {
//               prepareRow(row);
//               return (
//                 <tr {...row.getRowProps()}>
//                   {row.cells.map((cell) => (
//                     <td {...cell.getCellProps()}>
//                       {cell.render("Cell", { rowIndex })}
//                     </td>
//                   ))}
//                   <div>
//                     {editedValues[rowIndex] ? (
//                       <>
//                         <button onClick={() => handleSave(rowIndex)}>
//                           Save
//                         </button>
//                         <button onClick={() => handleCancel(rowIndex)}>
//                           Cancel
//                         </button>
//                       </>
//                     ) : null}
//                   </div>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <div>
//           <button onClick={() => previousPage()} disabled={!canPreviousPage}>
//             Previous
//           </button>
//           <span>
//             Page{" "}
//             <strong>
//               {pageIndex + 1} of {page.length}
//             </strong>{" "}
//           </span>
//           <button onClick={() => nextPage()} disabled={!canNextPage}>
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VarjisFartebi;
