const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");

// Require secret keys
const serviceAccount = require("./keys.json");

// Initialize Firebase App
initializeApp({
  credential: cert(serviceAccount),
});

/*--- import routes after initializing app ---*/
// location of routing important; don't require route before app is initialized
const affiliationRoute = require("./routes/affiliationRoute");
const marketPostRoute = require("./routes/marketPostRoute");
const companyRoute = require("./routes/companyRoute");
const requestRoute = require("./routes/requestRoute");
const commentRoute = require("./routes/commentRoute");

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// User Route
// app.use("/api/user", userRoute);

// Market Post Route
app.use("/api/market_post", marketPostRoute);

// Company Route
app.use("/api/company", companyRoute);

// Affiliation Route
app.use("/api/affiliation", affiliationRoute);

// Request Route
app.use("/api/request", requestRoute);

// Comment Route
app.use("/api/comment", commentRoute);

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Greensfeer Backend");
});

// Export API to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
