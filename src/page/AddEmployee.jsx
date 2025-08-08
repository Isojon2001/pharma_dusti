import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import '../index.css';

function AddEmployee() {
  const [form, setForm] = useState({
    name: '',
    manager: '',
    region: '',
    phone: '', 
    address: '',
    password: '',
    confirm: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEmployee = {
      id: crypto.randomUUID(),
      ИНН: '',
      Фирма: 'Нек Фарм',
      ВидКонтрагента: 'Клиент',
      Наименование: form.name,
      Код: '',
      Адрес: form.address,
      Телефон: form.phone,
      МенеджерКонтрагента: form.manager,
      БизнесРегион: form.region,
    };

    console.log('Новый сотрудник/контрагент:', newEmployee);

    navigate('/RoleAndRoot');
  };
  return (
    <div className="add-employee-page">
      <Breadcrumb
        className="category_breadcrumb"
        items={[
          { label: 'RoleAndRoot', to: '/RoleAndRoot' },
          { label: 'Добавление сотрудника' },
        ]}
      />

      <div className="addEmployee_paragraph">
        <div>
          <h1>Роли и права</h1>
          <p>Добавьте сотрудников с полными правами администратора, ограничьте доступ по разделам</p>
        </div>
        <div className="category_btn">
          <button onClick={() => navigate('/RoleAndRoot')}>Отменить</button>
          <button onClick={handleSubmit}>Сохранить</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        {/* Левая часть */}
        <div className="left-form">
          <h4>Данные сотрудника</h4>

          <label>Фамилия</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />

          <label>Имя</label>
          <input type="text" name="manager" value={form.manager} onChange={handleChange} required />

          <label>Отчество</label>
          <input type="text" name="region" value={form.region} onChange={handleChange} required />

          <label>Номер телефона</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />

          <label>Пароль</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <label>Подтвердите пароль</label>
          <input type="password" name="confirm" value={form.confirm} onChange={handleChange} required />
        </div>

        {/* Правая часть */}
        <div className="right-form">
          <h4>Системные роли</h4>
          <div className="radio-form">
            <label className="radio-option">
              <input type="radio" name="role" value="Администратор" onChange={handleChange} />
              <span className="custom-radio-check">✔</span>
              <div>
                <h1>Администратор</h1>
                <p>Все права к CRM системе: добавление, удаление, редактирование, доступы</p>
              </div>
            </label>

            <label className="radio-option">
              <input type="radio" name="role" value="Модератор" onChange={handleChange} />
              <span className="custom-radio-check">✔</span>
              <div>
                <h1>Модератор</h1>
                <p>Доступ к Panel Mobile App и Журналу Звонков</p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;
