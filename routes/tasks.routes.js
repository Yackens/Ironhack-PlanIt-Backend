const router = require("express").Router();
const mongoose = require('mongoose');
const Task = require("../models/Task.model");
const Category = require("../models/Category.model");

// GET route ==>  Get all tasks within category
router.get('/tasks/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        // Find the category by its _id
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Find tasks that have the matching category reference
        const tasks = await Task.find({ category: categoryId });

        return res.status(200).json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET route ==>  Get task by Id
router.get('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        // Find the category by its _id
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// POST /api/tasks  -  Creates a new task
router.post("/tasks/new", async (req, res) => {
  const { title, description, category, dueDate, status, createdAt} = req.body;

  try {
    let newTask = await Task.create({ title, description, dueDate, status, category, createdAt })
    let updateCategory = await Category.findByIdAndUpdate(category, { $push: { tasks: newTask._id } } );
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
        // Find the task to be deleted
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        // Remove task reference from category
        const category = await Category.findByIdAndUpdate(task.category, { $pull: { tasks: task._id } });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Delete the task
        await Task.findByIdAndRemove(taskId);
        return res.status(204).json({ message: `Task with ID ${taskId} is removed successfully.` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;