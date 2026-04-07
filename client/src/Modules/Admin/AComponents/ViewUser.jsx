import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function ViewUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:7000/user/getusers")
        .then((res) => {
            console.log(res.data.alluser)
            setUsers(res.data.alluser)
        })
        .catch((error) => {
            console.error(error)
        })

    })

    const handleDelete = (uid) => {
      axios.delete(`http://localhost:7000/user/deleteuserbyid/${uid}`)
    .then((res)=> {
      console.log(res)
      alert("USER DELETED..!!")
    })
    .catch((error) => {
      console.error(error)
    })
    }

    return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>SL.NUM</TableCell>
            <TableCell align="center">NAME</TableCell>
            <TableCell align="center">EMAIL</TableCell>
            <TableCell align="center">PHONE</TableCell>
            <TableCell align="center">ADDRESS</TableCell>
            <TableCell align=''>ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row, index) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell component="th" scope="row">{index+1}</TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="center">{row.phone}</TableCell>
              <TableCell align="center">{row.address}</TableCell>
              <TableCell> 
                <Button variant='contained' color='success' component={Link} to={`/admin/updateuser/${row._id}`}>UPDATE</Button>
                <Button variant='contained' color='error' onClick={()=>handleDelete(row._id)} >DELETE</Button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

