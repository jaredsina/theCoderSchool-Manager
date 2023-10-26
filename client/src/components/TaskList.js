import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteTask } from "../reducers/taskReducer";

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const taskList = tasks.map((task) => (
    <li key={task.id}>
      <Link to={`/dashboard/${task.id}`}>{task.name}</Link>
      <button type="button" onClick={() => dispatch(deleteTask(task.id))}>
        Delete
      </button>
    </li>
  ));
  return (
    <div>
      <h4 className="font-bold text-3xl">Task List</h4>
      <ul>{taskList}</ul>
    </div>
  );
};

export default TaskList;
