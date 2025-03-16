require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); // ✅ AWS SDK v3
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// ✅ AWS S3 Configuration (v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

// Multer Storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

// 🔹 API to Fetch All Carousel Images
app.get("/api/images", (req, res) => {
  const sql = "SELECT id AS num, image_url, title FROM carousel_images";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 🔹 API to Upload Image
app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileName = `${Date.now()}-${req.file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  };

  try {
    await s3.send(new PutObjectCommand(params)); // ✅ AWS SDK v3 Upload
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    const { title } = req.body;

    const sql = "INSERT INTO carousel_images (image_url, title) VALUES (?, ?)";
    db.query(sql, [imageUrl, title], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Image uploaded successfully", imageUrl });
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
