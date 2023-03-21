const { v4: uuidv4 } = require("uuid");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const notificationRef = db.collection("notification");

// POST new notification
exports.sendNotification = async (notificationObj) => {
  const {
    owner_id,
    actor_id,
    notification_type,
    notification_content,
    delivered,
    link,
  } = notificationObj;

  // validate input fields
  if (!owner_id || !actor_id || !notification_type || !notification_content) {
    return res.status(400).send({
      status: 400,
      message:
        "Owner ID, actor ID, notification type, and notification content are required fields",
    });
  }
  // Generate a unique ID for the notification
  const notification_id = uuidv4();

  const newNotification = {
    notification_id,
    owner_id,
    actor_id,
    notification_type,
    notification_content,
    delivered: delivered || false, // Set delivered to false if not provided in the request
    link: link || null, // Set link to null if not provided in the request
    created_at: new Date().toISOString(),
  };

  notificationRef
    .doc(`${notification_id}`)
    .set(newNotification)
    .then(() => {
      return {
        status: 201,
        message: `Notification: ${notification_id} has been sent to user: ${owner_id}`,
      };
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
};
