const statement = "create table author (id number, name string, age number, city string, state string, country string)";
const tableName = statement.match(/author/)[0];
let columns = statement.match(/\((.+)\)/)[1];
columns = columns.split(',');

const database = {
    tables: {
        [tableName]: {
            columns: {}
        }
    }
};

for (let column of columns) {
    column = column.trim().split(' ');
    const key = column[0];
    const value = column[1];
    database.tables[tableName].columns[key] = value;
}

database.tables[tableName].data = [];

console.log(JSON.stringify(database, undefined, " "));