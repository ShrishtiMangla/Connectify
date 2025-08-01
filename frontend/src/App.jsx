import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import OnboardingPage from './pages/OnboardingPage';

//used daisy UI for themes and react-hot-toast for notifications

import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios';

function App() {

//axios
//react query tanstack query

const { data:authData , isLoading , error } = useQuery({
  queryKey: ['authUser'],
  queryFn: async () => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },
  retry: false, // Disable retry on failure
});

const authUser = authData?.user;



  return (
    <>
      
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4" data-theme="bumblebee">       

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ?<SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ?<LoginPage />: <Navigate to="/" />} />
          <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
          <Route path="/call" element={authUser ?<CallPage />: <Navigate to="/login" />} />
          <Route path="/chat" element={authUser ?<ChatPage />: <Navigate to="/login" />} />
          <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login" />} />
        </Routes>

        <Toaster />

      </div>
    </>
  );
}

export default App;
