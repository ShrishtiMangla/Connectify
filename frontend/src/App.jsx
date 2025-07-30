import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import OnboardingPage from './pages/OnboardingPage';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4" data-theme="night">       

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/call" element={<CallPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>

        <Toaster />

      </div>
    </>
  );
}

export default App;
