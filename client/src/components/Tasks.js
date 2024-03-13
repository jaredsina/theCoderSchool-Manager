import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { deleteTask, initializeTasks } from "../reducers/taskReducer";

const Tasks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // reinitialize the tasks when the component mounts
  useEffect(() => {
    if (user) {
      dispatch(initializeTasks());
    }
  }, [dispatch, user]);

  const tasks = useSelector((state) => state.tasks);

  const tasksList = tasks.map((task) => {
    return (
      <div
        key={task.id}
        onClick={() => navigate(`/dashboard/${task.id}`)}
        className="bg-emerald-50 p-4 hover:bg-emerald-300 transition-all cursor-pointer grid grid-cols-7"
      >
        <p>{task.name}</p>
        <p className="col-span-2">{task.description}</p>
        <p className="col-span-2">{task.dueDate.split("T")[0]}</p>
        <Link
          to={`/dashboard/${task.id}`}
          className=" bg-green-400 hover:bg-green-500 text-white flex justify-center items-center font-bold rounded hover:scale-105 transition-all p-1 mx-4 text-center"
        >
          View
        </Link>
        <button
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white font-bold rounded hover:scale-105 transition-all p-1 mx-4"
          onClick={() => dispatch(deleteTask(task.id))}
        >
          Delete
        </button>
      </div>
    );
  });
  return (
    <div className="lg:px-8">
      <h4 className="font-bold text-3xl">Task List</h4>
      <div className="grid grid-cols-7 border-b border-emerald-950 mt-4">
        <p className="">Task Name</p>
        <p className=" col-span-2">Description</p>
        <p>Due Date</p>
      </div>
      <ul>{tasksList}</ul>
    </div>
  );
};

export default Tasks;
