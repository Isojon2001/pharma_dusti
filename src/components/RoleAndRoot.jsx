import React, {useEffect, useState} from 'react';
import { LayoutGrid, Phone, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import SidebarItem from './SidebarItem';
import '../index.css';


function RoleAndRoot() {
  const [user, setUser] = useState({});
  useEffect(() =>{
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])
  
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
            <SidebarItem icon={() => <span style={{ fontSize: 20 }}>🛡️</span>} label="Роли и права" to="/RoleAndRoot" />
            <SidebarItem icon={() => <span style={{ fontSize: 20 }}>📱</span>} label="Панель MobileApp" to="/mobile" />
            <SidebarItem icon={Phone} label="Журнал звонков" to="/calls" />
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

      <main className="content">
        <div className='root_header'>
          <div>
          <h1>Роли и права</h1>
          <p>Добавьте сотрудников с полными правами администратора, ограничьте доступ по разделам</p>
          </div>
          <div className='root_button'>
            <button>Добавить сотрудника <Plus/></button> 
          </div>
        </div>
        <div className='back_color_table'>
          <table className="user-table">
            <thead>
              <tr>
                <th>Вход</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Должность</th>
                <th>Телефон</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hello</td>
                <td>Абдулло</td>
                <td>Курбонхонов</td>
                <td>Руководитель</td>
                <td>+992917001898</td>
                <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      <Edit size={20} style={{ cursor: 'pointer' }} />
      <Eye size={20} style={{ cursor: 'pointer' }} />
      <Trash2 size={20} color="red" style={{ cursor: 'pointer' }} />
    </td>
              </tr>
                <tr>
                <td>Hello</td>
                <td>Абдулло</td>
                <td>Курбонхонов</td>
                <td>Руководитель</td>
                <td>+992917001898</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default RoleAndRoot;
