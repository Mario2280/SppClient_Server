import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";

const api = axios.create({
  baseURL: `http://localhost:9000`
});

function App() {
  const [method, setMethod] = useState("post");
  const [tasks, setTasks] = useState([]);
  const [inputID, setInputID] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputStatus, setInputStatus] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputFile, setInputFile] = useState("");
  const [flag, setflag] = useState(false);

  useEffect(() => {
    const getData = async () => {
      await api.get('/v3/api/tasks')
        .then((res) => {
          setTasks(res.data);
        })
    }
    getData();
  }, [flag]);

  const sendData = async (e) => {
    e.preventDefault();
    if (method === "post"){
      await api.post('/v3/api/add', {
        id: tasks.length + 1,
        task: inputName,
        status: inputStatus,
        date: inputDate,
        file: inputFile
      }).then((res) => {
        if (flag === true) {
          setflag(false);
        } else {
          setflag(true);
        }
      });
    } else if (method === "put") {
      await api.put('/v3/api/update', {
        id: inputID,
        task: inputName,
        status: inputStatus,
        date: inputDate,
        file: inputFile
      }).then((res) => {
        if (flag === true) {
          setflag(false);
        } else {
          setflag(true);
        }
      });
    } else if (method === "delete") {
      await api.delete(`/v3/api/delete/${inputID}`).then((res) => {
        if (flag === true) {
          setflag(false);
        } else {
          setflag(true);
        }
      });
    }
    setInputName('');
    setInputStatus('');
    setInputDate('');
    setInputFile('');
  };

  return (
    <div className="App">
      <div className="table">
        <tr>
          <td>ID</td>
          <td>Task</td>
          <td>Status</td>
          <td>Completion Date</td>
          <td>File</td>
        </tr>
        {tasks.map((task) => (
          <tr>
            <td>{task.id}</td>
            <td>{task.task}</td>
            <td>{task.status}</td>
            <td>{task.date}</td>
            <td>{task.file}</td>
          </tr>
        ))}
      </div>
      <div className="add__app">
        <form>
          <input value={inputID} onChange={e => setInputID(e.target.value)} placeholder="ID" type="number" />
          <input value={inputName} onChange={e => setInputName(e.target.value)} placeholder="Task" type="text" />
          <input value={inputStatus} onChange={e => setInputStatus(e.target.value)} placeholder="Status" type="text" />
          <input value={inputDate} onChange={e => setInputDate(e.target.value)} type="date" />
          <input value={inputFile} onChange={e => setInputFile(e.target.value)} type="file" />
          <button onClick={sendData} type="submit">Send a Data</button>
        </form>
      </div>
      <FormControl className="app__dropdown">
        <Select
          style={{ backgroundcolor: '#31343d', color: '#ffffff' }}
          variant="outlined"
          value={method}
          onChange={e => setMethod(e.target.value)}
        >
          <MenuItem value="post">POST</MenuItem>
          <MenuItem value="put">PUT</MenuItem>
          <MenuItem value="delete">DELETE</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default App;
