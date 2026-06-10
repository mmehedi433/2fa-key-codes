const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

db.run(
    `
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    secret TEXT NOT NULL
)
`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Database created successfully");
        }

        db.close();
    },
);
