import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import TasksPage from "./Pages/TaskPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Routes>
     
      <Route path="/" element={<Home />} />
      <Route path="/task" element={<TasksPage />} />
    </Routes>
  );
}

export default App;
