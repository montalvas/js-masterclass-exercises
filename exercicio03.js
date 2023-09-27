const statement = "create table author (id number, name string, age number, city string, state string, country string)";

const database = {
    tables: {},
    execute(statement) {
        if(statement.startsWith('create table'))
            return this.createTables(statement);
    },
    createTables(statement) {
        const tableName = statement.match(/author/)[0];
        let columns = statement.match(/\((.+)\)/)[1];
        columns = columns.split(',');

        this.tables = {
            [tableName]: {
                columns: {},
                data: []
            }
        }
            
        for (let column of columns) {
            column = column.trim().split(' ');
            const key = column[0];
            const value = column[1];
            this.tables[tableName].columns[key] = value;
        }
    }
};

database.execute("create table author (id number, name string, age number, city string, state string, country string)");

console.log(JSON.stringify(database, undefined, " "));