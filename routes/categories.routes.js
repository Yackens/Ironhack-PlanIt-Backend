const router = require("express").Router();
const mongoose = require('mongoose');
const Category = require("../models/Category.model");
const User = require("../models/User.model");

// GET route ==>  Get all the categories
router.get('/categories', async (req, res) => {
    const userId = req.payload.user;
    try {
        let response = await Category.find({createdBy: userId}).populate("tasks")
        return res.status(200).json(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
});

// Escapes regex metacharacters so user input is matched literally
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET route ==> Search categories by name
router.get('/categories/search', async (req, res) => {
    const userId = req.payload.user;
    const { q } = req.query;

    try {
        // Use a regex pattern for case-insensitive search
        const searchPattern = new RegExp(escapeRegex(q || ""), "i");

        const response = await Category.find({createdBy: userId, name: searchPattern });

        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST route ==>  Creates a new category
router.post("/categories/new", async (req, res) => {
    const { name } = req.body;
    const createdBy = req.payload.user;
    try {
        // Fetch the user's username to use as a unique prefix
        const user = await User.findById(createdBy);
        const userPrefix = user.username;
        const userPrefixName = `${userPrefix}_${name}`;

        // Create the new category
        let response = await Category.create({
            userPrefixName,
            name,
            createdBy,
            tasks: []
        });

        return res.status(201).json(response);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// PUT route ==>  Updates Category by Id
router.put('/categories/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    try {
        const response = await Category.findOneAndUpdate(
            { _id: categoryId, createdBy: req.payload.user },
            { name: req.body.name },
            { new: true }
        );
        if (!response) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// DELETE route ==>  Delete Category by Id
router.delete('/categories/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
    try {
        const deleted = await Category.findOneAndDelete({ _id: categoryId, createdBy: req.payload.user });
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(204).send();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;