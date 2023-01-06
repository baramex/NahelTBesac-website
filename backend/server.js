/* constantes */
const PORT = 4000;

/* express */
const express = require("express");
const app = express();

/* middleware */
const cors = require('cors');
app.use(cors({
    origin: process.env.HOST,
    credentials: true
}));
app.use(express.static("public"));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const multer = require("multer");
const path = require("path");
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: async (req, file, callback) => {
        const types = ["png", "jpeg", "jpg", "jiff"];
        if (!types.map(a => "image/" + a).includes(file.mimetype) || !types.map(a => "." + a).includes(path.extname(file.originalname))) {
            callback(new Error("Type de fichier invalide."), false);
        }
        else {
            callback(false, true);
        }
    }
});
const cookieParser = require('cookie-parser');
app.use(cookieParser());

/* server */
app.listen(PORT, () => {
    console.log("Serveur lancé sur le port: " + PORT);
});

/* mail */
const { createTransport } = require("nodemailer");
const transporter = createTransport({
    host: "pro2.mail.ovh.net",
    port: 587,
    secure: false,
    auth: {
        user: "no-reply@naheltbesac.fr",
        pass: "fFJ45fdF45dw98v",
    }
});
const header = `
<div style="background-color: #393d32;width: 100%;padding: 10px 15px;margin-bottom: 25px;">
    <a href="${process.env.HOST}" style="color: white;text-decoration: none;display: inline-flex;align-items: center;gap: 10px;"><img src="${process.env.HOST}/icon.webp" style="border-radius: 50%;width: 48px;" alt="Nahel Transport"/><h1 style="margin:0;">Nahel Transport</h1></a>
</div>
`
const footer = `
<div style="background-color: #393d32;width: calc(100%-20px);padding: 10px;margin-top: 25px;">
    <p style="margin:0;color: white;">Copyright © 2022 Nahel Transport. All Rights Reserved.</p>
</div>
`;

/* autre */
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

module.exports = { app, upload, header, footer, CustomError, transporter };