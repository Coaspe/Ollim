import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getFollowersInfinite } from "../../services/firebase";
import { getFirestoreUser } from "../../type";
import FollowerRow from "../mypage/FollowerRow";
import FollowersFollowingsSkeleton from "../skeleton/FollowersFollowingsSkeleton";
interface props {
    userUIDs: Set<string>;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const TestAccountModal: React.FC<props> = ({ userUIDs, setModalOpen }) => {
    const [loading, setLoading] = useState(false);
    const [followers, setFollowers] = useState<getFirestoreUser[]>([]);
    useEffect(() => {
        const handleFollowers = async () => {
            if (userUIDs?.size) {
                try {
                    setLoading(true);
                    const res = await getFollowersInfinite(Array.from(userUIDs), 0);
                    let tmp = res.docs.map((doc: any) => ({
                        ...doc.data(),
                        docID: doc.id,
                    }));
                    setFollowers((origin: any) => {
                        return [...origin, ...tmp];
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false)
                }
            }
        }
        handleFollowers()
    }, [userUIDs])

    return <motion.div
        animate={{
            backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
        }}
        transition={{ duration: 0.2 }}
        style={{ zIndex: 10000 }}
        className="font-noto fixed w-full h-full items-center justify-center top-0 left-0 flex"
        onClick={() => {
            setModalOpen(false);
        }}
    >
        <motion.div
            initial={{
                scale: "80%",
                opacity: "0%",
            }}
            animate={{
                scale: "100%",
                opacity: "100%",
            }}
            transition={{
                duration: 0.2,
                type: "spring",
            }}
            className="flex flex-col items-center w-testModal bg-white py-5 rounded-lg GalaxyS20Ultra:w-4/5"
        >
            <span className="text-xl font-bold text-gray-500 mb-5">테스트 계정 방문을 감사드립니다!</span>
            <span className="text-sm font-bold text-gray-500 mb-5">아래 유저들을 추천드립니다.</span>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className="flex flex-col items-center w-full h-full px-10 gap-5 overflow-y-scrolll"
            >
                {!loading ? (followers.map((data) => (
                    <FollowerRow
                        key={data.userEmail}
                        data={data}
                        setFollowersModal={setModalOpen}
                    />
                ))) : <FollowersFollowingsSkeleton
                    lengthProp={2}
                />}
            </div>
        </motion.div>
    </motion.div>
}

export default TestAccountModal;