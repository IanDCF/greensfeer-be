const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
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
    role,
    newsletter,
    notifications,
    location,
  } = reqBody;
  const userLocation = {
    city: city || null,
    state_province: state_province || null,
    country: country || null,
  };
  return {
    first_name,
    last_name,
    email,
    profile_picture: profile_picture || null,
    profile_banner: profile_banner || null,
    headline: headline || null,
    linkedin: linkedin || null,
    location,
    about: about || "",
    role,
    newsletter,
    notifications,
  };
};
// const { checkUser } = require("../services/checkUser");
const { decodeToken } = require("../services/decodeToken");

// Authentication: register new user
// POST: create a database entry for user opon front end sign up
// req from client AuthProvider signUp function, line 28
exports.entryForSignUp = (req, res) => {
  const idToken = req.body.idToken;
  getAuth()
    .verifyIdToken(idToken)
    .then((decoded) => {
      return decoded.uid;
    })
    .then((uid) => {
      db.collection("user")
        .doc(`${uid}`)
        .set({ uid: `${uid}` })
        .then((time) => {
          return res.status(201).send({
            status: 201,
            message: `user ${uid} created at ${time}`,
          });
        });
    })
    .catch((error) => {
      res.status(500).send({
        status: 500,
        message: `error: ${error}`,
      });
    });
};

// POST: create new user document in 'user' collection
exports.createUser = (req, res) => {
  const userBody = buildUserBody(req.body);
  const created_at = new Date().toISOString();
  const user = createUserSchema.safeParse(userBody);
  if (!user.success) {
    return res.status(400).send(user.error.errors);
  }
  getAuth()
    .verifyIdToken(req.body.idToken)
    .then((decoded) => {
      return decoded.uid;
    })
    .then((uid) => {
      const userRef = db.collection("user").doc(uid);
      return userRef.update({ ...user.data, created_at });
    })
    .then((newUser) => {
      return res.status(201).send({
        message: `Successfully created new user: ${newUser}`,
      });
    })
    .catch((error) => {
      console.log(error);
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

// GET: users whose first_name concatenated with last_name matches the search input
exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const snapshot = await db.collection("user").get();
    const users = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const fullName = `${data.first_name} ${data.last_name}`;
      if (fullName.toLowerCase().includes(query.toLowerCase())) {
        users.push(data);
      }
    });
    return res.status(200).send(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Server error" });
  }
};

// GET: active user signed in on front-end
exports.currentUser = async (req, res) => {
  const use = {
    first_name: "John",
    last_name: "Doe",
    headline: "Software Engineer",
    location: {
      city: "San Francisco",
      state_province: "California",
      country: "United States",
    },
    profile_picture: "https://example.com/profile-picture.jpg",
    profile_banner: "https://example.com/profile-banner.jpg",
    about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };
  const decoded = await getAuth()
    .verifyIdToken(req.headers.bearertoken)
    .then((decoded) => {
      return decoded.uid;
    });
  const entry = await (
    await db.collection("user").doc(`${decoded}`).get()
  ).data();
  let {
    about,
    first_name,
    last_name,
    headline,
    location,
    profile_banner,
    profile_picture,
    role,
    created_at,
  } = entry;
  res.status(200).json({
    about,
    first_name,
    last_name,
    headline,
    location,
    profile_banner,
    profile_picture,
    role,
    created_at,
  });
};

// PATCH: update single user document with id
exports.updateUser = (req, res) => {
  const {
    first_name,
    last_name,
    profile_picture,
    profile_banner,
    headline,
    role,
    location,
    about,
  } = req.body.update;
  const updateContent = {
    first_name,
    last_name,
    profile_picture,
    profile_banner,
    headline,
    role,
    location,
    about,
  };
  const updateObject = updateUserSchema.safeParse(updateContent);
  if (!updateObject.success) {
    return res.status(400).send(updateObject.error.errors);
  }

  const updateFields = (update) => {
    const populated = {};
    for (const prop in update) {
      if (update[`${prop}`]) {
        populated[`${prop}`] = update[`${prop}`];
      }
    }
    populated.updated_at = new Date().toISOString();
    return populated;
  };
  db.collection("user")
    .doc(req.params.id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userRef = db.collection("user").doc(req.params.id);
        return userRef.update(updateFields(updateObject.data));
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
