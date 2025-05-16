import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

const UploadPage = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setData(data);
    };
    reader.readAsBinaryString(file);
  };

  const generateChart = () => {
    if (data.length < 2) return;
    const labels = data.slice(1).map(row => row[0]);
    const values = data.slice(1).map(row => row[1]);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Data Chart',
          data: values,
          backgroundColor: 'rgba(107, 33, 168, 0.6)',
        },
      ],
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
      <button onClick={generateChart} className="ml-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800">Generate Chart</button>

      {chartData && (
        <div className="mt-6">
          <Chart type='bar' data={chartData} />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
