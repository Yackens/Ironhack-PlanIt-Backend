const router = require("express").Router();
const mongoose = require('mongoose');
const Task = require("../models/Task.model");
const Category = require("../models/Category.model");

// GET route ==>  Get all tasks within category
router.get('/tasks/:categoryId', async (req, res) => {
    const userId = req.payload.user;
    const { categoryId } = req.params;
    try {
        // Find the category by its _id, scoped to the requesting user
        const category = await Category.findOne({ _id: categoryId, createdBy: userId });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Find tasks that have the matching category reference
        const tasks = await Task.find({ category: categoryId, createdBy: userId });

        return res.status(200).json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST /api/tasks  -  Creates a new task
router.post("/tasks/new", async (req, res) => {
  const { title, description, category, dueDate, status } = req.body;
  const createdBy = req.payload.user;

  try {
    // Only allow creating tasks inside a category the user owns
    const ownedCategory = await Category.findOne({ _id: category, createdBy });
    if (!ownedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    let newTask = await Task.create({ title, description, dueDate, status, category, createdBy})
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
    // Only these fields may be updated; category and createdBy stay fixed
    const updates = {};
    ["title", "description", "dueDate", "status"].forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    try {
        const response = await Task.findOneAndUpdate(
            { _id: taskId, createdBy: req.payload.user },
            updates,
            { new: true }
        );
        if (!response) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(response);
    } catch (err) {
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
        // Delete the task, but only if it belongs to the requesting user
        const task = await Task.findOneAndDelete({ _id: taskId, createdBy: req.payload.user });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Remove task reference from category
        await Category.findByIdAndUpdate(task.category, { $pull: { tasks: task._id } });

        return res.status(204).send();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;