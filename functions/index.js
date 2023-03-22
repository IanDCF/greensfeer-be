const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const { getAuth } = require("firebase-admin/auth");

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

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});

/*--- Import Routes from router files ---*/
// location of routing important; don't require route before app is initialized
const userRoute = require("./routes/userRoute");
const affiliationRoute = require("./routes/affiliationRoute");
const commentRoute = require("./routes/commentRoute");
const companyRoute = require("./routes/companyRoute");
const connectionRoute = require("./routes/connectionRoute");
const contentPostRoute = require("./routes/contentPostRoute");
const inboxRoute = require("./routes/inboxRoute");
const marketPostRoute = require("./routes/marketPostRoute");
const messageRoute = require("./routes/messageRoute");
const requestRoute = require("./routes/requestRoute");
const notificationRoute = require("./routes/notificationRoute");

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
  allowedHeaders: "Accept",
};

// app.use(express.urlencoded({ extended: true }));

/*--- Register Router Middleware ---*/
app.use("/api/user", userRoute);
app.use("/api/affiliation", affiliationRoute);
app.use("/api/comment", commentRoute);
app.use("/api/company", companyRoute);
app.use("/api/connection", connectionRoute);
app.use("/api/content_post", contentPostRoute);
app.use("/api/inbox", inboxRoute);
app.use("/api/market_post", marketPostRoute);
app.use("/api/message", messageRoute);
app.use("/api/request", requestRoute);
app.use("/api/notification", notificationRoute);

// Home Route
app.get("/", (req, res) => {
  console.log(req.body);
  console.log(req.headers);
  getAuth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      console.log(decodedToken);
    });
  return res.status(200).send("Greensfeer Backend");
});

app.post("/", (req, res) => {
  token = req.body.token;
  // console.log(req.body.token);
  if (token) {
    getAuth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        return console.log(uid);
        //implement as service, user sends token with each request, check for uid match
      });
  }
  console.log(req.body);
  return res.send("success");
});

// Export API to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
