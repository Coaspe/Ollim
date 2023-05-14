import { firestore, rtDBRef, storage } from "../lib/firebase";
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
  addWritingArg,
  genreType,
  getFirestoreUserWritings,
  disclosure,
} from "../type";
import { get, ref, remove, set, update } from "firebase/database";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref as strRef } from "firebase/storage"
const generateResponseMsg = (word: string, success: boolean) => {
  if (success) {
    return [`${word} 성공하였습니다.`, "success", true]
  } else {
    return [`${word} 실패하였습니다.`, "success", true]
  }
}
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
export const updateFollowing = async (followedUserEmail: string, followedUserUID: string, followingState: boolean, followingUserEmail: string, followingUserUID: string, followingUsername: string) => {
  try {
    if (!followingState) {
      const data = {
        dateCreated: new Date().getTime(),
        category: "FOLLOWING",
        seen: false,
        info: {
          followingUserUID,
          followingUsername,
        },
      };
      set(
        ref(rtDBRef,
          `alarms/${followedUserUID}/${data.dateCreated}_FOLLOWING_${followingUserUID}`
        ),
        data
      )
    }

    const batch = writeBatch(firestore)
    batch.update(doc(firestore, "users", followingUserEmail), {
      followings: followingState
        ? arrayRemove(followedUserUID)
        : arrayUnion(followedUserUID)
    })
    batch.update(doc(firestore, "users", followedUserEmail), {
      followers: followingState
        ? arrayRemove(followingUserUID)
        : arrayUnion(followingUserUID)
    })
    await batch.commit()
  } catch (error) {
    console.log(error);
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
    return update(ref(rtDBRef, `alarms/${userUID}/${alarmKey}`), { seen: true })
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

export const editDiagram = async (diagram: any, writingDocID: string) => {
  try {
    const ref = doc(firestore, "allWritings", writingDocID)
    await updateDoc(ref, { diagram })
    return ["변경을 저장했습니다.", "success", true]
  } catch (error) {
    return ["저장을 실패했습니다.", "error", true]
  }
}

export const makeAllAlarmSeen = async (alarmKeys: Array<string>, userUID: string) => {
  try {
    return Promise.all(
      alarmKeys.map((key) =>
        makeAlarmSeen(key, userUID)
      )
    )
  } catch (error) {

  }
}

export const addWriting = async (data: addWritingArg, genre: genreType) => {
  try {
    const batch = writeBatch(firestore)
    const docRef = await addDoc(collection(firestore, "writings"), {})

    batch.set(doc(firestore, `allWritings/${docRef.id}`), {
      ...data,
      killingVerse: [],
      done: false,
      dataCreated: new Date().getTime(),
      genre,
      likes: [],
    })

    const updateWritingsRef = doc(firestore, "writings", data.userUID)
    switch (genre) {
      case "POEM":
        batch.update(updateWritingsRef, {
          poemDocID: arrayUnion(docRef.id)
        })
        break;
      case "NOVEL":
        batch.update(updateWritingsRef, {
          novelDocID: arrayUnion(docRef.id)
        })
        break;
      case "SCENARIO":
        batch.update(updateWritingsRef, {
          scenarioDocID: arrayUnion(docRef.id)
        })
        break;
      default:
        break;
    }
    await batch.commit();
    return generateResponseMsg("생성을", true)

  } catch (error) {
    return generateResponseMsg("생성을", false)
  }
}

export const saveTemporarySave = async (
  contents: any,
  writingDocID: string,
  collectionNum: number) => {

  const date = new Date().getTime()
  const update: any = {}
  update[`collection.${collectionNum}.tempSave`] = { contents, date };
  try {
    await
      await updateDoc(doc(firestore, "allWritings", writingDocID), update)
    return generateResponseMsg("임시저장을", true)
  } catch (error) {
    return generateResponseMsg("임시저장을", false)
  }
}
export const removeTemporarySave = async (
  writingDocID: string,
  collectionNum: number
) => {
  try {
    const update: any = {}
    update[`collection.${collectionNum}.tempSave`] = {};
    await updateDoc(doc(firestore, "allWritings", writingDocID), update)
    return generateResponseMsg("임시저장 삭제를", true)
  } catch (error) {
    return generateResponseMsg("임시저장 삭제를", false)
  }
}
export const deleteWriting = async (
  writingDocID: string,
  genre: genreType) => {
  try {
    const writingInfo = ((await getDoc(doc(firestore, "allWritings", writingDocID))).data())
    if (writingInfo) {
      const totalCommits = ((await getDoc(doc(firestore, "writings", writingInfo.userUID))).data() as getFirestoreUserWritings).totalCommits
      const batch = writeBatch(firestore)

      const writingsRef = doc(firestore, "writings", writingInfo.userUID)

      let commits: any[] = [];
      Object.values(writingInfo.collection).forEach((num: any) => {
        commits.concat(num.commits);
      });

      // Delete writing's past commits
      commits.forEach((commit) => {
        let keys = Object.keys(commit);
        let key = -1
        keys[0] === "memo"
          ? (key = Number(keys[1]))
          : (key = Number(keys[0]));
        delete totalCommits[key];
      });

      // Update Writings collection
      switch (genre) {
        case "POEM":
          batch.update(writingsRef, {
            poemDocID: arrayRemove(writingDocID),
            totalCommits
          })
          break;
        case "NOVEL":
          batch.update(writingsRef, {
            novelDocID: arrayRemove(writingDocID),
            totalCommits
          })
          break;
        case "SCENARIO":
          batch.update(writingsRef, {
            scenarioDocID: arrayRemove(writingDocID),
            totalCommits
          })
          break;
        default:
          break;
      }

      // Update user's writings list
      const userRef = doc(firestore, "users", writingInfo.userEmail)
      batch.update(userRef, { writingDocID: arrayRemove(writingDocID) })

      const genreRef = doc(firestore, "allWritings", writingDocID)

      // Delete writing
      batch.delete(genreRef)

      await batch.commit()
      return generateResponseMsg("글 삭제를", true)
    }
    throw Error()
  } catch (error) {
    return generateResponseMsg("글 삭제를", false)
  }
}

export const commit = async (
  value: any,
  userUID: string,
  writingDocID: string,
  writingTitle: string,
  memo: string,
  collectionNum: number
) => {
  try {
    const date = new Date().getTime();
    const batch = writeBatch(firestore);
    let tmp: any = {};
    tmp[date] = value;
    tmp["memo"] = memo;

    const updates: any = {};
    updates[`collection.${collectionNum}.commits`] = arrayUnion(tmp);
    updates["updateAt"] = serverTimestamp();
    batch.update(doc(firestore, "allWritings", writingDocID), updates)

    const totalCommits = ((await getDoc(doc(firestore, "writings", userUID))).data() as getFirestoreUserWritings).totalCommits
    totalCommits[date] = memo;

    const totalCommitsRef = doc(firestore, "writings", userUID)
    batch.update(totalCommitsRef, { totalCommits })

    const updateTemp: any = {}
    updateTemp[`collection.${collectionNum}.tempSave`] = {};
    const tempSaveRef = doc(firestore, "allWritings", writingDocID)
    batch.update(tempSaveRef, updateTemp)

    // Alarm to followers
    const time = new Date().getTime();

    const userData = (
      await getDocs(
        query(
          collection(firestore, "users"),
          where("uid", "==", userUID)
        )
      )
    ).docs[0].data()

    userData.followers.forEach((uid: string) => {
      const key = `${time}_NEWCOMMIT_${writingDocID}`;
      update(ref(rtDBRef, `alarms/${uid}/${key}`), {
        category: "NEWCOMMIT",
        dateCreated: time,
        seen: false,
        info: {
          writingTitle,
          writingDocID,
          writingOwnerUID: userUID,
          writingOwnerUsername: userData.username,
        },
      })
    })

    await batch.commit();
    return generateResponseMsg("제출을", true)

  } catch (error) {
    return generateResponseMsg("제출을", false)
  }
}
export const addCollectionElement = async (
  writingDocID: string,
  collectionElementNum: number,
  title: string
) => {
  try {
    const update: any = {};
    update[`collection.${collectionElementNum}`] = {
      tempSave: {},
      commits: [],
      title,
    };

    await updateDoc(doc(firestore, "allWritings", writingDocID), update)
    return generateResponseMsg("추가를", true)
  } catch (error) {
    return generateResponseMsg("추가를", false)
  }
}

export const updateBGM = async (
  userUID: string, writingDocID: string, bgm: File
) => {
  try {
    let fileUploadRef = strRef(storage, `${userUID}/BGM/${writingDocID}`);
    await uploadBytes(fileUploadRef, bgm)
    const token = await getDownloadURL(fileUploadRef)
    await updateDoc(doc(firestore, "allWritings", writingDocID), {
      bgm: token
    })
    return generateResponseMsg("업로드를", true)
  } catch (error) {
    return generateResponseMsg("업로드를", false)

  }
}

export const updateTitle = async (writingDocID: string, title: string) => {
  try {
    await updateDoc(doc(firestore, "allWritings", writingDocID), { title })
    return generateResponseMsg("수정을", true)
  } catch (_) {
    return generateResponseMsg("수정을", false)
  }
}
export const updateSynopsis = async (writingDocID: string, synopsis: string) => {
  try {
    await updateDoc(doc(firestore, "allWritings", writingDocID), { synopsis })
    return generateResponseMsg("수정을", true)
  } catch (_) {
    return generateResponseMsg("수정을", false)
  }
}

export const updateDisclosure = async (writingDocID: string, disclosure: disclosure) => {
  try {
    await updateDoc(doc(firestore, "allWritings", writingDocID), { disclosure })
    return generateResponseMsg("수정을", true)
  } catch (_) {
    return generateResponseMsg("수정을", false)
  }
}

export const updateProfileImage = async (userUID: string, userEmail: string, image: File) => {
  try {
    let newFileName = `${Date.now()}_${userUID}`;
    let fileUploadRef = strRef(storage, `${userUID}/profileImg/${newFileName}`)
    await uploadBytes(fileUploadRef, image)
    const token = await getDownloadURL(fileUploadRef)
    await updateDoc(doc(firestore, "users", userEmail), {
      profileImg: token
    })
    return generateResponseMsg("업로드를", true)
  } catch (_) {
    return generateResponseMsg("업로드를", false)
  }
}

export const updateLikeWriting = async (
  likeUserEmail: string,
  likeUserUID: string,
  likedWritingDocID: string,
  likeWritingState: boolean
) => {
  try {
    const batch = writeBatch(firestore)
    const date = new Date().getTime()
    const updateUserRef = doc(firestore, "users", likeUserEmail)
    const updateUser: any = {}
    updateUser[`likeWritings.${likedWritingDocID}`] = likeWritingState ? deleteField() : date
    batch.update(updateUserRef, updateUser)

    const updateWritingRef = doc(firestore, "allWritings", likedWritingDocID)
    const updateWriting: any = {}
    updateWriting[`likes.${likeUserUID}`] = likeWritingState ? deleteField() : date
    batch.update(updateWritingRef, updateWriting)

    await batch.commit()

  } catch (error) {
    console.log(error);

  }
}