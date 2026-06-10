const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { authenticator } = require("@otplib/preset-default");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

app.get("/api/accounts", (req, res) => {
    db.all("SELECT * FROM accounts", [], (err, rows) => {
        res.json(rows);
    });
});

app.post("/api/accounts", (req, res) => {
    const { name, secret } = req.body;

    db.run("INSERT INTO accounts(name, secret) VALUES (?, ?)", [name, secret], function () {
        res.json({
            id: this.lastID,
        });
    });
});

app.put("/api/accounts/:id", (req, res) => {
    const { name, secret } = req.body;

    db.run(
        "UPDATE accounts SET name=?, secret=? WHERE id=?",
        [name, secret, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ success: true });
        },
    );
});

app.get("/api/codes", (req, res) => {
    db.all("SELECT * FROM accounts", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const result = rows.map((acc) => ({
            id: acc.id,
            name: acc.name,
            code: authenticator.generate(acc.secret),
            remaining: 30 - (Math.floor(Date.now() / 1000) % 30),
        }));

        res.json(result);
    });
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
