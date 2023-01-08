require("dotenv").config();
const mongoose = require("mongoose");
const { app } = require("./server");
mongoose.connect(process.env.DB, { dbName: process.env.DB_NAME }).catch(console.error);

app.use("/api",
    require("./api/authentification.api"),
    require("./api/misc.api"),
    require("./api/report.api"),
    require("./api/profile.api"),
    require("./api/morningReport.api"),
    require("./api/impreciseAddressReport.api"),
);

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.use("*", (req, res) => {
    res.status(404).send("Route non trouvée.");
});