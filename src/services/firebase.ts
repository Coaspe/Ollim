import { firebase, firestore, rtDBRef } from "../lib/firebase";
import {
  updateDoc,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from "firebase/firestore";
import { addNovelScenarioArg, addPoemArg, toObjectElements } from "../type";

export const singInWithGoogleInfoToFB = (info: any) => {
  setDoc(doc(firestore, "writings", info.user.uid), {
    novelDocID: [],
    poemDocID: [],
    scenarioDocID: [],
    totalCommits: [],
  })
  return setDoc(doc(firestore, "users", info.user.email), {
    userEmail: info.user.email.toLowerCase(),
    uid: info.user.uid,
    username: info.user.displayName.toLowerCase(),
    following: [],
    followers: [],
    writingsDocId: [],
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

export const addPoem = async (data: addPoemArg) => {
  const docRef = await addDoc(collection(firestore, "poem"), {
    ...data,
    killingVerse: [],
    tempSave: [],
    done: false,
    dateCreated: new Date().getTime(),
    genre: "POEM",
  });
  
  updateDoc(doc(firestore, "writings", data.userUID), {
    poemDocID: arrayUnion(docRef.id)
  })

  updateDoc(doc(firestore, "users", data.userEmail), {
    writingsDocID: arrayUnion(docRef.id)
  })
}
export const addNovel = async (data: addNovelScenarioArg) => {
  const docRef = await addDoc(collection(firestore, "novel"), {
    ...data,
    killingVerse: [],
    tempSave: [],
    done: false,
    dateCreated: new Date().getTime(),
    genre: "NOVEL",
  });
  updateDoc(doc(firestore, "writings", data.userUID), {
    novelDocID: arrayUnion(docRef.id)
  })
  updateDoc(doc(firestore, "users", data.userEmail), {
    writingsDocID: arrayUnion(docRef.id)
  })
}
export const addScenario = async (data: addNovelScenarioArg) => {
  const docRef = await addDoc(collection(firestore, "scenario"), {
    ...data,
    killingVerse: [],
    tempSave: [],
    done: false,
    dateCreated: new Date().getTime(),
    genre: "SCENARIO",
  });
  
  updateDoc(doc(firestore, "writings", data.userUID), {
    scenarioDocID: arrayUnion(docRef.id)
  })

  updateDoc(doc(firestore, "users", data.userEmail), {
    writingsDocID: arrayUnion(docRef.id)
  })
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
      const id = tmp.id
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
// export const commit = async (value: {
//     type: string;
//     children: {
//         type: string;
//         text: string;
//         fontSize: number;
//         fontStyle: string;
//     }[];
// }[], writingDocID: string, genre: string, memo: string, userUID: string) => {
//   const date = new Date().getTime()
  
//   let tmp: any = {}
//   tmp[date] = value
//   tmp[memo] = memo
//   updateDoc(doc(firestore, genre.toLocaleLowerCase(), writingDocID), {
//   commits: arrayUnion(tmp)
//   }).catch((err)=>{console.log(err);
//   })

//   let totalCommits: any = (await getDoc(doc(firestore, "writings", userUID))).data()
//   totalCommits = totalCommits.totalCommits
//   totalCommits[date] = memo
//   updateDoc(doc(firestore, "writings", userUID), {
//     totalCommits
//   }).catch((err)=>{console.log(err);
//   })

// }

// export const deleteTempSave = (tempSaveDocID: string, writingDocID: string, genre: string) => {
//   deleteDoc(doc(firestore, "tempSave", tempSaveDocID))
//   updateDoc(doc(firestore, genre.toLocaleLowerCase(), writingDocID), {
//     tempSave: ""
//   })
// }

// export const temporarySave = async (contents: {
//     type: string;
//     children: {
//         type: string;
//         text: string;
//         fontSize: number;
//         fontStyle: string;
//     }[];
// }, userUID: string, writingDocID: string, genre: string) => {
//   const date = new Date().getTime()
//    const tempSaveDocID = (await addDoc(collection(firestore, "tempSave"), {
//      date,
//      contents,
//      userUID,
//      writingDocID
//    })).id
  
//    updateDoc(doc(firestore, genre.toLocaleLowerCase(), writingDocID), {
//   tempSave: tempSaveDocID
//   })
// }