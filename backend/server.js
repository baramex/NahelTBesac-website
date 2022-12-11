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
    limits: {
        fileSize: 500_000
    },
    fileFilter: async (req, file, callback) => {
        // TOEDIT
        if (!AVATAR_MIME_TYPE.includes(file.mimetype) || !AVATAR_TYPE.includes(path.extname(file.originalname))) {
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
/*const { createTransport, createTestAccount } = require("nodemailer");
let mail = { transporter: null };
createTestAccount().then(mailAccount => {
    mail.transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: mailAccount.user,
            pass: mailAccount.pass,
        }
    });
});*/
// TOEDIT
const header = `
<div style="background-color: #10b981;width: 100%;text-align: center;padding: 20px 0 50px 0;">
    <h1 style="font-size: 2.5rem;margin:0;"><a href="https://chatblast.io" style="color: white;">ChatBlast</a></h1>
</div>
`
const footer = `
<div style="background-color: #cdddd5;width: calc(100%-20px);padding: 10px;margin-top: 25px;">
    <p style="margin:0;">Copyright © 2022 ChatBlast. All Rights Reserved.</p>
</div>
`;

/* autre */
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

module.exports = { app, upload, header, footer, CustomError };