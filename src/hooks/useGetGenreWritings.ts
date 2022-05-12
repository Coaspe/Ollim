import { useEffect, useState } from "react";
import { getUserWritings, getWritingsArrayInfo } from "../services/firebase";
import { gerneDocIDType, getFirestoreWriting } from "../type";

const useGetGenreWritings = (uid: string | undefined, genre: string) => {
  const [writingsInfo, setWritingsInfo] = useState<Array<getFirestoreWriting>>(
    []
  );

  // Get and Set profileOwner's writings information function
  const getWritings = async (uid: string) => {
    try {
      const userWritings = await getUserWritings(uid as string);
      if (userWritings) {
        const writingsInfo = userWritings[
          `${genre.toLocaleLowerCase()}DocID` as gerneDocIDType
        ]
          ? (
              (await getWritingsArrayInfo(
                userWritings[
                  `${genre.toLocaleLowerCase()}DocID` as gerneDocIDType
                ]
              )) as Array<getFirestoreWriting>
            ).sort((a, b) => b.dateCreated - a.dateCreated)
          : [];
        setWritingsInfo(writingsInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    uid && getWritings(uid);
  }, [uid]);

  return writingsInfo;
};

export default useGetGenreWritings;
