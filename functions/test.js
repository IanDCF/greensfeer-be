// Import necessary Firebase modules
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define Firebase Firestore and Authentication instances
const firestore = admin.firestore();
const auth = admin.auth();

// Set up Cloud Functions for Firebase
exports.createUserProfile = functions.auth.user().onCreate((user) => {
  // Function to create user profile when a new user is created
  // Get user information from Firebase Authentication
  const { uid, email, displayName } = user;

  // Set up initial user profile data
  const userProfile = {
    email,
    displayName,
    connections: [],
    jobHistory: [],
    educationHistory: [],
    // Add other user profile fields as needed
  };

  // Add user profile to Firestore
  return firestore.collection("userProfiles").doc(uid).set(userProfile);
});

exports.updateUserProfile = functions.firestore
  .document("userProfiles/{userId}")
  .onUpdate((change, context) => {
    // Function to update user profile when user profile document is updated
    // Get updated user profile data
    const updatedUserProfile = change.after.data();

    // Update user information in Firebase Authentication (optional)
    const { displayName } = updatedUserProfile;
    if (displayName) {
      return auth.updateUser(context.params.userId, { displayName });
    }
  });

exports.sendConnectionRequest = functions.https.onCall(
  async (data, context) => {
    // Function to send a connection request from one user to another
    // Check that the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to send connection requests."
      );
    }

    // Get sender and recipient user IDs
    const { senderId, recipientId } = data;

    // Check that sender and recipient are valid user IDs
    const [sender, recipient] = await Promise.all([
      firestore.collection("userProfiles").doc(senderId).get(),
      firestore.collection("userProfiles").doc(recipientId).get(),
    ]);
    if (!sender.exists || !recipient.exists) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid sender or recipient ID."
      );
    }

    // Add connection request to recipient's connections collection
    const connectionRequest = {
      senderId,
      recipientId,
      status: "pending",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    await firestore
      .collection("userProfiles")
      .doc(recipientId)
      .collection("connections")
      .doc()
      .set(connectionRequest);
  }
);

exports.acceptConnectionRequest = functions.https.onCall(
  async (data, context) => {
    // Function to accept a connection request
    // Check that the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to accept connection requests."
      );
    }

    // Get connection request ID and recipient user ID
    const { requestId, recipientId } = data;

    // Update connection request status to "accepted"
    await firestore
      .collection("userProfiles")
      .doc(recipientId)
      .collection("connections")
      .doc(requestId)
      .update({ status: "accepted" });

    // Add connection to sender
    const senderId = (
      await firestore
        .collection("userProfiles")
        .doc(recipientId)
        .collection("connections")
        .doc(requestId)
        .get()
    ).data().senderId;
    const connection = { userId: recipientId, status: "accepted" };
    await firestore
      .collection("userProfiles")
      .doc(senderId)
      .collection("connections")
      .doc()
      .set(connection);
  }
);
