const text = "create table author (id number, name string, age number, city string, state string, country string)";

const tableName = text.match("author")[0];
const columns = text.match(/\((.+)\)/)[1];
const columnsSeparated = columns.split(', ');

console.log(columnsSeparated);