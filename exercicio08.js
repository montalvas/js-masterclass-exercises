const DatabaseError = function(statement, message) {
    this.statement = statement;
    this.message = message;
}

const Parser = function() {
    const commands = new Map();
    commands.set("createTable", /create table ([a-z]+) \((.+)\)/);
    commands.set("insert", /insert into ([a-z]+) \((.+)\) values \((.+)\)/);
    commands.set("select", /select (.+) from ([a-z]+)(?: where (.+))?/);
    commands.set("delete", /delete from ([a-z]+)(?: where (.+))?/);

    this.parse = function(statement) {
        for (const command of commands) {
            const result = statement.match(command[1]);
            if (result) {
                const commandName = command[0];
                return {
                    command: commandName,
                    parsedStatement: result
                }
            }
        }
    }
}

const database = {
    tables: {},
    parser: new Parser(),
    execute(statement) {
        const {command, parsedStatement} = this.parser.parse(statement);
        if (parsedStatement !== null) {
            return this[command](parsedStatement);
        }
        const message = `Syntax error: ${statement}`;
        throw new DatabaseError(statement, message);
    },
    createTable(parsedStatement) {
        let [, tableName, columns] = parsedStatement;
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
    insert(parsedStatement) {
        let [, tableName, columns, values] = parsedStatement;
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
    select(parsedStatement) {
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
    delete(parsedStatement) {
        let [, tableName, whereClause] = parsedStatement;
        if(whereClause) {
            const [columnWhere, valueWhere] = whereClause.split(' = ');
            this.tables[tableName].data = this.tables[tableName].data.filter((row) => row[columnWhere] !== valueWhere);
        } else {
            this.tables[tableName].data = [];
        }
    }
}

database.execute("create table author (id number, name string, age number, city string, state string, country string)");
database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
database.execute("delete from author where id = 2");
console.log(database.execute("select name, age from author"));