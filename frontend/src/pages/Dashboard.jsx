import React, { useEffect, useState } from "react";
import axios from "axios";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import { useNavigate } from "react-router-dom";

const DashboardRouter = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/auth");

        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(res.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
    // Track dashboard visit for analytics
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        await fetch("http://localhost:5000/api/activity/track-visit", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ actionType: 'dashboard_visit' }),
        });
      } catch (err) {
        console.warn('Could not track dashboard visit', err);
      }
    })();
  }, [navigate]);

  if (loading) return <p>Loading dashboard...</p>;

  return role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardRouter;
