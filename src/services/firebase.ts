import { firestore, rtDBRef } from "../lib/firebase";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  increment,
  writeBatch,
  deleteField,
  serverTimestamp,
  arrayRemove
} from "firebase/firestore";
import {
  contestWriting,
  getFirestoreWriting,
  toObjectElements,
  getFirestoreUser,
  getFirestoreContest,
  commentType,
} from "../type";
import { get, ref, remove, set, update } from "firebase/database";

export const signInWithGoogleInfo = (info: any) => {
  const batch = writeBatch(firestore);

  batch.set(doc(firestore, "writings", info.user.uid), {
    novelDocID: [],
    poemDocID: [],
    scenarioDocID: [],
    totalCommits: {},
  });

  batch.set(doc(firestore, "users", info.user.email), {
    likeWritings: [],
    contests: { host: [], participation: [] },
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
  return batch.commit();
};
export const signupWithEmail = (user: any, username: string) => {
  const batch = writeBatch(firestore);
  try {
    batch.set(doc(firestore, "writings", user.uid), {
      novelDocID: [],
      poemDocID: [],
      scenarioDocID: [],
      totalCommits: {},
    });

    batch.set(doc(firestore, "users", user.email), {
      likeWritings: [],
      contests: { host: [], participation: [] },
      userEmail: user.email.toLowerCase(),
      uid: user.uid,
      username,
      followings: [],
      followers: [],
      dateCreated: Date.now(),
      profileImg: "",
      profileCaption: "",
      contestAuth: false,
    });
  } catch (error) {
    console.log(error);
  } finally {
    return batch.commit();
  }
};
export async function doesEmailExist(userEmail: string) {
  const q = doc(firestore, "users", userEmail);
  const result = await getDoc(q);
  return result.exists();
}

export const getUserByUID = async (uid: string) => {

  try {
    const q = query(collection(firestore, "users"), where("uid", "==", uid));
    return (await getDocs(q)).docs[0].data() as getFirestoreUser;
  } catch (error) {
    console.log(error);
    return {} as getFirestoreUser;
  }
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
  let returnVal: any = [];
  try {
    returnVal = Promise.all(
      docIDs.map(async (docID: string) => {
        const tmp = await getDoc(doc(firestore, "allWritings", docID));
        if (tmp.exists()) {
          const data = tmp.data();
          return { ...data, writingDocID: tmp.id };
        }
      })
    );
  } catch (error) {
    console.log(error);
  } finally {
    return returnVal;
  }
};
export const getDiagram = (writingDocID: string) => {
  return getDoc(doc(firestore, "diagram", writingDocID));
};

export const getFollowersInfinite = async (
  followersUIDArr: string[],
  key: number
) => {
  const tmp = followersUIDArr.slice(key, key + 5);
  return await getDocs(
    query(collection(firestore, "users"), where("uid", "in", tmp))
  );
};

export const getFollowingsInfinite = async (
  followingsUIDArr: string[],
  key: number
) => {
  const tmp = followingsUIDArr.slice(key, key + 5);
  return await getDocs(
    query(collection(firestore, "users"), where("uid", "in", tmp))
  );
};
export const getCommentsInfinite = (commentsDocID: string[], key: number) => {
  let tmp = commentsDocID
    .slice()
    .reverse()
    .slice(key, key + 5);
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
export const addComment = async (
  writingDocID: string,
  writingTitle: string,
  writingOwnerUID: string,
  commentInfo: commentType,
  commentUserInfo: getFirestoreUser
) => {
  try {
    const batch = writeBatch(firestore);
    const commentsDocID = await addDoc(collection(firestore, "comments"), {})
    batch.set(doc(firestore, "comments", commentsDocID.id), commentInfo);

    const tmp: any = {}
    tmp[`comments.${`${commentInfo.dateCreated}_${commentsDocID.id}`}`] =
      commentsDocID.id;
    const writingDocCommentRef = doc(firestore, "allWritings", writingDocID)

    batch.update(writingDocCommentRef, tmp);

    batch.commit();

    if (commentInfo.commentOwnerUID !== writingOwnerUID) {
      const data = {
        dateCreated: commentInfo.dateCreated,
        category: "ADDCOMMENT",
        seen: false,
        info: {
          writingDocID,
          writingTitle,
          writingOwnerUID,
          commentDocID: commentsDocID.id,
          commentUserUID: commentUserInfo.uid,
          commentUsername: commentUserInfo.username,
        },
      };
      set(
        ref(rtDBRef,
          `alarms/${writingOwnerUID}/${commentInfo.dateCreated}_ADDCOMMENT_${commentUserInfo.uid}`
        ),
        data
      )
    }
    return commentsDocID.id;

  } catch (error) {
    return null
  }

}
export const deleteComment = async (
  commentDocID: string,
  writingDocID: string,
  dateCreated: number
) => {
  try {
    const batch = writeBatch(firestore);
    const updates: any = {};
    updates[`comments.${dateCreated}_${commentDocID}`] = deleteField()
    updates["updateAt"] = serverTimestamp()
    batch.delete(doc(firestore, "comments", commentDocID))
    batch.update(doc(firestore, "allWritings", writingDocID), updates)
    await batch.commit()
    return true
  } catch (error) {
    return false
  }
}
export const updateCommentLikes = (like: boolean, commentDocID: string, userUID: string) => {
  try {
    updateDoc(doc(firestore, "comments", commentDocID), {
      likes: like
        ? arrayRemove(userUID)
        : arrayUnion(userUID)
    })
    return true
  } catch (error) {
    return false
  }
};
export const getBestWritings = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1) % 12 === 0 ? 12 : date.getMonth();
  const data: any = (
    await getDoc(doc(firestore, "Rank", `${year}.${3}`))
  ).data();
  const rankArray = [data["FIRST"], data["SECOND"], data["THIRD"]];
  let writingData = await getWritingsArrayInfo(rankArray);
  return writingData;
};

export const getAllWritings = async () => {
  try {
    const docs = await getDocs(collection(firestore, "allWritings"));
    let returnValue: any = [];

    docs.forEach((data) => {
      returnValue.push({ ...data.data(), writingUID: data.id });
    });

    return returnValue;
  } catch (error) {
    console.log(error);
    return [];
  }
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
export const getContestInfo = async (contestDocID: string) => {
  let data: getFirestoreContest | undefined;
  try {
    data = (
      await getDoc(doc(firestore, "contests", contestDocID))
    ).data() as getFirestoreContest;
  } catch (error) {
    console.log(error);
  }
  return data;
};
export const removeAlarm = async (alarmID: string, userUID: string) => {
  try {
    await remove(ref(rtDBRef, `alarms/${userUID}/${alarmID}`));
  } catch (error) {

  }
};

export const participateContest = async (
  contestDocID: string,
  data: getFirestoreWriting,
  collectionNum?: number
) => {
  let tmp = Object.assign({}, data);
  if (collectionNum) {
    tmp.isCollection = false;
    tmp.collection = { 1: tmp.collection[collectionNum] };
  }
  tmp.duplicatedForContest = true;
  try {
    const batch = writeBatch(firestore);
    const newDocID = (await addDoc(collection(firestore, "allWritings"), tmp))
      .id;

    const ref = doc(firestore, "contests", contestDocID);
    const userRef = doc(firestore, "users", data.userEmail);
    const userUpdate: any = {};
    userUpdate[`contests.participation`] = arrayUnion(contestDocID);

    const update: {
      [key: string]: contestWriting;
    } = {};

    update[`writings.${data.userUID}`] = {
      title: data.title,
      updateDate: new Date().getTime(),
      synopsis: data.synopsis,
      writingDocID: newDocID,
      vote: 0,
      collectionTitle: collectionNum ? tmp.collection[1].title : "",
      userUID: data.userUID,
    };

    batch.update(ref, update);
    batch.update(userRef, userUpdate);

    batch.commit();

    return newDocID;
  } catch (error) {
    console.log(error);
  }
  return "";
};

export const vote = (
  contestDocID: string,
  userUID: string,
  writingOwnerUID: string,
  writingDocID: string
) => {
  try {
    let update: any = {};
    update[`whoVoted.${userUID}`] = writingDocID;
    update[`writings.${writingOwnerUID}.vote`] = increment(1);
    return updateDoc(doc(firestore, "contests", contestDocID), update);
  } catch (error) {
    throw new Error("There is an error!");
  }
};
export const makeAlarmSeen = (alarmKey: string, userUID: string) => {
  try {
    let tmp: any = {};
    tmp["seen"] = true;
    return update(ref(rtDBRef, `alarms/${userUID}/${alarmKey}`), tmp)
  } catch (error) {

  }
};
export const removeAllAlarms = (userUID: string) => {
  try {
    remove(ref(rtDBRef, `alarms/${userUID}`))
  } catch (error) {
    console.log(`removeAllAlarms error: ${error}`)
  }
}
export const getAlarms = async (userUID: string) => {
  try {
    const snapshot = (await get(ref(rtDBRef, "alarms/" + userUID)))
    return snapshot;
  } catch (error) {
    console.log(`getAlarms error: ${error}`)
    return null
  }
}