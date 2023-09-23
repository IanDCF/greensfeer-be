const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

const notificationRef = db.collection("notification");

// GET single user's notifications
exports.getNotifications = async (req, res) => {
  const owner_id = req.params.owner_id;
  const snapshot = await notificationRef
    .where("owner_id", "==", owner_id)
    .get();
  if (snapshot.empty) {
    return res.status(204).send({
      status: 204,
      message: `No notifications for ${owner_id}`,
    });
  }

  const result = snapshot.docs.map((doc) => doc.data());
  return res.status(200).send(result);
};

// DELETE single notification
exports.deleteNotification = async (req, res) => {
  const owner_id = req.body.owner_id;
  const notification_id = req.params.notification_id;
  const notificationDoc = await notificationRef.doc(notification_id).get();
  if (!notificationDoc.exists) {
    return res.status(404).send({
      status: 404,
      message: `Notification with id ${notification_id} not found`,
    });
  }

  if (notificationDoc.data().owner_id !== owner_id) {
    return res.status(403).send({
      status: 403,
      message: `You are not authorized to delete this notification`,
    });
  }

  await notificationRef.doc(notification_id).delete();
  return res.status(204).send();
};
