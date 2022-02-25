const { getFirestore, FieldValue } = require("firebase-admin/firestore");

var admin = require("firebase-admin");
var serviceAccount = require("C:/ollim-df732-firebase-adminsdk-uwq7f-aa5570d83e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ollim-df732-default-rtdb.firebaseio.com",
});
const firestore = getFirestore();

exports.commit = async (value, writingDocID, genre, memo, userUID) => {
  const date = new Date().getTime();
  const batch = firestore.batch();

  let tmp = {};
  tmp[date] = value;
  tmp["memo"] = memo;

  const writingRef = firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID);

  batch.update(writingRef, {
    commits: FieldValue.arrayUnion(tmp),
  });

  let totalCommits = (
    await firestore.collection("writings").doc(userUID).get()
  ).data();

  totalCommits = totalCommits.totalCommits;
  totalCommits[date] = memo;

  const totalCommitsRef = firestore.collection("writings").doc(userUID);
  batch.update(totalCommitsRef, { totalCommits });

  const tempSaveRef = firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID);
  batch.update(tempSaveRef, { tempSave: {} });

  return batch.commit();
};

exports.temporarySave = async (contents, writingDocID, genre) => {
  const date = new Date().getTime();

  // update temporary save docID of writing
  return firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID)
    .update({ tempSave: { contents, date } });
};

exports.editDiagram = (diagram, writingDocID, genre) => {
  return firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID)
    .update({ diagram });
};
