import { useEffect, useState } from "react";
import { getUserWritings, getWritingsArrayInfo } from "../services/firebase";
import {
  gerneDocIDType,
  getFirestoreUserWritings,
  getFirestoreWriting,
} from "../type";

const useGetGenreWritings = (uid: string | undefined, genre: string) => {
  const [writingsInfo, setWritingsInfo] = useState<Array<getFirestoreWriting>>(
    []
  );

  // Get and Set profileOwner's writings information function
  const getWritings = async (userWritings: getFirestoreUserWritings) => {
    const writingsInfo = userWritings[
      `${genre.toLocaleLowerCase()}DocID` as gerneDocIDType
    ]
      ? (
          (await getWritingsArrayInfo(
            userWritings[`${genre.toLocaleLowerCase()}DocID` as gerneDocIDType]
          )) as Array<getFirestoreWriting>
        ).sort((a, b) => b.dateCreated - a.dateCreated)
      : [];
    console.log(writingsInfo);
    setWritingsInfo(writingsInfo);
  };
  useEffect(() => {
    getUserWritings(uid as string).then((res) => {
      getWritings(res as getFirestoreUserWritings);
    });
  }, [uid]);

  return writingsInfo;
};

export default useGetGenreWritings;
