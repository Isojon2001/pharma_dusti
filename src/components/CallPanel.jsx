import React, { useEffect, useState } from 'react';
import { LayoutGrid, Users, RefreshCw, TrendingUp } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function CallLogViewer() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6

  const normalize = (val) => (!val || val === 'unknown') ? 'Неизвестный' : val;

  const translateStatus = (val) => {
    const translations = {
      'answered': 'Отвечен',
      'no answer': 'Нет ответа',
      'busy': 'Занято',
      'failed': 'Ошибка',
      'ringing': 'Звонит',
      'ring': 'Звонит',
      'up': 'Активен',
      'dialing': 'Набирает',
      'hangup': 'Сброшен',
      'unknown': 'Неизвестный',
      'waiting': 'Ожидание',
    };
    return translations[val?.toLowerCase()] || normalize(val);
  };

  const getCallType = (event) => {
    const caller = (event.CallerIDNum || '').toString();
    const connected = (event.ConnectedLineNum || '').toString();
    const state = (event.Disposition || event.ChannelStateDesc || '').toLowerCase();
    const channel = event.Channel || '';

    if (['no answer', 'busy', 'failed'].includes(state)) return 'Пропущенный';
    if (/SIP\/\d+/.test(channel) && connected.length === 3) return 'Входящий';
    if (caller.length === 3 && connected.length > 3) return 'Исходящий';
    return '—';
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    const socket = new WebSocket('ws://10.10.10.21:8081');

    socket.onopen = () => console.log('🔗 Подключено к WebSocket');

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      const incomingEvents = Array.isArray(payload.data) ? payload.data : [payload];

      const enrichedEvents = incomingEvents.map(e => ({
        ...e,
        timestamp: e.timestamp || new Date().toISOString(),
      }));

      setEvents(prevEvents => {
        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000;

        const merged = [...enrichedEvents, ...prevEvents].filter(ev => {
          const time = new Date(ev.timestamp).getTime();
          return time >= oneHourAgo;
        });

        return merged
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 100);
      });
    };

    socket.onerror = (err) => console.error('WebSocket ошибка:', err);
    socket.onclose = () => console.warn('WebSocket отключен');

    return () => socket.close();
  }, []);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const paginatedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <div className="sidebar_logo">
            <img src="./Dusti_pharma.png" width="40" height="40" alt="Логотип" />
            <h2>Дусти фарма</h2>
          </div>
          <div className="sidebar-menu">
            <SidebarItem icon={LayoutGrid} label="Статистика" to="/dashboard" />
            <SidebarItem icon={() => <img src="./Icons-3.svg" alt="Роли и права" />} label="Роли и права" to="/RoleAndRoot" />
            <SidebarItem icon={Users} label="Партнёр" to="/Partner" />
            <SidebarItem icon={() => <img src="./Icons-4.svg" alt="MobileApp" />} label="Панель MobileApp" to="/mobile" />
            <SidebarItem icon={() => <img src="./call.svg" width={20} height={20} alt="Звонки" />} label="Журнал звонков" to="/calls" />
          </div>
        </div>
        <div className="sidebar_block">
          <p>Служба поддержки</p>
          <div className="sidebar_user">
            <div className="logo_flex">
              <div className="logo_user"></div>
              <div className="logo_profile">
                <h3>{normalize(user.full_name)}</h3>
                <p>{normalize(user.branch)}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="content">
        <div className="panel_content">
          <h2>Журнал звонков</h2>
          <div className='calls_position'>
            <div className='buttons_calls'>
              <button onClick={() => navigate('/Dashboard')}>Посмотреть статистику</button>
              <TrendingUp/>
            </div>
            <table className="bd_calls">
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Статус</th>
                  <th>Время</th>
                  <th>Тип звонка</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEvents.map((e, idx) => (
                  <tr key={idx}>
                    <td>{normalize(e.CallerIDNum)}</td>
                    <td>{translateStatus(e.Disposition || e.ChannelStateDesc || 'waiting')}</td>
                    <td>{new Date(e.timestamp).toLocaleString()}</td>
                    <td>{getCallType(e) || 'неизвестный'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination_controls">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                ◀ Пред
              </button>

              <span>Страница {currentPage} из {totalPages}</span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                След ▶
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CallLogViewer;
