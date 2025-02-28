require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL");
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


const upload = multer();

async function uploadToS3(key, mimeType, buffer) {
    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: mimeType
        }));
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw error;
    }
}

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something went wrong! Please check server logs.");
}

app.get('/', (req, res, next) => {
    db.query("SELECT * FROM memories", (err, results) => {
        if (err) return next(err);
        
        if (results.length === 0) {
            return res.send("No memories found");
        }

        // Convert S3 keys into full URLs
        const memories = results.map(memory => ({
            imageUrl: memory.image_url, 
            audioUrl: memory.audio_url,
            content: memory.content
        }));

        res.render('memory', { memories });
    });
});




app.get('/admin', (req, res) => {
    res.render('admin');
});

app.post('/upload', upload.fields([{ name: 'image' }, { name: 'audio' }]), async (req, res, next) => {
    try {
        const image = req.files.image[0];
        const audio = req.files.audio[0];
        const content = req.body.content;

        // Generate file names
        const imageKey = `images/${Date.now()}_${path.basename(image.originalname)}`;
        const audioKey = `audio/${Date.now()}_${path.basename(audio.originalname)}`;

        // Upload to S3
        await uploadToS3(imageKey, image.mimetype, image.buffer);
        await uploadToS3(audioKey, audio.mimetype, audio.buffer);

        // Generate full URLs for S3 files
        const imageUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
        const audioUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${audioKey}`;

        // Insert new memory (Auto-increment ID)
        db.query(`
            INSERT INTO memories (image_key, audio_key, image_url, audio_url, content)
            VALUES (?, ?, ?, ?, ?)
        `, [imageKey, audioKey, imageUrl, audioUrl, content], (err) => {
            if (err) return next(err);
            res.redirect('/admin');
        });

    } catch (err) {
        next(err);
    }
});




function getS3Url(key) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
