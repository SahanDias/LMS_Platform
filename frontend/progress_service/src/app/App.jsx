import {  Routes, Route } from "react-router-dom";
import AdminDashboard from '../page/admin/AdminDashboard';
import UserDashboard from '../page/user/UserDashboard';
import './../app/App.css';
import Home from "../page/home/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;