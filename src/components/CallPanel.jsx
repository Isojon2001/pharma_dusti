import React, { useEffect, useState } from 'react';

function CallPanel() {
  const [calls, setCalls] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const NGROK_URL = 'https://446bfaaacf3b.ngrok-free.app';

    fetch(NGROK_URL)
      .then((res) => res.text())
      .then((data) => {
        setCalls(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка при получении данных от AMI:', err);
        setCalls('Ошибка подключения к серверу');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>📞 Активные вызовы Asterisk</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <pre
          style={{
            background: '#f4f4f4',
            padding: '1rem',
            borderRadius: '8px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {calls}
        </pre>
      )}
    </div>
  );
}

export default CallPanel;
