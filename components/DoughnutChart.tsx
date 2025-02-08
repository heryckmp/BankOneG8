"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  accounts: any[];
}

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const totalBalance = accounts.reduce((acc, account) => acc + account.currentBalance, 0);
  
  const data = {
    labels: accounts.map(account => account.name),
    datasets: [
      {
        data: accounts.map(account => ((account.currentBalance / totalBalance) * 100).toFixed(1)),
        backgroundColor: [
          'rgba(37, 99, 235, 1)',   // blue-600
          'rgba(59, 130, 246, 1)',  // blue-500
          'rgba(96, 165, 250, 1)',  // blue-400
          'rgba(147, 197, 253, 1)', // blue-300
        ],
        borderColor: [
          'rgba(255, 255, 255, 0.5)',
        ],
        borderWidth: 2,
        cutout: '75%',
        borderRadius: 20,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${value}% of total balance`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="relative w-full h-full">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart