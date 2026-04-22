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
  Select,
  MenuItem,
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

export default function ManageBooking() {
  const [bookings, setBookings] = useState([]);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editBooking, setEditBooking] = useState({
    fullname: "",
    email: "",
    phone: "",
    quantity: "",
    bookingstatus: "",
  });

  // FETCH BOOKINGS
  const fetchBookings = () => {
    axios
      .get("http://localhost:7000/booking/getbooking")
      .then((res) => {
        setBookings(res.data.allbooking);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // DELETE
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:7000/booking/deletebooking/${id}`)
      .then(() => fetchBookings())
      .catch((err) => console.log(err));
  };

  // OPEN EDIT
  const handleEdit = (booking) => {
    setEditId(booking._id);
    setEditBooking(booking);
    setOpen(true);
  };

  // UPDATE BOOKING
  const handleUpdate = () => {
    axios
      .put(
        `http://localhost:7000/booking/updatebooking/${editId}`,
        editBooking
      )
      .then(() => {
        setOpen(false);
        fetchBookings();
      })
      .catch((err) => console.log(err));
  };

  // UPDATE STATUS DIRECTLY
  const handleStatusChange = (id, status) => {
    axios
      .put(`http://localhost:7000/booking/updatebooking/${id}`, {
        bookingstatus: status,
      })
      .then(() => fetchBookings())
      .catch((err) => console.log(err));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Manage Bookings
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        View and manage all bookings.
      </Typography>

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#667eea" }}>
                <TableCell sx={{ color: "#fff" }}>#</TableCell>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                <TableCell sx={{ color: "#fff" }}>Product</TableCell>
                <TableCell sx={{ color: "#fff" }}>Qty</TableCell>
                <TableCell sx={{ color: "#fff" }}>Total</TableCell>
                <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff" }}>Payment</TableCell>
                <TableCell sx={{ color: "#fff" }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((b, index) => (
                  <TableRow key={b._id}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <PersonIcon sx={{ color: "#667eea" }} />
                        {b.fullname}
                      </Box>
                    </TableCell>

                    <TableCell>{b.email}</TableCell>
                    <TableCell>{b.phone}</TableCell>
                    <TableCell>{b.productID?.name || "N/A"}</TableCell>
                    <TableCell>{b.quantity}</TableCell>
                    <TableCell>₹{b.totalamount}</TableCell>
                    <TableCell>
                      {b.bookingDate
                        ? new Date(b.bookingDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    {/* STATUS DROPDOWN */}
                    <TableCell>
                      <Select
                        size="small"
                        value={b.bookingstatus}
                        disabled={b.bookingstatus === "Confirmed"}
                        onChange={(e) =>
                          handleStatusChange(b._id, e.target.value)
                        }
                        sx={{
                          bgcolor: b.bookingstatus === "Confirmed" ? "rgba(0,0,0,0.05)" : "transparent",
                          "& .MuiSelect-select": {
                            display: "flex",
                            alignItems: "center",
                          }
                        }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>

                    {/* PAYMENT STATUS */}
                    <TableCell>
                      <Chip
                        label={b.paymentstatus || 'Pending'}
                        size="small"
                        color={
                          b.paymentstatus === 'Paid' ? 'success' :
                          b.paymentstatus === 'Refunded' ? 'info' :
                          b.paymentstatus === 'Failed' ? 'error' :
                          'default'
                        }
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(b)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDelete(b._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* EDIT DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Edit Booking</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Full Name"
            value={editBooking.fullname}
            onChange={(e) =>
              setEditBooking({ ...editBooking, fullname: e.target.value })
            }
          />

          <TextField
            label="Email"
            value={editBooking.email}
            onChange={(e) =>
              setEditBooking({ ...editBooking, email: e.target.value })
            }
          />

          <TextField
            label="Phone"
            value={editBooking.phone}
            onChange={(e) =>
              setEditBooking({ ...editBooking, phone: e.target.value })
            }
          />

          <TextField
            label="Quantity"
            type="number"
            value={editBooking.quantity}
            onChange={(e) =>
              setEditBooking({ ...editBooking, quantity: e.target.value })
            }
          />

          <Select
            value={editBooking.bookingstatus}
            disabled={editBooking.bookingstatus === "Confirmed"}
            onChange={(e) =>
              setEditBooking({
                ...editBooking,
                bookingstatus: e.target.value,
              })
            }
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
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