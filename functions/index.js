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

/*--- Import Routes from router files ---*/
// location of routing important; don't require route before app is initialized
// const userRoute = require("./routes/userRoute");
const affiliationRoute = require("./routes/affiliationRoute");
const commentRoute = require("./routes/commentRoute");
const companyRoute = require("./routes/companyRoute");
const connectionRoute = require("./routes/connectionRoute");
const contentPostRoute = require("./routes/contentPostRoute");
const inboxRoute = require("./routes/inboxRoute");
const marketPostRoute = require("./routes/marketPostRoute");
const messageRoute = require("./routes/messageRoute");
const requestRoute = require("./routes/requestRoute");

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

/*--- Register Router Middleware ---*/
// app.use("/api/user", userRoute);
app.use("/api/affiliation", affiliationRoute);
app.use("/api/comment", commentRoute);
app.use("/api/company", companyRoute);
app.use("/api/connection", connectionRoute);
app.use("/api/content_post", contentPostRoute);
app.use("/api/inbox", inboxRoute);
app.use("/api/market_post", marketPostRoute);
app.use("/api/message", messageRoute);
app.use("/api/request", requestRoute);

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Greensfeer Backend");
});

// Export API to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
