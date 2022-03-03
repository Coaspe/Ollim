import { storageRef } from "./lib.js";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Init
initializeApp({
  credential: cert("C:/ollim-df732-firebase-adminsdk-uwq7f-aa5570d83e.json"),
  storageBucket: "gs://ollim-df732.appspot.com",
  databaseURL: "https://ollim-df732-default-rtdb.firebaseio.com",
});

// Storage bucket
const bucket = getStorage().bucket("gs://ollim-df732.appspot.com");

// Firestore
const firestore = getFirestore();

export const updateProfileImage = async (userUID, userEmail, profileImg) => {
  let newFileName = `${Date.now()}_${userUID}`;
  let fileUpload = bucket.file(`${userUID}/profileImg/${newFileName}`);
  const result = await new Promise((resolve, reject) => {
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: profileImg.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject(error);
    });

    blobStream.on("finish", () => {
      resolve(newFileName);
    });

    blobStream.end(profileImg.buffer);
  });
  if (result === newFileName) {
    const token = await storageRef
      .child(`${userUID}/profileImg/${newFileName}`)
      .getDownloadURL();

    firestore.collection("users").doc(userEmail).update({
      profileImg: token,
    });
  }
};

export const commit = async (value, writingDocID, genre, memo, userUID) => {
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

export const temporarySave = async (contents, writingDocID, genre) => {
  const date = new Date().getTime();

  // update temporary save docID of writing
  return firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID)
    .update({ tempSave: { contents, date } });
};

export const editDiagram = (diagram, writingDocID, genre) => {
  return firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID)
    .update({ diagram });
};

export const updateSynopsis = (genre, writingDocID, synopsis) => {
  return firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID)
    .update({ synopsis });
};

export const updateDisclosure = (genre, writingDocID, disclosure) => {
  return firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID)
    .update({ disclosure });
};

export const addPoem = async (data) => {
  const batch = firestore.batch();
  const docRef = await firestore.collection("poem").add();

  batch.set(firestore.collection("poem").doc(docRef.id), {
    ...data,
    killingVerse: [],
    tempSave: {},
    done: false,
    commits: [],
    dateCreated: new Date().getTime(),
    genre: "POEM",
  });

  const updateWritingsRef = firestore.collection("writings").doc(data.userUID);
  batch.update(updateWritingsRef, {
    poemDocID: FieldValue.arrayUnion(docRef.id),
  });

  const updateUsersRef = firestore.collection("users").doc(data.userEmail);
  batch.update(updateUsersRef, {
    writingsDocID: FieldValue.arrayUnion(docRef.id),
  });

  return batch.commit();
};
export const addNovel = async (data) => {
  const batch = firestore.batch();
  const docRef = await firestore.collection("novel").add({});

  batch.set(firestore.collection("novel").doc(docRef.id), {
    ...data,
    killingVerse: [],
    tempSave: {},
    done: false,
    commits: [],
    dateCreated: new Date().getTime(),
    genre: "NOVEL",
  });

  const updateWritingsRef = firestore.collection("writings").doc(data.userUID);
  batch.update(updateWritingsRef, {
    novelDocID: FieldValue.arrayUnion(docRef.id),
  });

  const updateUsersRef = firestore.collection("users").doc(data.userEmail);
  batch.update(updateUsersRef, {
    writingsDocID: FieldValue.arrayUnion(docRef.id),
  });

  return batch.commit();
};
export const addScenario = async (data) => {
  const batch = firestore.batch();
  const docRef = await firestore.collection("scenario").add();

  batch.set(firestore.collection("scenario").doc(docRef.id), {
    ...data,
    killingVerse: [],
    commits: [],
    tempSave: {},
    done: false,
    dateCreated: new Date().getTime(),
    genre: "SCENARIO",
  });

  const updateWritingsRef = firestore.collection("writings").doc(data.userUID);
  batch.update(updateWritingsRef, {
    scenarioDocID: FieldValue.arrayUnion(docRef.id),
  });

  const updateUsersRef = firestore.collection("users").doc(data.userEmail);
  batch.update(updateUsersRef, {
    writingsDocID: FieldValue.arrayUnion(docRef.id),
  });

  return batch.commit();
};

export const deleteWriting = async (writingDocID, genre) => {
  // Get writingInfo
  const writingInfo = (
    await firestore
      .collection(genre.toLocaleLowerCase())
      .doc(writingDocID)
      .get()
  ).data();

  // User's total commits
  const totalCommits = (
    await firestore.collection("writings").doc(writingInfo.userUID).get()
  ).data().totalCommits;

  // Batch update
  const batch = firestore.batch();

  const writingsRef = firestore.collection("writings").doc(writingInfo.userUID);

  // Delete writing's past commits
  writingInfo.commits.forEach((commit) => {
    let keys = Object.keys(commit);
    keys[0] === "memo"
      ? (keys = keys[1].toString())
      : (keys = keys[0].toString());
    delete totalCommits[keys];
  });

  // Update Writings collection
  if (genre === "NOVEL") {
    batch.update(writingsRef, {
      novelDocID: FieldValue.arrayRemove(writingDocID),
      totalCommits,
    });
  } else if (genre === "POEM") {
    batch.update(writingsRef, {
      poemDocID: FieldValue.arrayRemove(writingDocID),
      totalCommits,
    });
  } else if (genre === "SCENARIO") {
    batch.update(writingsRef, {
      scenarioDocID: FieldValue.arrayRemove(writingDocID),
      totalCommits,
    });
  }

  // Update user's writings list
  const userRef = firestore.collection("users").doc(writingInfo.userEmail);
  batch.update(userRef, { writingDocID: FieldValue.arrayRemove(writingDocID) });

  const genreRef = firestore
    .collection(writingInfo.genre.toLocaleLowerCase())
    .doc(writingDocID);
  // Delete writing
  batch.delete(genreRef);

  return batch.commit();
};

export const updateKillingVerse = (genre, writingDocID, killingVerse) => {
  return firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID)
    .update({ killingVerse });
};

export const updateMemo = (genre, writingDocID, memo) => {
  return firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID)
    .update({ memo });
};

export const updateCover = (genre, writingDocID, cover) => {
  return firestore
    .collection(genre.toLocaleLowerCase())
    .doc(writingDocID)
    .update({ cover });
};
