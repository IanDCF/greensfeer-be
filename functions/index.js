const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
const admin = require("firebase-admin");

// Require Firebase Admin App
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");

// Require Firebase Firestore
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

// Require secret keys
const serviceAccount = require("./keys.json");

// Initialize Firebase App
initializeApp({
  credential: cert(serviceAccount),
});

// Initialize Firebase Firestore
const db = getFirestore();

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send("Greensfeer Backend");
});

const isEmpty = (str) => {
  if (str === "") return true;
};

// Firebase Authentication: Register new user
// Firestore: Create new user document in 'user' collection
app.post("/register", (req, res) => {
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    created_at: new Date().toISOString(),
  };

  let errors = {};

  if (isEmpty(user.first_name))
    errors.first_name = "First Name field must not be empty";
  if (isEmpty(user.last_name))
    errors.last_name = "Last Name field must not be empty";
  if (password !== confirm_password) errors.password = "Passwords must match";

  if (Object.keys(errors).length > 0)
    return res.status(400).send({ error: errors });

  admin
    .auth()
    .createUser(user)
    .then((userRecord) => {
      console.log(userRecord);
      const uid = userRecord.uid;
      db.collection("user").doc(`${uid}`).set(user);
      return uid;
    })
    .then((uid) => {
      return res.status(201).send({
        message: `Successfully created new user: ${uid}`,
      });
    })
    .catch((error) => {
      if (error.code == "auth/email-already-exists") {
        return res.status(400).send(error);
      }
      return res.status(500).send(error);
    });
});

// User Authentication => return user custom id token
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  admin
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      const uid = userRecord.uid;
      return admin.auth().createCustomToken(uid);
    })
    .then((customToken) => {
      res.send({ customToken });
    })
    .catch((error) => {
      console.error(`Error logging in: ${error}`);
      res.status(401).send("Invalid email or password");
    });
});

// POST: Create new user doc in 'user' collection
// Don't need this anymore
app.post("/user", (req, res) => {
  const userId = uuidv4();
  db.collection("user")
    .doc(`${userId}`)
    .set({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    })
    .then(() => {
      console.log(`User ${userId} successfully created`);
      return res.status(201).send();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
});

// GET: Read single user information with id parameter
app.get("/user/:id", (req, res) => {
  db.collection("user")
    .doc(req.params.id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(`User ${req.params.id} was found`);
        return res.status(200).send(doc.data());
      } else {
        return res.status(404).send({ error: "User not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
});

// GET: Read all user profiles
app.get("/user", async (req, res) => {
  try {
    const snapshot = await db.collection("user").get();
    const users = [];
    snapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return res.status(200).send(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Server error" });
  }
});

// PATCH: Update single user profile with id parameter
app.patch("/user/:id", (req, res) => {
  const updateObject = req.body;
  db.collection("user")
    .doc(req.params.id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userRef = db.collection("user").doc(req.params.id);
        return userRef.update(updateObject);
      } else {
        return res.status(404).send({ error: "User not found" });
      }
    })
    .then(() => {
      console.log(`User ${req.params.id} has been updated`);
      return res.status(200).send(`User ${req.params.id} has been updated`);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    });
});

// DELETE: Delete single user with id parameter
app.delete("/user/:id", (req, res) => {
  db.collection("user")
    .doc(`${req.params.id}`)
    .delete()
    .then(() => {
      console.log(`User ${req.params.id} has been deleted`);
      return res.status(200).send(`User ${req.params.id} has been deleted`);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
});

// Export API to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);
