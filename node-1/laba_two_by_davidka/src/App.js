import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import React, { useState, useEffect } from 'react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';
import { v4 } from 'uuid';


export default function App() {

  const req = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  function sendAction(e) {

    let formData = new FormData();

    e.preventDefault();

    if (operation === 'post') {
      formData.append('name', taskName?.target?.value ?? null);
      formData.append('status', taskStatus?.target?.value ?? null);
      formData.append('date', taskDate ?? null);
      formData.append('file', taskFile?.current?.files[0] ?? null);
      req.post('/task', formData).then(res => {
        if (res.status === 200) {
          setRows([...rows, {
            id: v4(),
            file: res.data.file,
            name: taskName?.target?.value,
            status: taskStatus?.target?.value,
            date: taskDate,
          }]);

        }
      });
    }

    if (operation === 'put') {
      formData.append('name', taskName?.target?.value ?? null);
      formData.append('status', taskStatus?.target?.value ?? null);
      formData.append('date', taskDate ?? null);
      formData.append('file', taskFile?.current?.files[0] ?? null);
      req.post(`/task/put?id=${taskID.target.value}`, formData).then(res => {
        if (res.status === 200) {
          const editableRecord = rows.findIndex(el => {
            return el.file.toString().slice(0, el.file.toString().lastIndexOf('.')) == taskID.target.value || 
            el.file == taskID.target.value;
          });
          let temp1 = [...rows];
          let old = temp1[editableRecord];
          console.log(res.data.file ?? old.file);
          temp1[editableRecord] = {
            id: v4(),
            file: res.data.file ?? old.file,
            name: taskName?.target?.value ?? old.name,
            status: taskStatus?.target?.value ?? old.status,
            date: taskDate ?? old.date,
          };
          setRows([...temp1]);
        }
      });
    }

    if (operation === 'delete') {
      req.post(`/task/delete?id=${taskID.target.value}`).then(res => {
        if (res.status == 200) {
          const editableRecord = rows.findIndex(el => {
            return el.file.toString().slice(0, el.file.toString().lastIndexOf('.')) == taskID.target.value || 
            el.file == taskID.target.value;
          });
          let temp1 = [...rows];
          temp1.splice(editableRecord, 1);
          setRows([...temp1]);
        }
      });
      formData.append('id', taskID ? taskID.target.value : null);
    }
  }
  async function downloadFile(name) {
    const result = await req.get(`/task?id=${name}`, {responseType: 'blob'});
    const url = window.URL.createObjectURL(new Blob([result.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name}`); //or any other extension
    document.body.appendChild(link);
    link.click();
  }

  const [operation, setMethod] = React.useState(0);
  const [taskName, setName] = React.useState('');
  const [taskStatus, setStatus] = React.useState('');
  const [taskDate, setDate] = React.useState(null);
  const [taskID, setID] = React.useState('');
  const taskFile = React.createRef();
  const Input = styled('input')({
    display: 'none',
  });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      setMethod('none');
      setName('');
      setStatus('');
      setID('');
      const res = await req.get('/task/all');
      res.data.task.map(el => {
        el.id = v4();
        return el;
      });
      setRows([...res.data.task]);
    })();
  }, []);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'number',
      width: 150,
    },
    {
      field: 'file',
      headerName: 'ID',
      type: 'number',
      renderCell: (params) => {
        if(params.row.file.toString().includes('.')){
          return (
            params.row.file.toString().slice(0, params.row.file.toString().lastIndexOf('.'))
          );
        }
        return params.row.file;

      }
    },
    {
      field: 'fileDownload',
      headerName: 'File',
      width: 50,
      renderCell: (params) => {
        return (
          <div name={params.row.file}>
            <IconButton name={params.row.file} disabled={params.row.file ? false : true} onClick={() => {downloadFile(params.row.file)}}>
              <DownloadIcon />
            </IconButton>
          </div>
        );

      }
    }
  ];

  return (
    <div className="App">
      {(operation === 'post' || operation === 'put') ? < TextField
        sx={{ m: 3 }}
        required={!!(operation === 'post')}
        id="standard-required"
        label="Name"
        name='name'
        variant="standard"
        onChange={setName}
      /> : null}
      {(operation === 'post' || operation === 'put') ? < TextField
        sx={{ m: 3 }}
        required={!!(operation === 'post')}
        id="standard-required"
        label="Status"
        name='status'
        variant="standard"
        onChange={setStatus}
      /> : null}
      {(operation === 'post' || operation === 'put') ? <LocalizationProvider dateAdapter={AdapterDateFns} >
        <DatePicker
          label="Date"
          name='date'
          value={taskDate}
          required={!!(operation === 'post')}
          onChange={(newValue) => {
            setDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} sx={{ m: 3 }} />}
        />
      </LocalizationProvider> : null}

      {(operation === 'delete' || operation === 'put') ? <TextField
        sx={{ m: 3 }}
        required
        id="standard-required"
        label="ID"
        name='id'
        variant="standard"
        onChange={setID}
      /> : null}

      {(operation === 'post' || operation === 'put') ? <label htmlFor="icon-button-file">
        <label htmlFor="contained-button-file">
          <Input id="contained-button-file" type="file" name="file" ref={taskFile} />
          <Button variant="contained" component="span" sx={{ mt: 4 }}>
            <FileUploadIcon />

          </Button>
        </label>
      </label> : null}
      <FormControl sx={{ m: 3 }}>
        <Select
          value={operation}
          onChange={e => setMethod(e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Operation' }}
        >
          <MenuItem value={'post'}>Post</MenuItem>
          <MenuItem value={'put'}>Put</MenuItem>
          <MenuItem value={'delete'}>Delete</MenuItem>
        </Select>
        <FormHelperText>Operation</FormHelperText>
      </FormControl>
      <Button variant="contained" endIcon={<SendIcon />} sx={{ mt: 4 }} onClick={sendAction}>
        Send
      </Button>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
        />
      </div>
    </div>


  )
}
