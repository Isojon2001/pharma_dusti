import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Layers, Phone, Users, MoreVertical } from 'lucide-react';
import SidebarItem from '../components/SidebarItem';
import '../index.css';

function Dashboard() {

  const [stats, setStats] = useState({});
  const navigate = useNavigate()
  const [user, setUser] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

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

      console.log(" Найден токен:", token);
      try {
        const res = await axios.get(
          "http://api.dustipharma.tj:1212/api/v1/app/admin/statistics",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setStats(res.data.payload);
      } catch (error) {
        console.error("Ошибка при получении статистики:", error.response?.data || error.message);
      }
    };

    fetchStats();
  }, []);

const statItems = [
  { key: 'order_total', label: 'Всего заказов', value: stats?.order_total },
  { key: 'order_prev_month', label: 'Заказы в прошлом месяце', value: stats?.order_prev_month },
  { key: 'order_current_month', label: 'Заказы в этом месяце', value: stats?.order_current_month },
  { key: 'users_total', label: 'Всего пользователей', value: stats?.users_total },
  { key: 'users_prev_month', label: 'Пользователи в прошлом месяце', value: stats?.users_prev_month },
  { key: 'users_current_month', label: 'Пользователи в этом месяце', value: stats?.users_current_month },
  { key: 'products_total', label: 'Всего продуктов', value: stats?.products_total },
  { key: 'products_prev_month', label: 'Продукты в прошлом месяце', value: stats?.products_prev_month },
  { key: 'products_current_month', label: 'Продукты в этом месяце', value: stats?.products_current_month },
];


  const filteredItems = statItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <SidebarItem 
              icon={() => <img src="./Icons-3.svg" alt="Роли и права" />} label="Роли и права" to="/RoleAndRoot" />
            <SidebarItem icon={Users} label="Partner" to="/Partner" />
            <SidebarItem icon={() => <img src="./Icons-4.svg" alt="MobileApp" />} label="Панель MobileApp" to="/mobile" />
              <SidebarItem
                icon={() => <img src="./call.svg" width={20} height={20} alt="Звонки" />}
                label="Журнал звонков"
                to="/calls"
              />
          </div>
        </div>

        <div className="sidebar_block">
          <p>Служба поддержки</p>
          <div className="sidebar_user">
            <div className="logo_flex">
              <div className="logo_user"></div>
              <div className="logo_profile">
                <h3>{user.full_name || 'Имя не указано'}</h3>
                <p>{user.branch || 'Филиал не указан'}</p>
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
            {filteredItems.map((item, index) => (
              <div
                className="stat_card"
                key={index}onClick={() => navigate(`/statistics/${item.key}`)}
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
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
