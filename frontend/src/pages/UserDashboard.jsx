import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MultiChart from "../components/Chart";
import ThreeDScatterPlot from "../components/ThreeDScatterPlot";
import UploadHistory from "../components/UploadHistory";
import DownloadHistory from "../components/DownloadHistory";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("upload"); // 'upload' or 'download'
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger history refresh

  const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch user profile to get email and userId
      const profileRes = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmail(profileRes.data.email);
      setUserId(profileRes.data._id);

      // Fetch upload history
      const uploadsRes = await axios.get("http://localhost:5000/api/upload/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const firstUpload = uploadsRes.data[0];
      if (firstUpload && firstUpload.data && firstUpload.data.length > 0) {
        setSelectedFile(firstUpload.data);
        const fileHeaders = Object.keys(firstUpload.data[0]);
        setHeaders(fileHeaders);
        setXAxis(fileHeaders[0]);
        setYAxis(fileHeaders[1]);
        setZAxis(fileHeaders[2] || fileHeaders[0]);
      } else {
        setSelectedFile([]);
        setHeaders([]);
        setXAxis("");
        setYAxis("");
        setZAxis("");
      }

      // Download history is fetched by the DownloadHistory component

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Initial fetch and listen for refresh events
  useEffect(() => {
    fetchHistory();

    const handleStorageChange = (e) => {
      if (e.key === "refreshHistory") {
        setRefreshTrigger(prev => prev + 1); // Increment to trigger history fetch in child components
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchHistory]);

  // Fetch history when activeTab changes (to ensure data is loaded when switching tabs)
  useEffect(() => {
    // We don't need to re-fetch upload history here as it's already done on initial load and storage event
    if (activeTab === 'download') {
       // The DownloadHistory component will fetch its data when refreshTrigger changes
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Welcome, {email}</h2>

      {/* History Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("upload")}
              className={`${
                activeTab === "upload"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upload History
            </button>
            <button
              onClick={() => setActiveTab("download")}
              className={`${
                activeTab === "download"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Download History
            </button>
          </nav>
        </div>

        <div className="mt-4">
          {activeTab === "upload" ? (
            <UploadHistory refreshHistory={refreshTrigger} />
          ) : (
            <DownloadHistory refreshHistory={refreshTrigger} />
          )}
        </div>
      </div>

      {selectedFile.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Charts</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[xAxis, yAxis, zAxis].map((val, idx) => (
              <select
                key={idx}
                value={val}
                onChange={(e) =>
                  idx === 0
                    ? setXAxis(e.target.value)
                    : idx === 1
                    ? setYAxis(e.target.value)
                    : setZAxis(e.target.value)
                }
                className="p-2 border rounded"
              >
                {headers.map((h, i) => (
                  <option key={i} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <MultiChart data={selectedFile} headers={headers} xAxis={xAxis} yAxis={yAxis} />
          <ThreeDScatterPlot data={selectedFile} xAxis={xAxis} yAxis={yAxis} zAxis={zAxis} />
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate("/upload")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Upload
        </button>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
