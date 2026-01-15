import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("api/task/getAllTask", {
        params: {
          search: searchQuery,
          status: statusFilter,
        },
      });

      setTasks(res.data.data || res.data);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setLoading(true);
      await API.post("api/task/createTask", taskData);
      fetchTasks();
    } catch (err) {
      throw err.response?.data?.message || "Failed to create task";
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    console.log(id, taskData);
    try {
      setLoading(true);
      await API.put(`api/task/updateTask/${id}`, taskData);
      fetchTasks();
    } catch (err) {
      throw err.response?.data?.message || "Failed to update task";
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      const res = await API.delete(`api/task/deleteTask/${id}`);

      console.log(res);

      if (res.data) {
        toast.success("Task successfully deleted");
        setDeleteConfirm(null);
      }
      fetchTasks();
    } catch (err) {
      throw err.response?.data?.message || "Failed to delete task";
    } finally {
      setLoading(false);
    }
  };

  const getTaskById = async (id) => {
    try {
      setLoading(true);
      const res = await API.get(`api/task/task/${id}`);
      return res.data.data;
    } catch (err) {
      throw err.response?.data?.message || "Failed to fetch task";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchQuery, statusFilter]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        statusFilter,
        setStatusFilter,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        deleteConfirm,
        setDeleteConfirm,
        getTaskById,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
