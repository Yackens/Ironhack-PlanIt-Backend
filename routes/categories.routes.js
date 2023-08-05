const router = require("express").Router();

const Category = require("../models/Category.model");

// GET route ==>  Get all the categories
router.get('/categories', async (req, res) => {
    try {
        let response = await Category.find().populate("tasks")
        return res.status(200).json(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
});

// POST route ==>  Creates a new category
router.post("/categories", async (req, res) => {
    const { name } = req.body;
    try {
        let response = await Category.create({name, tasks: []});
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
        const response =  await Category.findByIdAndUpdate(categoryId, req.body, { new: true });
        return res.status(200).json(response);
    } catch {
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
        await Category.findByIdAndRemove(categoryId);
        return res.status(200).json({message: `Category with ${categoryId} is removed successfully.` });
    } catch {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
