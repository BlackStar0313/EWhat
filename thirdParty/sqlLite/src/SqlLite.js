var SqlLite;
SqlLite = {
	db : new SQL.Database(),
	openDb: function (_dbArr) {
		db = new SQL.Database(_dbArr);
	},
	createDb: function () {
		db = new SQL.Database();
	},
	exec: function(_sqlStr) {
        return db.exec(_sqlStr);
	},
	exportDb: function() {
        return db.export();
	},
	close: function() {
		return db.close();
	},
	test: function(dbArr) {
		var db = new SQL.Database(dbArr);
		// sqlstr = "CREATE TABLE hello (a int, b char);";
		// sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
		// sqlstr += "INSERT INTO hello VALUES (1, 'world');"
		// db.run(sqlstr); // Run the query without returning anything
		var res = db.exec("SELECT * FROM hello");
		var binaryArray = db.export();

		var data = { res: res , binary: binaryArray }
		return data ; 
	},
	test2: function() {
		var db = new SQL.Database();
		sqlstr = "CREATE TABLE hello (a int, b char);";
		sqlstr += "INSERT INTO hello VALUES (0, '你好');"
		sqlstr += "INSERT INTO hello VALUES (1, 'world');"
		db.run(sqlstr); // Run the query without returning anything
		var res = db.exec("SELECT * FROM hello");
		var binaryArray = db.export();

		var data = { res: res , binary: binaryArray }
		return data ; 
	}
};