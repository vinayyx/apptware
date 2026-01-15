const Task = require("../models/Task.js");
const mongoose = require("mongoose");



exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || "",
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });

    } catch (error) {
        console.error("Create Task Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error while creating task"
        });
    }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = {};

    
    if (search && typeof search !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query must be a string"
      });
    }

    
    if (status && !["Pending", "Completed", "All"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status filter must be Pending, Completed or All"
      });
    }

    
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } }
      ];
    }

    
    if (status && status !== "All") {
      query.status = status;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    console.error("Get All Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching tasks"
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

   
    if (!title && !description && !status) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update"
      });
    }

    
    if (title && title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title cannot be empty"
      });
    }

   
    if (status && !["Pending", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either Pending or Completed"
      });
    }

    
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status) updateData.status = status;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

   
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    });

  } catch (error) {
    console.error("Update Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating task"
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting task"
    });
  }
};

exports.getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error("Get Single Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


