import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

export default function Manageuser() {
  const [users, setUsers] = useState([]);

  // Edit Dialog State
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
   // password: "",
  });

  const fetchUsers = () => {
    axios.get("http://localhost:7000/user/getusers")
      .then((res) => {
        setUsers(res.data.alluser);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const handleDelete = (id) => {
    axios.delete(`http://localhost:7000/user/deleteuserbyid/${id}`)
      .then(() => {
        fetchUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Open Edit Dialog
  const handleEdit = (user) => {
    setEditId(user._id);
    setEditUser(user);
    setOpen(true);
  };

  // Update User
  const handleUpdate = () => {
    axios.put(`http://localhost:7000/user/updateuser/${editId}`, editUser)
      .then((res) => {
        console.log(res.data.userupdate);

        setOpen(false);
        fetchUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Manage Users
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        View and manage all registered users.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}> # </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}> Name </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}> Email </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}> Phone </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}> Address </TableCell>
                {/* <TableCell sx={{ color: "#fff", fontWeight: 700 }}> Password </TableCell> */}
                <TableCell sx={{ color: "#fff", fontWeight: 700 }} align="center" > Action </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      "&:hover": {
                        bgcolor: "rgba(102,126,234,0.05)",
                      },
                      transition: "0.2s",
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <PersonIcon
                          sx={{
                            color: "#667eea",
                            fontSize: 20,
                          }}
                        />
                        {user.name}
                      </Box>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    {/* <TableCell>{user.password}</TableCell> */}

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(user)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Edit User</DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, }} >
          <TextField label="Name" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
          <TextField label="Email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value }) } />
          <TextField label="Phone" value={editUser.phone} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value }) } />
          <TextField label="Address" value={editUser.address} onChange={(e) => setEditUser({ ...editUser, address: e.target.value }) } />
          {/* <TextField label="Password" value={editUser.password} onChange={(e) => setEditUser({ ...editUser, password: e.target.value }) } /> */}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}