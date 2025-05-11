import React, { useState, useEffect } from 'react';
import supabase from './supabase'; // импортируем Supabase
import './App.css'; // Подключаем CSS

const App = () => {
  const [tips, setTips] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0); // Общая сумма чаевых

  // Функция для загрузки всех записей из базы данных
  const loadTips = async (start = '', end = '') => {
    let query = supabase.from('chaevie_data').select('*').order('date', { ascending: false });

    if (start && end) {
      query = query.gte('date', start).lte('date', end);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Ошибка загрузки данных:', error);
    } else {
      setTips(data);
      // Подсчитываем общую сумму
      const total = data.reduce((sum, tip) => sum + tip.amount, 0);
      setTotalAmount(total);
    }
  };

  useEffect(() => {
    loadTips(); // Загружаем все записи при монтировании компонента
  }, []);

  const addTip = async () => {
    if (!amount || !date) {
      alert('Пожалуйста, заполните все поля!');
      return;
    }

    const { data, error } = await supabase
      .from('chaevie_data')
      .insert([
        { amount: parseFloat(amount), date: date },
      ]);

    if (error) {
      console.error('Ошибка добавления записи:', error);
    } else {
      setAmount('');
      setDate('');
      loadTips(); // Обновляем список после добавления
    }
  };

  // Функция для удаления записи с подтверждением
  const deleteTip = async (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить эту запись?');

    if (confirmed) {
      const { error } = await supabase.from('chaevie_data').delete().eq('id', id);

      if (error) {
        console.error('Ошибка удаления записи:', error);
      } else {
        loadTips(); // Обновляем список после удаления
      }
    }
  };

  // Функция для применения фильтра по датам
  const applyFilter = () => {
    if (startDate && endDate) {
      loadTips(startDate, endDate); // Загружаем записи по фильтру
    }
  };

  // Функция для сброса фильтра
  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    loadTips(); // Загружаем все записи без фильтрации
  };

  // Функция для форматирования даты в dd.mm.yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Месяцы с 0
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Получаем дату первой и последней записи
  const getFirstAndLastDate = () => {
    if (tips.length === 0) return { first: '', last: '' };

    const firstDate = tips[tips.length - 1].date;
    const lastDate = tips[0].date;

    return {
      first: formatDate(firstDate),
      last: formatDate(lastDate),
    };
  };

  // Получаем дату первой и последней записи с учетом фильтра
  const getFilteredFirstAndLastDate = () => {
    const filteredTips = tips.filter(tip => {
      return (
        (!startDate || new Date(tip.date) >= new Date(startDate)) &&
        (!endDate || new Date(tip.date) <= new Date(endDate))
      );
    });

    if (filteredTips.length === 0) return { first: '', last: '' };

    const firstDate = filteredTips[filteredTips.length - 1].date;
    const lastDate = filteredTips[0].date;

    return {
      first: formatDate(firstDate),
      last: formatDate(lastDate),
    };
  };

  return (
    <div className="app-container">
      <h1>Чаевые</h1>

      <div className="form-container">
        <h2>Добавить новую запись</h2>
        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-amount"
        />
        <div className="date-input-group">
          <label>Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button onClick={addTip}>Добавить</button>
      </div>

      <div className="filter-container">
        <h2>Фильтровать по дате</h2>
        <div className="date-filter">
          <div className="date-input-group">
            <label>С</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label>По</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
        <div className="filter-buttons">
          <button onClick={applyFilter}>Применить фильтр</button>
          <button onClick={resetFilter}>Сбросить фильтр</button>
        </div>
      </div>

      {/* Список чаевых теперь можно прокручивать */}
      <div className="tips-list">
        <ul>
          {tips.map((tip) => (
            <li key={tip.id}>
              {formatDate(tip.date)} - {tip.amount} €
              <button onClick={() => deleteTip(tip.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      <h2>Общая сумма чаевых: {totalAmount} €</h2> {/* Отображаем общую сумму */}

      {/* Добавляем дату первой и последней записи */}
      <div className="date-range">
        {startDate || endDate ? (
          <>
            <p>Дата первой записи: {getFilteredFirstAndLastDate().first}</p>
            <p>Дата последней записи: {getFilteredFirstAndLastDate().last}</p>
          </>
        ) : (
          <>
            <p>Дата первой записи: {getFirstAndLastDate().first}</p>
            <p>Дата последней записи: {getFirstAndLastDate().last}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
