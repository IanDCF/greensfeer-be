const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
// const admin = require("firebase-admin");

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");

const serviceAccount = require("./keys.json");

initializeApp({
  credential: cert(serviceAccount),
});

// location of routing important; don't require route before app is initialized
const userRoute = require("./routes/userRoute");

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Greensfeer Backend");
});

// User Route
app.use("/user", userRoute);

// Export API to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
