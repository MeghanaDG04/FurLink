import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

export default function ViewCategory() {

  const [categories, setCategories] = useState([]);

  const [cid, setCid] = useState("")
  const [open, setOpen] = useState(false);
  const [oldCategory, setOldCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");

  //  FETCH FROM MONGODB
  const fetchCategories = () => {
    axios.get("http://localhost:7000/category/getCategory")
      .then((res) => {
        console.log("Fetch Categories Response:", res.data);
        setCategories(res.data.cdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  //  DELETE CATEGORY
  const handleDelete = (id) => {
    axios.delete(`http://localhost:7000/category/deletecategory/${id}`)
      .then((res) => {
        console.log(res.data.cdata);
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //  OPEN EDIT
  const handleEdit = (cat) => {
    setCid(cat._id)
    setOldCategory(cat.category)
    setNewCategory(cat.category)
    setNewDescription(cat.description)
    setOpen(true)
  };
  // UPDATE CATEGORY
  const handleUpdate = () => {
    axios.put(`http://localhost:7000/category/updatecategory/${cid}`, {
    oldCategory,
    newCategory,
    description: newDescription
  })
  .then((res) => {
    setOpen(false);
    fetchCategories();
    console.log(res.data.cdata);
  })
  .catch((err) => {
    console.log(err);
    });
  };

  return (
    <Box>

      <Typography variant="h4" fontWeight={700} mb={1}>
        View Categories
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 3 }}>

        <TableContainer>
          <Table>

        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Category Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>

        {categories.length > 0 ? (
          categories.map((cat, index) => (
            <TableRow key={cat._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{cat.category}</TableCell>
              <TableCell>{cat.description}</TableCell>

              <TableCell align="center">

                <IconButton
                  color="secondary"
                  onClick={() => handleEdit(cat)}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => handleDelete(cat._id)}
                >
                  <DeleteIcon />
                </IconButton>

              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center">
              No categories found
            </TableCell>
          </TableRow>
        )}

        </TableBody>

          </Table>
        </TableContainer>

      </Paper>

      {/* Edit Category*/}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>

        <DialogTitle>Edit Category</DialogTitle>

          <DialogContent sx={{ mt: 1 }}>

            <TextField
              fullWidth
              label="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />

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