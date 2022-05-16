import { useEffect, useState } from "react";

function getVerificationData() {
  const data = localStorage.getItem("verificatedEmail");
  if (data) {
    return data;
  }
  return "";
}

export default function useProfileData() {
  const [verificated, setVerificated] = useState(getVerificationData());

  useEffect(() => {
    function handleChangeStorage() {
      setVerificated(getVerificationData());
    }

    window.addEventListener("storage", handleChangeStorage);
    return () => window.removeEventListener("storage", handleChangeStorage);
  }, []);

  return verificated;
}
