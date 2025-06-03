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
    const savedData = JSON.parse(localStorage.getItem('excelData') || '[]');
    const savedHeaders = JSON.parse(localStorage.getItem('excelHeaders') || '[]');
    const savedXAxis = localStorage.getItem('excelXAxis') || '';
    const savedYAxis = localStorage.getItem('excelYAxis') || '';
    const savedZAxis = localStorage.getItem('excelZAxis') || '';

    setData(savedData);
    setHeaders(savedHeaders);
    setXAxis(savedXAxis);
    setYAxis(savedYAxis);
    setZAxis(savedZAxis);
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.match(/\.(xlsx|xls)$/)) {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload the file
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (uploadRes.status === 201) {
        // Parse the file for preview
        const reader = new FileReader();
        reader.onload = (evt) => {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });

          if (!parsedData.length) return;

          const [firstRow] = parsedData;
          setData(parsedData);
          setHeaders(firstRow);
          setXAxis(firstRow[0]);
          setYAxis(firstRow[1]);
          setZAxis(firstRow[2]);

          localStorage.setItem('excelData', JSON.stringify(parsedData));
          localStorage.setItem('excelHeaders', JSON.stringify(firstRow));
          localStorage.setItem('excelXAxis', firstRow[0]);
          localStorage.setItem('excelYAxis', firstRow[1]);
          localStorage.setItem('excelZAxis', firstRow[2]);

          // Notify dashboard to refresh history
          localStorage.setItem('refreshHistory', Date.now().toString());
          window.dispatchEvent(new Event('storage'));
        };
        reader.readAsBinaryString(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const generateChartData = useCallback(() => {
    const xIndex = headers.indexOf(xAxis);
    const yIndex = headers.indexOf(yAxis);
    if (xIndex === -1 || yIndex === -1) return null;

    const labels = data.slice(1).map(row => row[xIndex]);
    const values = data.slice(1).map(row => Number(row[yIndex]) || 0);
    return { labels, values };
  }, [xAxis, yAxis, headers, data]);

  useEffect(() => {
    const chartData = generateChartData();
    if (token && chartData) {
      axios.post('http://localhost:5000/api/activity/track-chart', {
        chartType: 'Bar Chart',
        excelFileName: data.length > 0 ? 'Uploaded Excel' : 'unknown',
        imageUrl: '/charts/bar_chart.png',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }
  }, [xAxis, yAxis, data, token, generateChartData]);

  const handleDownload = async () => {
    if (threeDRef.current?.downloadImage) {
      try {
        // Get the chart image data
        console.log('Attempting to download image...');
        const imageData = await threeDRef.current.downloadImage();
        console.log('Image data generated:', imageData);
        
        // Track the download
        const downloadPayload = {
          excelFileName: data.length > 0 ? 'Uploaded Excel' : 'unknown',
          chartType: '3D Scatter Plot',
          imageUrl: imageData || '/charts/3d_scatter.png',
        };
        console.log('Sending download tracking payload:', downloadPayload);
        
        await axios.post('http://localhost:5000/api/activity/track-download', downloadPayload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Download tracking request sent successfully.');

        // Notify dashboard to refresh history
        localStorage.setItem('refreshHistory', Date.now().toString());
        window.dispatchEvent(new Event('storage'));
        console.log('Storage event dispatched to refresh history.');

      } catch (error) {
        console.error('Download tracking error:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📥 Upload Excel & 📊 Visualize</h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        className="mb-6 border border-gray-300 p-2 rounded w-full sm:w-auto"
      />

      {headers.length > 1 && (
        <div className="flex flex-wrap gap-6 mb-6">
          {['X-Axis', 'Y-Axis', 'Z-Axis'].map((label, idx) => {
            const axisKey = label[0].toLowerCase() + 'Axis';
            const value = { xAxis, yAxis, zAxis }[axisKey];
            const setter = { xAxis: setXAxis, yAxis: setYAxis, zAxis: setZAxis }[axisKey];
            return (
              <div key={label}>
                <label className="block text-gray-700 font-semibold mb-1">{label}</label>
                <select
                  className="px-4 py-2 border rounded bg-white shadow-sm"
                  value={value}
                  onChange={(e) => {
                    setter(e.target.value);
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

      {data.length > 1 && xAxis && yAxis && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 2D Chart</h3>
          <MultiChart data={data} headers={headers} xAxis={xAxis} yAxis={yAxis} />
        </div>
      )}

      {data.length > 1 && xAxis && yAxis && zAxis && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">🧊 3D Scatter Plot</h3>
            <button
              onClick={handleDownload}
              className="cursor-pointer text-purple-700 hover:text-purple-900"
            >
              <Download size={20} />
            </button>
          </div>
          <ThreeDScatterPlot
            ref={threeDRef}
            data={data}
            xAxis={xAxis}
            yAxis={yAxis}
            zAxis={zAxis}
          />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
