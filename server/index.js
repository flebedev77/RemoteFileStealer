require("dotenv").config();
const express = require('express');
const multer = require('multer');

const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080; // Change port if needed

if (!fs.existsSync(__dirname + "/uploads")) {
    fs.mkdirSync(__dirname + "/uploads");
}

function checkforinvalidfilenames() {
    let filenames = fs.readdirSync(__dirname + "/uploads");

    filenames.forEach((filename) => {
        if (filename.charAt(0) == "\\" || filename.charAt(0) == "/") {
            if (fs.lstatSync(__dirname + "/uploads/" + filename).isDirectory()) {
                fs.rmdirSync(__dirname + "/uploads" + filename);
            } else {
                fs.rmSync(__dirname + "/uploads" + filename);
            }
        }
    })
}

checkforinvalidfilenames();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folders = req.headers["original-filename"].split("\\");
        let dirpath = __dirname + "/uploads/";

        for (let i = 0; i < folders.length - 1; i++) {
            dirpath += folders[i] + "\\";
        }

        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, { recursive: true });
        }

        cb(null, __dirname + "/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, req.headers["original-filename"] || file.originalname);
    }
})
const upload = multer({ storage }); // Configure upload directory

app.use(express.static(__dirname + "/uploads"));
app.use((req, res, next) => {
    if (req.url.includes("/list")) {
        const urlparam = req.url.substring(5, req.url.length).replaceAll("//", "/");
        const filepath = (__dirname + "/uploads/" + urlparam).replaceAll("..", "").replaceAll("//", "/");

        if (!fs.existsSync(filepath)) {
            res.status(404).send("File does not exist!");
            log(ip + " Tried to download " + filepath + " which dosen't exist!");
            return;
        }

        if (fs.lstatSync(filepath).isDirectory()) {
            let files = fs.readdirSync(filepath, { withFileTypes: true })

            let urltokens = urlparam.split("/");
            let urlwithoutlast = "";
            let showupdir = false;

            if (urltokens.length - 1 > 0) {
                showupdir = true;
                for (let i = 0; i < urltokens.length - 1; i++) {
                    if (urltokens[i].trim() == "") continue;
                    urlwithoutlast += urltokens[i] + "/";
                }
            }

            urlwithoutlast.replaceAll("//", "/");

            let html = `
                <head>
                    <style>
                        body {
                            display: flex;
                            flex-direction: column;
                        } 
                        a {
                            width: 100vw;
                        }
                    </style>
                </head>
                <body>
                    <a href="/list/${urlwithoutlast}">../</a>
            `;

            files.forEach((file) => {
                html += `<a href="/list${urlparam + "" + file.name}">${file.name}<a>`;
            })

            html += "</body>";

            res.send(html);
        }
        if (fs.lstatSync(filepath).isFile()) {
            res.sendFile(filepath);
        }
    }
    next();
})

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