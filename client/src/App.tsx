import authApi from 'axiosConfig/api/auth';
import { getTokenFromLocalStorage, getUserFromLs } from 'helpers/localStorage';
// import { useInitSocket } from 'hook/useInitSocket';
import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MPath from 'routes/routes';
import authStore from 'zustandStore/auth';
import './App.css';
import DefaultLayout from './pages/Layout/DefaultLayout';
import { routers } from './routes/index';

function App() {
  const { currentUser, saveCurrentUser } = authStore();
  const userLs = getUserFromLs();
  const token = getTokenFromLocalStorage();
  const auth = Object.entries(currentUser).length > 0 || Object.entries(userLs).length > 0;

  const getCurrentUser = async () => {
    const res = await authApi.getCurrentUser();
    const { me, listCourse } = res.data;
    saveCurrentUser({ ...me, listCourse });
  };
  useEffect(() => {
    if (userLs.id || token) {
      getCurrentUser();
    }
  }, [currentUser.id]);

  // useInitSocket();

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer closeOnClick pauseOnHover={false} autoClose={3000} />
        <Routes>
          {routers.map((route: any, i: number) => {
            return route.public ? (
              <Route key={route.name} path={route.path} element={route.element} />
            ) : (
              <Route
                key={route.name}
                path={route.path}
                element={
                  // auth && route.role?.includes(userLs.role) ?
                  true ? (
                    <DefaultLayout>{route.element}</DefaultLayout>
                  ) : (
                    <Navigate to={MPath.LOGIN} replace />
                  )
                }
              />
            );
          })}
          <Route
            path="*"
            element={
              <>
                <Navigate to={'/notfound'} replace />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
