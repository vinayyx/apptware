const express = require("express");
const router = express.Router();

const {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getSingleTask

} = require("../controllers/taskController");

router.post("/createTask", createTask);
router.get("/getAllTask", getAllTasks);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);
router.get("/task/:id", getSingleTask)

module.exports = router;
