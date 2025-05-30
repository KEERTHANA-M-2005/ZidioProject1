import React, { useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import { Download } from 'lucide-react';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend
);

const chartTypes = ['bar', 'line', 'pie', 'doughnut', 'polarArea', 'radar', 'scatter'];
const chartColors = [
  '#6b21a8', '#facc15', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#eab308', '#8b5cf6',
  '#6366f1', '#ec4899', '#22d3ee', '#f97316'
];

const MultiChart = ({ data, headers, xAxis, yAxis }) => {
  const chartRefs = useRef({});

  if (!xAxis || !yAxis || !headers.length || !data.length) return null;

  const xIndex = headers.indexOf(xAxis);
  const yIndex = headers.indexOf(yAxis);
  if (xIndex === -1 || yIndex === -1) return null;

  const labels = data.slice(1).map(row => row[xIndex]);
  const values = data.slice(1).map(row => Number(row[yIndex]) || 0);

  const chartData = {
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

  const downloadChart = (type) => {
    const chartInstance = chartRefs.current[type];
    if (chartInstance) {
      const link = document.createElement('a');
      link.download = `${type}_chart.png`;
      link.href = chartInstance.toBase64Image();
      link.click();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {chartTypes.map(type => (
        <div key={type} className="p-4 border rounded-xl shadow-lg bg-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold capitalize text-gray-700">{type} Chart</h3>
            <Download
              size={20}
              className="cursor-pointer text-purple-700 hover:text-purple-900"
              onClick={() => downloadChart(type)}
              title={`Download ${type} chart`}
            />
          </div>
          <Chart
            ref={ref => {
              if (ref && ref.canvas) {
                chartRefs.current[type] = ref;
              }
            }}
            type={type}
            data={chartData}
          />
        </div>
      ))}
    </div>
  );
};

export default MultiChart;
