import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // <-- import axios
import * as XLSX from 'xlsx';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { Download } from 'lucide-react';

const chartTypes = ['bar', 'line', 'pie', 'doughnut', 'polarArea', 'radar', 'scatter'];

const chartColors = [
  '#6b21a8', '#facc15', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#eab308', '#8b5cf6',
  '#6366f1', '#ec4899', '#22d3ee', '#f97316'
];

const UploadPage = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const chartRefs = useRef({});
  const token = localStorage.getItem('token');

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || !selectedFile.name.match(/\.(xlsx|xls)$/)) {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      setData(parsedData);
      if (parsedData.length > 0) {
        setHeaders(parsedData[0]);
        setXAxis(parsedData[0][0]); // default X
        setYAxis(parsedData[0][1]); // default Y
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const generateChartData = () => {
    if (!xAxis || !yAxis) return null;
    const xIndex = headers.indexOf(xAxis);
    const yIndex = headers.indexOf(yAxis);

    if (xIndex === -1 || yIndex === -1) return null;

    const labels = data.slice(1).map(row => row[xIndex]);
    const values = data.slice(1).map(row => Number(row[yIndex]) || 0);

    return {
      labels,
      datasets: [
        {
          label: `${yAxis} vs ${xAxis}`,
          data: values,
          backgroundColor: chartColors,
          borderColor: chartColors,
          borderWidth: 1,
        },
      ],
    };
  };

  // Track chart generation once a chart type is rendered
  useEffect(() => {
    if (!token) return; // no token no tracking

    const chartType = 'Bar Chart'; // you can change this or loop for all types if needed
    // You might want to track per chartType or for the currently displayed chart
    // For demo, just track Bar Chart generation
    if (generateChartData()) {
      axios.post('/api/user/track-chart', {
        chartType,
        excelFileName: data.length > 0 ? 'Uploaded Excel' : 'unknown', // you might want better naming here
        imageUrl: `/charts/${chartType.toLowerCase().replace(' ', '')}_chart.png`, // dummy url, you can update dynamically if needed
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }
  }, [xAxis, yAxis, data, token]);

  const downloadChart = (type) => {
    const chart = chartRefs.current[type];
    if (!chart) return;
    const link = document.createElement('a');
    link.download = `${type}_chart.png`;
    link.href = chart.toBase64Image();
    link.click();

    // Track the download
    if (token) {
      axios.post('/api/user/track-download', {
        fileName: 'Uploaded Excel',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">📥 Upload Excel & 📊 Visualize</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        className="mb-4 border border-gray-300 p-2 rounded"
      />

      {headers.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">X-Axis</label>
            <select
              className="px-4 py-2 border rounded bg-white"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
            >
              {headers.map((header, idx) => (
                <option key={idx} value={header}>{header}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Y-Axis</label>
            <select
              className="px-4 py-2 border rounded bg-white"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
            >
              {headers.map((header, idx) => (
                <option key={idx} value={header}>{header}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {generateChartData() && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {chartTypes.map((type) => (
            <div key={type} className="p-4 border rounded-xl shadow-lg bg-white">
             <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold capitalize text-gray-700">{type} Chart</h3>
              <Download
                size={20}
                className="cursor-pointer text-purple-700 hover:text-purple-900"
                onClick={() => downloadChart(type)}
                title="Download chart"
              />
            </div>
              <Chart
                ref={(el) => (chartRefs.current[type] = el)}
                type={type}
                data={generateChartData()}
              />
            </div>
          ))}
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-12 overflow-x-auto">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">🧾 Data Preview:</h3>
          <table className="min-w-full border border-gray-300 text-sm shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {data[0].map((cell, idx) => (
                  <th key={idx} className="border px-4 py-2 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {row.map((cell, idx) => (
                    <td key={idx} className="border px-4 py-2 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
