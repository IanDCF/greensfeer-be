const { getAuth } = require("firebase-admin/auth");

exports.decodeToken = (idToken) => {
  getAuth()
    .verifyIdToken(idToken)
    .then((decoded) => {
      console.log(decoded);
      console.log(decoded.uid);
      return decoded.uid;
    });
};
