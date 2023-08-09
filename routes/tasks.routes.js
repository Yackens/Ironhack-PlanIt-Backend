const router = require("express").Router();
const mongoose = require('mongoose');
const Task = require("../models/Task.model");
const Category = require("../models/Category.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET route ==>  Get all tasks within category
router.get('/tasks', isAuthenticated, async (req, res) => {
    try {
        let response = await Task.find()
        return res.status(200).json(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
});

// POST /api/tasks  -  Creates a new task
router.post("/tasks/new", async (req, res) => {
  const { title, description, categoryId, dueDate, status, createdAt} = req.body;
  //const { categoryId } = req.params;

  try {
    let newTask = await Task.create({ title, description, dueDate, status, category: categoryId, createdAt })
    let updateCategory = await Category.findByIdAndUpdate(categoryId, { $push: { tasks: newTask._id } } );
    return res.status(201).json({newTask, updateCategory});
} catch(err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
}
});

// PUT route ==>  Updates Tasks by Id
router.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    try {
        const response =  await Task.findByIdAndUpdate(taskId, req.body, { new: true });
        return res.status(200).json(response);
    } catch {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// DELETE route ==>  Delete Task by Id
router.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    try {
        await Task.findByIdAndRemove(taskId);
        return res.status(204).json({message: `Category with ${taskId} is removed successfully.` });
    } catch {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;