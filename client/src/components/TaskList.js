import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteTask } from "../reducers/taskReducer";

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const taskList = tasks.map((task) => (
    <li
      key={task.id}
      className="grid grid-cols-4 py-2 border-b border-emerald-950"
    >
      <Link
        to={`/dashboard/${task.id}`}
        className="whitespace-nowrap overflow-auto col-span-2"
      >
        {task.name}
      </Link>
      <Link
        to={`/dashboard/${task.id}`}
        className="bg-green-400 hover:bg-green-500 text-white font-bold mx-4 text-center rounded hover:scale-105 transition-all col-start-3"
      >
        View
      </Link>
      <button
        type="button"
        onClick={() => dispatch(deleteTask(task.id))}
        className="bg-red-600 hover:bg-red-700 text-white font-bold px-1 rounded hover:scale-105 transition-all col-start-4 mx-4"
      >
        Delete
      </button>
    </li>
  ));
  return (
    <div>
      <h4 className="font-bold text-3xl">Task List</h4>
      <div className="grid grid-cols-4 border-b border-emerald-950 mt-4">
        <p className="">Task Name</p>
      </div>
      <ul>{taskList}</ul>
    </div>
  );
};

export default TaskList;
