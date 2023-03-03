const admin = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const db = getFirestore();

const isEmpty = (str) => {
  if (str === "") return true;
};

// Authentication: register new user
// POST: create new user document in 'user' collection
exports.registerUser = (req, res) => {
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
};

// Authentication: return user custom id token on login
exports.loginUser = (req, res) => {
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
};

// GET: single user with id
exports.singleUser = (req, res) => {
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
};

// GET: all users
exports.allUsers = async (req, res) => {
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
};

// PATCH: update single user document with id
exports.updateUser = (req, res) => {
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
};

// DELETE: single user with id
exports.deleteUser = (req, res) => {
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
};
