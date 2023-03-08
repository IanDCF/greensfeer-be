const admin = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const db = getFirestore();
const { createUserSchema, updateUserSchema } = require("../schemas/userSchema");
const buildUserBody = (reqBody) => {
  const {
    first_name,
    last_name,
    email,
    profile_picture,
    profile_banner,
    headline,
    linkedin,
    city,
    state_province,
    country,
    about,
    created_at,
  } = reqBody;
  const userLocation = {
    city: city || null,
    state_province: state_province || null,
    country: country || null,
  };
  return {
    first_name: first_name,
    last_name: last_name,
    email: email,
    profile_picture: profile_picture || null,
    profile_banner: profile_banner || null,
    headline: headline || null,
    linkedin: linkedin || null,
    location: userLocation,
    about: about || null,
    created_at: created_at || null,
  };
}
// Authentication: register new user
// POST: create new user document in 'user' collection
exports.createUser = (req, res) => {
  const userBody = buildUserBody(req.body)
  const user = createUserSchema.safeParse(userBody);
  if (!user.success) {
    return res.status(400).send(user.error.errors);
  }
  admin
    .auth()
    .createUser(user.data)
    .then((userRecord) => {
      console.log(userRecord);
      const uid = userRecord.uid;
      db.collection("user")
        .doc(`${uid}`)
        .set({ ...user.data, uid });
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
  const userBody = buildUserBody(req.body)
  const updateObject = updateUserSchema(userBody)
  if (!user.success) {
    return res.status(400).send(user.error.errors);
  }
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
