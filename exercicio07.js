const DatabaseError = function(statement, message) {
    this.statement = statement;
    this.message = message;
}

const database = {
    tables: {},
    execute(statement) {
        if(statement.startsWith('create table')) {
            return this.createTables(statement);
        } 
        if (statement.startsWith('insert')) {
            return this.insert(statement);
        }
        if (statement.startsWith('select')) {
            return this.select(statement);
        }
        if (statement.startsWith('delete')) {
            return this.delete(statement);
        }

        const message = `Syntax error: ${statement}`;
        throw new DatabaseError(statement, message);
    },
    createTables(statement) {
        const regExp = statement.match(/create table ([a-z]+) \((.+)\)/);
        let [, tableName, columns] = regExp;
        columns = columns.split(',');

        this.tables = {
            [tableName]: {
                columns: {},
                data: []
            }
        }
            
        for (let column of columns) {
            column = column.trim().split(' ');
            const [key, value] = column;
            this.tables[tableName].columns[key] = value;
        }
    },
    insert(statement) {
        const regExp = statement.match(/insert into ([a-z]+) \((.+)\) values \((.+)\)/);
        let [, tableName, columns, values] = regExp;
        columns = columns.split(', ');
        values = values.split(', ');
        const row = {};

        for(let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const value = values[i]
            row[column] = value;
        }
        this.tables[tableName].data.push(row);
    },
    select(statement) {
        const parsedStatement = statement.match(/select (.+) from ([a-z]+)(?: where (.+))?/);
        let [, columns, tableName, whereClause] = parsedStatement;
        columns = columns.split(', ');
        let rows = this.tables[tableName].data;

        if(whereClause) {
            const [columnWhere, valueWhere] = whereClause.split(' = ');
            rows = rows.filter((row) => row[columnWhere] === valueWhere);
        }

        rows = rows.map((row) => {
            const selectedRow = {};
            columns.forEach((column) => selectedRow[column] = row[column]);
            return selectedRow;
        });
        return rows;
    },
    delete(statement) {
        const parsedStatement = statement.match(/delete from ([a-z]+)(?: where (.+))?/);
        let [, tableName, whereClause] = parsedStatement;
        if(whereClause) {
            const [columnWhere, valueWhere] = whereClause.split(' = ');
            this.tables[tableName].data = this.tables[tableName].data.filter((row) => row[columnWhere] !== valueWhere);
        } else {
            this.tables[tableName].data = [];
        }
    }
}

try {
    database.execute("create table author (id number, name string, age number, city string, state string, country string)");
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
    database.execute("select name, age from author");
    database.execute("select name, age from author where id = 1");
    database.execute("delete from author where id = 2");
    console.log(JSON.stringify(database, undefined, " "));
} catch(e) {
    console.log(e.message);
}