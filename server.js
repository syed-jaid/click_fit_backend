const express = require("express");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/")));
// Serve static files from the root folder

const port = 3000;
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodemysql",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Set up a multer storage engine to save uploaded images to the 'upload_images' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload_images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
// Handle image uploads
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("Images uploaded successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function run() {
  try {
    app.post("/create-user", (req, res) => {
      console.log(req.body, req.email);
      const { email, password, type } = req.body;

      const sql = "INSERT INTO users (email, password, type) VALUES (?, ?, ?)";
      connection.query(sql, [email, password, type], (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          res.json({ success: false });
        } else {
          console.log("User created successfully");
          res.json({ success: true });
        }
      });
    });
  } finally {

  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("processing done");
});
