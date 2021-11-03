import './App.css';
import axios from 'axios';
import { useState,useEffect} from 'react';
import uuid from 'react-uuid';

const URL = 'http://localhost/shoppinglist/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [amount, setAmount] = useState('');

useEffect(() => {
  axios.get(URL)
  .then((response) => {
    setTasks(response.data);
  }).catch(error => {
    alert(error.response ? error.response.data.error : error);
  })
}, [])

function add(e) {
  e.preventDefault();
  const combined = {description:task, amount:amount}
  const json = JSON.stringify(combined)
  axios.post(URL + 'add.php',json,{
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  . then((response) => {
    setTasks(tasks => [...tasks,response.data]);
    setTask('');
    setAmount('');
  }).catch (error => {
    alert(error.response.data.error)
  });
}

function remove(id) {
  const json = JSON.stringify({id:id})
  axios.post(URL + 'delete.php',json,{
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then((response) => {
    const newListWithoutRemoved = tasks.filter((item) => item.id !== id);
    setTasks(newListWithoutRemoved);
  }).catch (error => {
    alert(error.response ? error.response.data.error : error);
  });
}

  return (
    <div className="container">
      <h3>Shoppinglist</h3>
      <form onSubmit={add}>
        <label>New item</label>
        <input placeholder="type description" value={task} onChange={e => setTask(e.target.value)}/>
        <input placeholder="type amount" value={amount} onChange={e => setAmount(e.target.value)}/>
        <button>Add</button>
      </form>

      <table>
        <tbody>
        {tasks?.map(task => (
          <tr key={uuid()}>
            <td>{task.description}</td>
            <td>{task.amount}</td>
            <td className="delete" onClick={() => remove(task.id)} href="#">Delete</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
