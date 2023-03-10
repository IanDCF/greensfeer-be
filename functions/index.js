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
// const userRoute = require("./routes/userRoute");
const marketPostRoute = require("./routes/marketPostRoute");
const companyRoute = require("./routes/companyRoute");
const affiliationRoute = require("./routes/affiliationRoute");
const connectionRoute = require("./routes/connectionRoute");
const requestRoute = require("./routes/requestRoute");
const contentPostRoute = require("./routes/contentPostRoute");
const inboxRoute = require("./routes/inboxRoute");

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

// Connection Route
app.use("/api/connection", connectionRoute);

// Request Route
app.use("/api/request", requestRoute);
// Content Post Route
app.use("/api/content_post", contentPostRoute);

// Inbox Route
app.use("/api/inbox", inboxRoute);

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Greensfeer Backend");
});

// Export API to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
