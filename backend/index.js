require("dotenv").config();
const mongoose = require("mongoose");
const { app } = require("./server");
mongoose.connect(process.env.DB, { dbName: process.env.DB_NAME });

app.use("/profile", require("./api/profile.api"));

app.use((req, res) => {
    res.status(404).send("Route non trouvée.");
});