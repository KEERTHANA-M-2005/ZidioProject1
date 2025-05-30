// src/pages/UploadPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import MultiChart from '../components/Chart';
import ThreeDScatterPlot from '../components/ThreeDScatterPlot';
import { Download } from 'lucide-react';

const UploadPage = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [zAxis, setZAxis] = useState('');
  const token = localStorage.getItem('token');
  const threeDRef = useRef();

  useEffect(() => {
    // Load saved state from localStorage
    const savedData = localStorage.getItem('excelData');
    const savedHeaders = localStorage.getItem('excelHeaders');
    const savedXAxis = localStorage.getItem('excelXAxis');
    const savedYAxis = localStorage.getItem('excelYAxis');
    const savedZAxis = localStorage.getItem('excelZAxis');

    if (savedData && savedHeaders) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
      setHeaders(JSON.parse(savedHeaders));
      if (savedXAxis) setXAxis(savedXAxis);
      if (savedYAxis) setYAxis(savedYAxis);
      if (savedZAxis) setZAxis(savedZAxis);
    }
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.match(/\.(xlsx|xls)$/)) {
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
      setHeaders(parsedData[0]);
      setXAxis(parsedData[0][0]);
      setYAxis(parsedData[0][1]);
      setZAxis(parsedData[0][2]);

      // Save to localStorage
      localStorage.setItem('excelData', JSON.stringify(parsedData));
      localStorage.setItem('excelHeaders', JSON.stringify(parsedData[0]));
      localStorage.setItem('excelXAxis', parsedData[0][0]);
      localStorage.setItem('excelYAxis', parsedData[0][1]);
      localStorage.setItem('excelZAxis', parsedData[0][2]);
    };
    reader.readAsBinaryString(file);
  };

  // Track chart view on backend
  const generateChartData = useCallback(() => {
    if (!xAxis || !yAxis) return null;
    const xIndex = headers.indexOf(xAxis);
    const yIndex = headers.indexOf(yAxis);
    if (xIndex === -1 || yIndex === -1) return null;

    const labels = data.slice(1).map(row => row[xIndex]);
    const values = data.slice(1).map(row => Number(row[yIndex]) || 0);

    return { labels, values };
  }, [xAxis, yAxis, headers, data]);

  useEffect(() => {
    if (!token) return;
    const chartData = generateChartData();
    if (chartData) {
      axios.post('/api/user/track-chart', {
        chartType: 'Bar Chart',
        excelFileName: data.length > 0 ? 'Uploaded Excel' : 'unknown',
        imageUrl: `/charts/bar_chart.png`,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }
  }, [xAxis, yAxis, data, token, generateChartData]);

  // 3D Scatter Plot download handler
  const download3DPlot = () => {
    if (!threeDRef.current) return;
    const canvas = threeDRef.current.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = '3d_scatter_plot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

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
          {['X-Axis', 'Y-Axis', 'Z-Axis'].map((label, idx) => {
            const axis = label[0].toLowerCase() + 'Axis'; // xAxis, yAxis, zAxis
            const val = { xAxis, yAxis, zAxis }[axis];
            const setVal = { xAxis: setXAxis, yAxis: setYAxis, zAxis: setZAxis }[axis];
            return (
              <div key={axis}>
                <label className="block font-semibold mb-1 text-gray-700">{label}</label>
                <select
                  className="px-4 py-2 border rounded bg-white"
                  value={val}
                  onChange={(e) => {
                    setVal(e.target.value);
                    localStorage.setItem(`excel${label.replace('-', '')}`, e.target.value);
                  }}
                >
                  {headers.map((header, i) => (
                    <option key={i} value={header}>{header}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {/* 2D Charts */}
      {data.length > 1 && xAxis && yAxis && (
        <MultiChart data={data} headers={headers} xAxis={xAxis} yAxis={yAxis} />
      )}

      {/* 3D Scatter Plot + Download Button */}
      {data.length > 1 && xAxis && yAxis && zAxis && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">🧊 3D Scatter Plot</h3>
            <Download
              size={24}
              className="cursor-pointer text-purple-700 hover:text-purple-900"
              onClick={download3DPlot}
              title="Download 3D Scatter Plot"
            />
          </div>
          <div ref={threeDRef} className="w-full h-[500px] border rounded shadow-lg">
            <ThreeDScatterPlot
              data={data}
              headers={headers}
              xAxis={xAxis}
              yAxis={yAxis}
              zAxis={zAxis}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
