var admin = require("firebase-admin");
var uid = process.argv[2];

var serviceAccount = require("./angular-firebase-dashboa-7dc92-firebase-adminsdk-b7mmn-347955e6ce.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("custom claims set for user: ", uid);
    process.exit();
  })
  .catch((error) => {
    console.log("error", error);
    process.exit(1);
  });
