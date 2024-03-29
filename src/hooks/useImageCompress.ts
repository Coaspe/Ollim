import { alarmType, getFirestoreUser } from "../type";
import Compressor from "compressorjs";
import { updateProfileImage } from "../services/firebase";

const useImageCompress = (
  profileOwnerInfo: getFirestoreUser,
  setAlarm: (alarm: [string, alarmType, boolean]) => void,
  setProfileImage: React.Dispatch<React.SetStateAction<string>>
) => {
  // Image Compress process
  const handleProfileImgOnChange = (event: any) => {
    const element = event.target.files[0];

    let qual = 0.45;

    if (element.size >= 4000000) {
      qual = 0.1;
    } else if (element.size >= 2000000) {
      qual = 0.2;
    } else if (element.size >= 1000000) {
      qual = 0.4;
    }

    new Compressor(element, {
      quality: qual,
      width: 800,
      height: 800,
      success(result: any) {
        const url = URL.createObjectURL(result);

        const formData = new FormData();
        formData.append("userUID", profileOwnerInfo.uid);
        formData.append("userEmail", profileOwnerInfo.userEmail);
        formData.append("file", result);
        updateProfileImage(profileOwnerInfo.uid, profileOwnerInfo.userEmail, result)
          .then((res: any) => {
            setAlarm(res);
            setProfileImage(url);
            setTimeout(() => {
              setAlarm(["", "success", false]);
            }, 3000);
          });
      },
      error(err) {
        console.log(err.message);
        return;
      },
    });
  };
  return handleProfileImgOnChange
};

export default useImageCompress;
