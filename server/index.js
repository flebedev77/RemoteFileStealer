require("dotenv").config();
const express = require('express');
const multer = require('multer');

const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080; // Change port if needed

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage }); // Configure upload directory

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        log("User has not supplied upload request with a file!");
        return res.status(400).send('No file uploaded!');
    }

    log(`File uploaded successfully: ${req.file.filename}`);
    res.send(`File upload verified: ${req.file.originalname}`);
});

app.get("/download/:filename", (req, res) => {
    const filepath = (__dirname + "/uploads/" + req.params.filename).replaceAll("..", "");
    const ip = req.socket.remoteAddress;

    if (!fs.existsSync(filepath)) {
        res.status(404).send("File does not exist!");
        log(ip + " Tried to download " + filepath + " which dosen't exist!");
        return;
    }

    log(ip + " Initiated download for " + filepath);
    res.sendFile(filepath);    
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

function log(msg) {
    let current = new Date();
    console.log(`[${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}]:${msg}`);
}