const { getAuth } = require("firebase-admin/auth");

exports.decodeToken = (idToken) => {
  getAuth()
    .verifyIdToken(idToken)
    .then((decoded) => {
      return decoded.uid;
    });
};
