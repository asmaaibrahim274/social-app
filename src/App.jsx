import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layouts/Layout'
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import Notfound from './components/Notfound/Notfound';
import { UserDataProvider } from './components/context/UserData';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProtectedAuth from './components/ProtectedAuth/ProtectedAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PostDetails from './components/PostDetails/PostDetails';
import AllComments from './components/AllComments/AllComments';
import { TimeContextProvider } from './components/context/TimeContext';
import { ToastContainer } from 'react-toastify';
import { OperationsContextProvider } from './components/context/OperationsContext';

function App() {

  let queryClient = new QueryClient();

  let routing = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: 'home/postDetails/:id', element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
        { path: 'profile/postDetails/:id', element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
        { path: 'home/allcomments/:id', element: <ProtectedRoute><AllComments /></ProtectedRoute> },
        { path: 'login', element: <ProtectedAuth><Login /></ProtectedAuth> },
        { path: 'register', element: <ProtectedAuth><Register /></ProtectedAuth> },
        { path: '/', element: <ProtectedAuth><Register /></ProtectedAuth> },
        { path: '*', element: <Notfound /> },
      ]
    },
  ])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <TimeContextProvider>
          <ToastContainer />
          <UserDataProvider>
            <RouterProvider router={routing} ></RouterProvider>
          </UserDataProvider>
        </TimeContextProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
