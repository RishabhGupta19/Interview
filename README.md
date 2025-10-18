1. No Table Creation in the Database

Issue:
Initially, the app connected to MySQL but didn’t create the todos table automatically.
As a result, queries like SELECT * FROM todos failed with the following error:

“ER_NO_SUCH_TABLE: Table 'hello_world_db.todos' doesn't exist”

Fix:
I added a table creation query inside the initializeDatabase() function to ensure that the table is created if it doesn’t already exist:

await connection.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL
  )
`);


This made the backend setup more reliable and eliminated manual SQL setup steps.

2. Incorrect Response Status in DELETE API

Issue:
The DELETE route returned a 404 (Not Found) status even after successfully deleting a task, causing the frontend to misinterpret successful operations as errors.

Fix:
I corrected the response code to 200 to indicate a successful operation:

res.status(200).json({ message: "Task deleted successfully" });


This ensured accurate communication between the backend and frontend.

3. Todos Not Loading on Page Refresh

Issue:
The function loadTodos() was defined but never called when the component first rendered.
Because of this, the tasks list appeared empty on page load and only updated after adding or deleting a task.

Fix:
I used React’s useEffect() hook to automatically load tasks when the component mounts:

useEffect(() => {
  loadTodos();
}, []);


This ensured that all existing tasks are fetched and displayed immediately when the page loads.

4. Missing Loading State Management

Issue:
Although a loading state variable was declared, it was never used.
This made the app appear unresponsive while fetching data from the server.

Fix:
I implemented proper loading state handling by updating the state before and after fetching:

setLoading(true);
try {
  const res = await fetch("http://localhost:3000/api/todos");
  const data = await res.json();
  setTasks(data);
} finally {
  setLoading(false);
}


Then, I used conditional rendering in the JSX to show a loading message:

{loading ?<p>Loading...</p>:<ul>...</ul>}


This improved the user experience by providing visual feedback during data retrieval.
