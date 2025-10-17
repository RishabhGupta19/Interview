import { useState, useEffect } from "react";

export default function Todo() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/todos");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error loading todos", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  
  const addTask = async () => {
    if (!task.trim()) return alert("Please enter a task!");
    try {
      await fetch("http://localhost:3000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      setTask("");
      loadTodos();
    } catch (err) {
      console.log("Error adding task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: "DELETE",
      });
      loadTodos();
    } catch (err) {
      console.log("Error deleting task", err);
    }
  };


  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div>
      <h2>To-Do List</h2>

      <input
        type="text"
        placeholder="Add task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              <span>{t.task}</span>
              <button onClick={() => deleteTask(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
