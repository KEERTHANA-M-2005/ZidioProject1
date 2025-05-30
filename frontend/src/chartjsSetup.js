// src/chartjsSetup.js
import { Chart, CategoryScale, LinearScale, RadialLinearScale, ArcElement, BarElement, LineElement, PointElement, BarController, LineController, PieController, DoughnutController, RadarController, Tooltip, Legend } from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  PieController,
  DoughnutController,
  RadarController,
  Tooltip,
  Legend
);
