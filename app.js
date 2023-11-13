const path = require("path");
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "express_db",
});

// ルートパスにアクセスされたときの処理
app.get("/", (req, res) => {
  // データベースからアンケートデータを取得
  const sql = "SELECT * FROM questionnaire";

  // フォームデータの処理
  app.post("/", (req, res) => {
    const sqlInsert = "INSERT INTO questionnaire SET ?";
    const validColumns = [
      "name",
      "kana",
      "gender",
      "email",
      "address",
      "phone_number",
      "inquiry_text",
    ];

    // フォームデータから存在するカラムのみを取り出す
    const validData = Object.keys(req.body)
      .filter((key) => validColumns.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    // データベースに挿入
    con.query(sqlInsert, validData, function (err, result, fields) {
      if (err) {
        console.error("データ挿入エラー:", err);
        res.status(500).send("内部サーバーエラー");
        return;
      }

      console.log(result);
      res.sendFile(path.join(__dirname, "html/endpage.html"));
    });
  });

  // アンケートデータを表示
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", {
      questionnaire: result,
    });
  });
});

app.get("/delete/:name", (req, res) => {
  const sql = "DELETE FROM questionnaire WHERE name = ?";
  con.query(sql, [req.params.name], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
});

// サーバーを起動
app.listen(port, () => console.log(`ポート ${port} でアプリが起動しました！`));
console.log("テスト");
