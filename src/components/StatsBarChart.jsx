import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

function StatsBarChart({ type }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(
          `http://api.dustipharma.tj:1212/api/v1/app/admin/statistics/breakdown/${type}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data.payload);
      } catch (err) {
        console.error('Ошибка загрузки графика:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, [type]);

  if (loading) return <p>Загрузка графика...</p>;
  if (data.length === 0) return <p>Нету данных для графика.</p>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="web" stackId="a" fill="#00bcd4" />
          <Bar dataKey="mobile" stackId="a" fill="#4caf50" />
          <Bar dataKey="crm" stackId="a" fill="#9c27b0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatsBarChart;
