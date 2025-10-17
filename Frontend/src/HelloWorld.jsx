import { useState, useEffect } from 'react';

export default function HelloWorld() {
  const [message, setMessage] = useState('');
  const [dbData, setDbData] = useState([]);
  const [id,setId]= useState();
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    fetch('http://localhost:3000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  const loadDbData = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/messages')
      .then(res => res.json())
      .then(data => setDbData(data))
      .catch(err => console.error(err));
      setLoading(false);
  };

   const del = async () => {
  if (!id) return alert("Please enter an ID first!");
  
  try {
    const res = await fetch(`http://localhost:3000/api/messages/${id}`, {
      method: "POST",
    });
    const data = await res.json();
    console.log("Deleted:", data);
    loadDbData();
  } catch (err) {
    console.error(err);
  }
};
    
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Hello World App</h1>
      
      <div style={styles.section}>
        <h2>Backend Message:</h2>
        <p style={styles.message}>{message || 'Loading...'}</p>
      </div>

      <div style={styles.section}>
        <h2>Database Messages:</h2>
        <button onClick={loadDbData} style={styles.button}>
          Load from Database
        </button>
        <ul style={styles.list}>
          {dbData.map(item => (
            <li key={item.id}>
              {item.id}: {item.message}
            </li>
          ))}
        </ul>
         </div> 
        <form action={"http://localhost:3000/api/messages"} method={"POST"} >
            <h3>Submit new message</h3>
            <label>Your message : </label> 
          <input  type='text' placeholder='Type new message' name = 'message' id='message'></input>
       
          <br></br>
          <br></br>
          <button type='submit' onClick={loadDbData}>Submit</button>
        </form>
        <h3>Delete a message </h3>
        <input type='number' name='delete' id='delete' placeholder=' Type the id' onChange={(e)=>{setId(e.target.value);}}></input>
        <button onClick={()=>del()}>Delete</button>
        
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
   
  },
  title: {
    textAlign: 'center',
    color: '#333'
  },
  section: {
    margin: '30px 0',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  message: {
    fontSize: '18px',
    color: '#0066cc'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  list: {
    marginTop: '20px',
    listStyle: 'none',
    padding: 0
  }
};