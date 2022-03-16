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

} from "firebase/firestore";
import { toObjectElements } from "../type";

export const singInWithGoogleInfoToFB = (info: any) => {
  setDoc(doc(firestore, "writings", info.user.uid), {
    novelDocID: [],
    poemDocID: [],
    scenarioDocID: [],
    totalCommits: {},
  })
  return setDoc(doc(firestore, "users", info.user.email), {
    userEmail: info.user.email.toLowerCase(),
    uid: info.user.uid,
    username: info.user.displayName.toLowerCase(),
    followings: [],
    followers: [],
    writingsDocID: [],
    dateCreated: Date.now(),
    profileImg: info.user.photoURL,
    profileCaption: "",
  });
}

export async function doesEmailExist(userEmail: string) {
  const q = doc(firestore, "users", userEmail);
  const result = await getDoc(q);
  return result.exists();
}

export const getUserByUID = async (uid: string) => {
  const q = query(collection(firestore, "users"), where("uid", "==", uid))
  return getDocs(q)
}
export const getUserByEmail = async (email: string) => {
  return getDoc(doc(firestore, "users", email))
}

export const getUserWritings = async (userUID: string) => {
  return (await getDoc(doc(firestore, "writings", userUID))).data()
}
export const getWritingInfo = async (writingDocID: string, genre: string) => {
  return (await getDoc(doc(firestore, genre.toLowerCase(), writingDocID))).data()
}

export const addElements = (elements: toObjectElements) => {
  addDoc(collection(firestore, "test"), elements)
}

export const getPoemArrayInfo = (poemDocIDs: Array<string>) => {
  return Promise.all(poemDocIDs.map(async (docID: string) => {
    const tmp = await getDoc(doc(firestore, "poem", docID))
    if (tmp.exists()) {
      const data = tmp.data()
      console.log(data);
      return {...data, id: tmp.id}
    }
  }
  ))
}
export const getNovelArrayInfo = (novelDocIDs: Array<string>) => {
  return Promise.all(novelDocIDs.map(async (docID: string) => {
  const tmp = (await getDoc(doc(firestore, "novel", docID)))
    if (tmp.exists()) {
      const data = tmp.data()
      return {...data, id: tmp.id}
    }
  }
  ))
}
export const getScenarioArrayInfo = (scenarioDocIDs: Array<string>) => {
  return Promise.all(scenarioDocIDs.map(async (docID: string) => {
    const tmp = (await getDoc(doc(firestore, "scenario", docID)))
    if (tmp.exists()) {
      const data = tmp.data()
      const id = tmp.id
      return {...data, id: tmp.id}
    }
  }
  ))
}
export const getDiagram = (writingDocID: string) => {
  return getDoc(doc(firestore, "diagram", writingDocID))
}

export const getFollowersInfinite = async (followersEmailArr: string[], key: number) => {
  const tmp = followersEmailArr.slice(key, key + 5);
  return await getDocs(
    query(collection(firestore, "users"), where("__name__", "in", tmp))
  );
};

export const getFollowingsInfinite = async (followingsEmailArr: string[], key: number) => {
  const tmp = followingsEmailArr.slice(key, key + 5);
  return await getDocs(
    query(collection(firestore, "users"), where("__name__", "in", tmp))
  );
};

export const getComments = (commentsDocID: string[]) => {

  return getDocs(
    query(collection(firestore, "comments"), where("__name__", "in", commentsDocID))
  )
}

export const copyPasteCommits = async () => {
  let s = (await getDocs(collection(firestore, "poem")))
  s.forEach(async (document: DocumentData) => {
    const currentCommits = ((await getDoc(doc(firestore, "poem", document.id))).data() as DocumentData).commits
    const currentTempSave = ((await getDoc(doc(firestore, "poem", document.id))).data() as DocumentData).tempSave
    const update: any = {}
    update['isCollection'] = false
    update["collection.1.commits"] = currentCommits
    update["collection.1.tempSave"] = currentTempSave
    updateDoc(doc(firestore, "poem", document.id), update)
  })
}

export const copyPasteCommitsNovel = async () => {
  let s = (await getDocs(collection(firestore, "novel")))
  s.forEach(async (document: DocumentData) => {
    const currentCommits = ((await getDoc(doc(firestore, "novel", document.id))).data() as DocumentData).commits
    const currentTempSave = ((await getDoc(doc(firestore, "novel", document.id))).data() as DocumentData).tempSave
    const update: any = {}
    update['isCollection'] = false
    update["collection.1.commits"] = currentCommits
    update["collection.1.tempSave"] = currentTempSave
    updateDoc(doc(firestore, "novel", document.id), update)
  })
}

export const edit = async () => {
  let s =(await getDoc(doc(firestore, "poem", "fjaG0EG64pq39AFWHFp3")) as DocumentData).data()
  let objec: any = Object.values(s.collection)[0]
  let update: any = {}
  update["collection.1"] = objec
  updateDoc(doc(firestore, "poem", "fjaG0EG64pq39AFWHFp3"), update)
  console.log(objec);
  
}