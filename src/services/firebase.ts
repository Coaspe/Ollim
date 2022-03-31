import { firestore, rtDBRef } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { toObjectElements } from "../type";
import { ref, remove } from "firebase/database";

export const signInWithGoogleInfo = (info: any) => {
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
    contestAuth: false,
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
export const getCommentsInfinite = (commentsDocID: string[], key: number) => {
  let tmp = commentsDocID
    .slice()
    .reverse()
    .slice(key, key + 5);
  console.log(tmp);

  return getDocs(
    query(collection(firestore, "comments"), where("__name__", "in", tmp))
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

  returnValue.sort((a: any, b: any) => b.likes.length - a.likes.length);

  return returnValue.slice(0, 3);
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

export const getContetsArrayInfo = (contestsDocID: string[]) => {
  return Promise.all(
    contestsDocID.map(async (docID: string) => {
      const tmp = await getDoc(doc(firestore, "contests", docID));
      if (tmp.exists()) {
        const data = tmp.data();
        return { ...data, contestDocID: tmp.id };
      }
    })
  );
};

export const removeAlarm = (alarmID: string, userUID: string) => {
  return remove(ref(rtDBRef, `alarms/${userUID}/${alarmID}`));
};
