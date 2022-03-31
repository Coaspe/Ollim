import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuthListner from "./hooks/useAuth";
import { lazy, Suspense } from "react";
import UserContext from "./context/user";
import IsUserLoggedIn from "./helpers/Is-user-logged-in";
import Community from "./page/Community";
import Writing from "./page/Writing";

const Intro = lazy(() => import("./page/Intro"));
const Mypage = lazy(() => import("./page/Mypage"));

const App = () => {
  const { user } = useAuthListner();
  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Suspense
          fallback={
            // Loading logo
            <div className="w-screen h-screen flex items-center justify-center">
              <img
                className="w-32 opacity-50"
                src="/logo/Ollim-logos_black.png"
                alt="loading"
              />
            </div>
          }
        >
          <Routes>
            <Route path="/:uid" element={<Mypage />} />
            <Route path="/community" element={<Community />} />
            <Route
              path="/"
              element={
                <IsUserLoggedIn user={user}>
                  <Intro />
                </IsUserLoggedIn>
              }
            />
            <Route
              path="/writings/:uid/:writingDocID/:commentDocID"
              element={<Writing />}
            />
            <Route path="/writings/:uid/:writingDocID" element={<Writing />} />
          </Routes>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
