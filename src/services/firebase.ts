import { firebase, firestore, rtDBRef } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { toObjectElements } from "../type";

export const singInWithGoogleInfoToFB = (info: any) => {
  setDoc(doc(firestore, "writings", info.user.uid), {
    novelDocID: [],
    poemDocID: [],
    scenarioDocID: [],
    totalCommits: {},
  });
  return setDoc(doc(firestore, "users", info.user.email), {
    userEmail: info.user.email.toLowerCase(),
    uid: info.user.uid,
    username: info.user.displayName.toLowerCase(),
    followings: [],
    followers: [],
    dateCreated: Date.now(),
    profileImg: info.user.photoURL,
    profileCaption: "",
  });
};

export async function doesEmailExist(userEmail: string) {
  const q = doc(firestore, "users", userEmail);
  const result = await getDoc(q);
  return result.exists();
}

export const getUserByUID = async (uid: string) => {
  const q = query(collection(firestore, "users"), where("uid", "==", uid));
  return getDocs(q);
};
export const getUserByEmail = async (email: string) => {
  return getDoc(doc(firestore, "users", email));
};

export const getUserWritings = async (userUID: string) => {
  return (await getDoc(doc(firestore, "writings", userUID))).data();
};
export const getWritingInfo = async (writingDocID: string) => {
  return (await getDoc(doc(firestore, "allWritings", writingDocID))).data();
};

export const addElements = (elements: toObjectElements) => {
  addDoc(collection(firestore, "test"), elements);
};

export const getWritingsArrayInfo = (docIDs: Array<string>) => {
  return Promise.all(
    docIDs.map(async (docID: string) => {
      const tmp = await getDoc(doc(firestore, "allWritings", docID));
      if (tmp.exists()) {
        const data = tmp.data();
        console.log(data);
        return { ...data, writingDocID: tmp.id };
      }
    })
  );
};
export const getDiagram = (writingDocID: string) => {
  return getDoc(doc(firestore, "diagram", writingDocID));
};

export const getFollowersInfinite = async (
  followersEmailArr: string[],
  key: number
) => {
  const tmp = followersEmailArr.slice(key, key + 5);
  return await getDocs(
    query(collection(firestore, "users"), where("__name__", "in", tmp))
  );
};

export const getFollowingsInfinite = async (
  followingsEmailArr: string[],
  key: number
) => {
  const tmp = followingsEmailArr.slice(key, key + 5);
  return await getDocs(
    query(collection(firestore, "users"), where("__name__", "in", tmp))
  );
};

export const getComments = (commentsDocID: string[]) => {
  return getDocs(
    query(
      collection(firestore, "comments"),
      where("__name__", "in", commentsDocID)
    )
  );
};

export const getBestWritings = async () => {
  const docs = await getDocs(
    query(
      collection(firestore, "allWritings"),
      where("dateCreated", ">=", 1646092800000),
      where("dateCreated", "<=", 1648771199000),
      orderBy("dateCreated", "desc")
    )
  );
  let returnValue: any = [];

  docs.forEach((data) => {
    if (data.data().likes.length > 0) {
      returnValue.push({ ...data.data(), writingUID: data.id });
    }
  });

  returnValue.sort((b: any, a: any) => b.likes.length - a.likes.length);

  return returnValue.slice(0, 2);
};
export const getAllWritings = async () => {
  const docs = await getDocs(collection(firestore, "allWritings"));
  let returnValue: any = [];

  docs.forEach((data) => {
    returnValue.push({ ...data.data(), writingUID: data.id });
  });

  return returnValue;
};
export const getAllUsers = async () => {
  const docs = await getDocs(collection(firestore, "users"));
  let returnValue: any = [];
  docs.forEach((data) => returnValue.push(data.data()));
  return returnValue;
};

export const text = async () => {
  const docs = (
    await getDoc(doc(firestore, "poem", "Fi37T65kdJXOGnt61647"))
  ).data();
  setDoc(doc(firestore, "allWritings", "Fi37T65kdJXOGnt61647"), { ...docs });
};
// export const copyPasteCommits = async () => {
//   let s = await getDocs(collection(firestore, "poem"));
//   s.forEach(async (document: DocumentData) => {
//     const currentCommits = (
//       (await getDoc(doc(firestore, "poem", document.id))).data() as DocumentData
//     ).commits;
//     const currentTempSave = (
//       (await getDoc(doc(firestore, "poem", document.id))).data() as DocumentData
//     ).tempSave;
//     const update: any = {};
//     update["isCollection"] = false;
//     update["collection.1.commits"] = currentCommits;
//     update["collection.1.tempSave"] = currentTempSave;
//     updateDoc(doc(firestore, "poem", document.id), update);
//   });
// };

// export const copyPasteCommitsNovel = async () => {
//   let s = await getDocs(collection(firestore, "novel"));
//   s.forEach(async (document: DocumentData) => {
//     const currentCommits = (
//       (
//         await getDoc(doc(firestore, "novel", document.id))
//       ).data() as DocumentData
//     ).commits;
//     const currentTempSave = (
//       (
//         await getDoc(doc(firestore, "novel", document.id))
//       ).data() as DocumentData
//     ).tempSave;
//     const update: any = {};
//     update["isCollection"] = false;
//     update["collection.1.commits"] = currentCommits;
//     update["collection.1.tempSave"] = currentTempSave;
//     updateDoc(doc(firestore, "novel", document.id), update);
//   });
// };

// export const edit = async () => {
//   let s = (
//     (await getDoc(
//       doc(firestore, "poem", "fjaG0EG64pq39AFWHFp3")
//     )) as DocumentData
//   ).data();
//   let objec: any = Object.values(s.collection)[0];
//   let update: any = {};
//   update["collection.1"] = objec;
//   updateDoc(doc(firestore, "poem", "fjaG0EG64pq39AFWHFp3"), update);
// };

// export const integration = async () => {
//   const novelDocs = await getDocs(collection(firestore, "novel"));
//   const poemDocs = await getDocs(collection(firestore, "poem"));
//   novelDocs.forEach((data) => {
//     setDoc(doc(firestore, "allWritings", data.id), data.data());
//   });
//   poemDocs.forEach((data) => {
//     setDoc(doc(firestore, "allWritings", data.id), data.data());
//   });
// };

// export const giveLikesLength = async () => {
//   const docs = await getDocs(collection(firestore, "allWritings"));
//   docs.forEach((data) => {
//     setDoc(doc(firestore, "allWritings", data.id), {
//       ...data.data(),
//       likesLength: 0,
//     });
//   });
// };
