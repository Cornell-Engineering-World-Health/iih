import * as SQLite from 'expo-sqlite';

let db_id = Math.random()
  .toString(36)
  .substring(7);
module.exports = SQLite.openDatabase("Database_V661.9.db");
