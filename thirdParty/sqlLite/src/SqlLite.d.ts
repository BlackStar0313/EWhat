declare module SqlLite {
	function openDb(dbArr): any;
	function createDb(): any;
	function exec(sqlStr): any;
	function exportDb(): any;
	function close(): any;
	function test(dbArr): any;
	function test2(): any;
}