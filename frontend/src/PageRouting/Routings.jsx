import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import Layout from './Layout'
import AnalyzeResume from '@/pages/AnalyzeResume'

import LoginPage from '@/pages/Login'
import RegisterPage from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import JobRecommendations from '@/pages/JobRecommendations'
import Interview from '@/pages/Interview'
import Top75 from '@/pages/Top75'
import StudentLoginPage from '@/pages/StudentLogin'
import HRLoginPage from '@/pages/HRLogin'
import HRDashboard from '@/pages/HRDashboard'
import HRRegisterPage from '@/pages/HRRegister'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'

function Routings() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/resume" element={<AnalyzeResume />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/student" element={<StudentLoginPage />} />
          <Route path="/login/hr" element={<HRLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/hr" element={<HRRegisterPage />} />
          <Route path="/app" element={<Layout />} >
            <Route index element={<Dashboard />} />
            <Route path="interview" element={<Interview />} />
            <Route path="top75" element={<Top75 />} />
            <Route path="resume" element={<AnalyzeResume />} />
            <Route path="job" element={<JobRecommendations />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/hr" element={<HRDashboard />} />
        </Routes>
      </Router>
    </div>
  )
}

export default Routings