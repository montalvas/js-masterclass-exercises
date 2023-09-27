const DatabaseError = function(statement, message) {
    this.statement = statement;
    this.message = message;
}

const statement = "create table author (id number, name string, age number, city string, state string, country string)";

const database = {
    tables: {},
    execute(statement) {
        if(statement.startsWith('create table')) {
            return this.createTables(statement);
        } else {
            const message = `Syntax error: ${statement}`;
            throw new DatabaseError(statement, message);
        }
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

try {
    database.execute("select id, name from author");
    console.log(JSON.stringify(database, undefined, " "));
} catch (e) {
    console.log(e.message);
}