import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, MoreVertical } from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import '../index.css';

function Dashboard() {
  const [stats, setStats] = useState({});
  const [amiStats, setAmiStats] = useState({}); // 🔍 добавлено
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [amiEvents, setAmiEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const socket = new WebSocket('ws://10.10.10.21:8081');

    socket.onopen = () => {
      const now = new Date();
      socket.send(JSON.stringify({
        action: 'getStats',
        month: now.getMonth() - 1, // 🔍 прошлый месяц
        year: now.getFullYear()
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // 🔍 Получение данных из AMI
      if (data.action === 'stats') {
        setAmiStats(data.data);
      }

      if (data.type === 'ami-event') {
        const enriched = {
          Event: data.data?.Event || 'Unknown',
          Channel: data.data?.Channel || '',
          CallerIDNum: data.data?.CallerIDNum || '',
          Timestamp: data.data?.timestamp || new Date().toISOString(),
        };

        setAmiEvents(prev => [enriched, ...prev].slice(0, 100));
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("Токен не найден в localStorage");
        return;
      }

      try {
        const res = await axios.get("http://api.dustipharma.tj:1212/api/v1/app/admin/statistics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.payload);
      } catch (error) {
        console.error("Ошибка при получении статистики:", error.response?.data || error.message);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    { key: 'calls_total', label: 'Всего звонков', value: stats?.calls_total },
    { key: 'calls_prev_month', label: 'Звонки в прошлом месяце', value: stats?.calls_prev_month },
    { key: 'calls_current_month', label: 'Звонки в этом месяце', value: stats?.calls_current_month },
    { key: 'calls_successful', label: 'Успешные звонки', value: stats?.calls_successful },
    { key: 'calls_failed', label: 'Ошибочные звонки', value: stats?.calls_failed },
    { key: 'order_total', label: 'Всего заказов', value: stats?.order_total },
    { key: 'order_prev_month', label: 'Заказы в прошлом месяце', value: stats?.order_prev_month },
    { key: 'order_current_month', label: 'Заказы в этом месяце', value: stats?.order_current_month },
    { key: 'users_total', label: 'Всего пользователей', value: stats?.users_total },
    { key: 'users_prev_month', label: 'Пользователи в прошлом месяце', value: stats?.users_prev_month },
    { key: 'users_current_month', label: 'Пользователи в этом месяце', value: stats?.users_current_month },
    { key: 'products_total', label: 'Всего продуктов', value: stats?.products_total },
    { key: 'products_prev_month', label: 'Продукты в прошлом месяце', value: stats?.products_prev_month },
    { key: 'products_current_month', label: 'Продукты в этом месяце', value: stats?.products_current_month },

    // 🔍 Добавим сюда карточки статистики звонков из AMI
    { key: 'ami_calls_total', label: 'AMI: Всего звонков (прошлый мес)', value: amiStats.totalCalls },
    { key: 'ami_answered', label: 'AMI: Успешные звонки', value: amiStats.answered },
    { key: 'ami_missed', label: 'AMI: Пропущенные звонки', value: amiStats.missed },
    { key: 'ami_duration', label: 'AMI: Общая длительность (сек)', value: amiStats.totalDuration }
  ];

  const filteredItems = statItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <div className="sidebar_logo">
            <img src="./Dusti_pharma.png" width="40" height="40" alt="logo" />
            <h2>Дусти фарма</h2>
          </div>
          <div className="sidebar-menu">
            <SidebarItem icon={LayoutGrid} label="Статистика" to="/dashboard" />
            <SidebarItem icon={() => <img src="./Icons-3.svg" alt="Роли и права" />} label="Роли и права" to="/RoleAndRoot" />
            <SidebarItem icon={Users} label="Partner" to="/Partner" />
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
                <h3>{user.full_name || 'Имя не указано'}</h3>
                <p>{'ВидКонтрагента' || 'Филиал не указан'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="statistics">
        <div className="statistics_paragraph">
          <h1>Статистика</h1>
          <input
            placeholder="Найти"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="statistics_info">
          <div className="stat_cards">
            {paginatedItems.map((item, index) => (
              <div
                className="stat_card"
                key={index}
                onClick={() => navigate(`/statistics/${item.key}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="stat_Header">
                  {item.label}
                  <MoreVertical />
                </div>
                <p>{item.value ?? '—'}</p>
              </div>
            ))}
          </div>
          <div className="pagination_controls">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              ◀ Назад
            </button>
            <span>Страница {currentPage} из {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Вперёд ▶
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
