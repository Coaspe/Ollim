import { useEffect, useState } from "react";
import { getUserWritings, getWritingsArrayInfo } from "../services/firebase";
import { getFirestoreUserWritings, getFirestoreWriting } from "../type";

const useGetWritings = (uid: string | undefined, contextUid: string | null) => {
  // Profile owner's poems list
  const [poems, setPoems] = useState<Array<getFirestoreWriting>>([]);
  // Profile owner's novels list
  const [novels, setNovels] = useState<Array<getFirestoreWriting>>([]);
  // Profile owner's scenarioes list
  const [scenarioes, setScenarioes] = useState<Array<getFirestoreWriting>>([]);
  // Profile owner's total writings list
  const [totalWritings, setTotalWritings] = useState<
    Array<getFirestoreWriting>
  >([]);
  const [userWritings, setUserWritings] = useState(
    {} as getFirestoreUserWritings
  );
  const [writingsLoading, setWritingsLoading] = useState(false);

  // Get and Set profileOwner's writings information function
  const getWritings = async (uid: string) => {
    try {
      setWritingsLoading(true);
      const userWritings = await getUserWritings(uid as string);
      if (userWritings) {
        setUserWritings(userWritings as getFirestoreUserWritings);

        // 확장성이 좋지 않음
        const poem = userWritings.poemDocID
          ? (
            (await getWritingsArrayInfo(
              userWritings.poemDocID
            )) as Array<getFirestoreWriting>
          ).sort((a, b) => b.dateCreated - a.dateCreated)
          : [];
        const novel = userWritings.novelDocID
          ? (
            (await getWritingsArrayInfo(
              userWritings.novelDocID
            )) as Array<getFirestoreWriting>
          ).sort((a, b) => b.dateCreated - a.dateCreated)
          : [];
        const scenario = userWritings.scenarioDocID
          ? (
            (await getWritingsArrayInfo(
              userWritings.scenarioDocID
            )) as Array<getFirestoreWriting>
          ).sort((a, b) => b.dateCreated - a.dateCreated)
          : [];
        setPoems(poem);
        setNovels(novel);
        setScenarioes(scenario);
        setTotalWritings(
          Array.prototype
            .concat(poem, novel, scenario)
            .sort((a, b) => b.dateCreated - a.dateCreated)
            .filter(writing => uid === contextUid || writing.disclosure === "PUBLIC")
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWritingsLoading(false);
    }
  };
  useEffect(() => {
    uid && getWritings(uid);
  }, [uid]);
  return {
    poems,
    novels,
    scenarioes,
    totalWritings,
    userWritings,
    writingsLoading,
  };
};

export default useGetWritings;
