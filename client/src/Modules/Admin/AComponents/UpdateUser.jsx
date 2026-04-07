import React, { useEffect, useState } from 'react'
import { TextField, Button, Paper, Typography } from '@mui/material'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

export default function UpdateUser() {

  const { uid } = useParams()   
  const navigate = useNavigate()

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })

  useEffect(() => {
  axios.get(`http://localhost:7000/user/getuserbyid/${uid}`)
    .then((res) => {
      console.log(res.data)  
      setUser(res.data.user)
    })
    .catch((err) => console.log(err))
    }, [uid])


  // Handle Change
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }
  const handleUpdate = () => {
    axios.put(`http://localhost:7000/user/updateuser/${uid}`, user)
      .then(() => {
        alert("User Updated Successfully..")
        navigate("/admin/viewuser")
      })
      .catch(err => console.log(err))
  }

  return (
    <Paper sx={{ p:4, maxWidth:500 }}>
      <Typography variant="h6">Update User</Typography>

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={user.name || ""}
        onChange={handleChange}
        sx={{ mt:2 }}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={user.email || ""}
        onChange={handleChange}
        sx={{ mt:2 }}
      />

      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={user.phone || ""}
        onChange={handleChange}
        sx={{ mt:2 }}
      />

      <TextField
        fullWidth
        label="Address"
        name="address"
        value={user.address || ""}
        onChange={handleChange}
        sx={{ mt:2 }}
      />

      <Button variant="contained" sx={{ mt:3 }} onClick={handleUpdate}>
        Update
      </Button>

    </Paper>
  )
}