const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");

const serviceAccount = require("./keys.json");

initializeApp({
  credential: cert(serviceAccount),
});

const app = express();

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
