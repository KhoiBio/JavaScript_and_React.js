import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("calendarTodos")) || {};
  });
  const [newTodo, setNewTodo] = useState("");

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarTodos", JSON.stringify(todos));
  }, [todos]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handleAddTodo = () => {
    if (!selectedDate || !newTodo.trim()) return;
    setTodos((prev) => {
      const updated = { ...prev };
      updated[selectedDate] = [
        ...(updated[selectedDate] || []),
        { text: newTodo.trim(), completed: false },
      ];
      return updated;
    });
    setNewTodo("");
  };

  const handleDeleteTodo = (index) => {
    setTodos((prev) => {
      const updated = { ...prev };
      updated[selectedDate].splice(index, 1);
      return updated;
    });
  };

  const toggleCompleted = (index) => {
    setTodos((prev) => {
      const updated = { ...prev };
      updated[selectedDate][index].completed = !updated[selectedDate][index].completed;
      return updated;
    });
  };

  const changeMonth = (offset) => {
    let month = currentMonth + offset;
    let year = currentYear;
    if (month > 11) { month = 0; year++; }
    if (month < 0) { month = 11; year--; }
    setCurrentMonth(month);
    setCurrentYear(year);
    setSelectedDate(null);
  };

  const selectDate = (day) => {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    setSelectedDate(dateKey);
  };

  return (
    <div className="container">
      <div className="nav">
        <button onClick={() => changeMonth(-1)}>{"<"} Prev</button>
        <span className="month-title">{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}</span>
        <button onClick={() => changeMonth(1)}>Next {">"}</button>
      </div>

      <div className="calendar">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="day empty"></div>)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
          const hasTodo = todos[dateKey]?.some(t => !t.completed);
          return (
            <div
              key={day}
              className={`day ${selectedDate === dateKey ? "selected" : ""} ${hasTodo ? "has-todo" : ""}`}
              onClick={() => selectDate(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="todo">
        <h3>{selectedDate ? `To-Do for ${selectedDate}` : "Select a day"}</h3>
        {selectedDate && (
          <>
            <input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="New to-do..."
            />
            <button onClick={handleAddTodo}>Add</button>
            <ul>
              {(todos[selectedDate] || []).map((todo, idx) => (
                <li key={idx}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompleted(idx)}
                  />
                  <span className={todo.completed ? "completed" : ""}>{todo.text}</span>
                  <button onClick={() => handleDeleteTodo(idx)}>Delete</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
