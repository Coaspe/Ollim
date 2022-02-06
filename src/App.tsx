import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useAuthListner from './hooks/useAuth';
import { lazy, Suspense } from 'react';
import UserContext from "./context/user";
import IsUserLoggedIn from "./helpers/Is-user-logged-in";
import ProtectedRoute from "./helpers/Protected-route";
import Mypage from "./page/Mypage";
import Community from "./page/Community";

const Intro = lazy(() => import("./page/Intro"))

const App = () => {
  const { user } = useAuthListner()
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
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <Mypage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/community"
              element={
                  <Community />
              }
            />

            <Route
              path="/intro"
              element={
                <IsUserLoggedIn user={user}>
                  <Intro />
                </IsUserLoggedIn>
              }
              />
            {/* <Route
              path="/signup"
              element={
                <IsUserLoggedIn user={user}>
                  <Signup />
                </IsUserLoggedIn>
              }
            /> */}
          </Routes>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
