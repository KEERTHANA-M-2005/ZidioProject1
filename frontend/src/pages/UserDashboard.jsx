import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MultiChart from "../components/Chart";
import ThreeDScatterPlot from "../components/ThreeDScatterPlot";
import UploadHistory from "../components/UploadHistory";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [downloads, setDownloads] = useState([]);
  const [userId, setUserId] = useState(null);

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

      // Fetch downloads history
      const downloadsRes = await axios.get(`http://localhost:5000/api/downloads/history/${profileRes.data._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDownloads(downloadsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Welcome, {email}</h2>

      <UploadHistory refreshHistory={fetchHistory} />

      <div className="mt-4">
        <h3 className="font-semibold">Downloaded Charts</h3>
        <ul>
          {downloads.length > 0 ? (
            downloads.map((d, i) => (
              <li key={i}>
                {d.chartType} from {d.filename} on {new Date(d.timestamp).toLocaleString()}
              </li>
            ))
          ) : (
            <li>No downloads yet</li>
          )}
        </ul>
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
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
