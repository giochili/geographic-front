import { faker } from "@faker-js/faker";
import { randomColor } from "./utils";

export default function makeData(count, list) {
  let data = [];
  let options = [];
  for (let i = 0; i < count; i++) {
    let row = {
      ID: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      age: Math.floor(20 + Math.random() * 20),
      music: faker.music.genre(),
    };
    options.push({ label: row.music, backgroundColor: randomColor() });

    data.push(row);
  }

  let columns = [
    {
      id: "id",
      label: "First Name",
      accessor: "firstName",
      minWidth: 100,
      dataType: "text",
      options: [],
    },
    {
      id: "name",
      label: "Last Name",
      accessor: "lastName",
      minWidth: 100,
      dataType: "text",
      options: [],
    },
    {
      id: "varjisFarti",
      label: "Age",
      accessor: "age",
      width: 80,
      dataType: "number",
      options: [],
    },
    {
      id: "email",
      label: "E-Mail",
      accessor: "email",
      width: 300,
      dataType: "text",
      options: [],
    },
    {
      id: "music",
      label: "Music Preference",
      accessor: "music",
      dataType: "select",
      width: 200,
      options: options,
    },
    {
      id: 999999,
      width: 20,
      label: "+",
      disableResizing: true,
      dataType: "null",
    },
  ];
  return { columns: columns, data: list, skipReset: false };
}
