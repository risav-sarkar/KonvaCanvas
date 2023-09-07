import "./styles/globalStyles.css";
import "react-toastify/dist/ReactToastify.css";

import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "./context/AuthContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import Canvas from "./pages/Canvas/canvas";
import Home from "./pages/Home/home";
import Auth from "./pages/Auth/auth";
import { initialFetch } from "./apicalls";
import Page404 from "./pages/Page404/Page404";
import AllCanvases from "./pages/AllCanvases/allCanvases";

const App = () => {
  const { token, isFetching, profile, dispatch } = useContext(AuthContext);
  console.log(token);
  useEffect(() => {
    initialFetch(dispatch);
  }, []);

  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: { staleTime: "Infinity" },
      },
    })
  );

  return (
    <div>
      <QueryClientProvider client={queryClient.current}>
        <Routes>
          {/* Protected Routes */}
          {token ? (
            <Route>
              <Route path="/allcanvases" element={<AllCanvases />} />
            </Route>
          ) : (
            <Route>
              {/* Token  does not exist */}
              <Route path="/signin" element={<Auth type={"Signin"} />} />
              <Route path="/register" element={<Auth type={"Register"} />} />
            </Route>
          )}

          {/* Unprotected Routes */}
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/canvas" element={<Canvas />} />
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </QueryClientProvider>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
