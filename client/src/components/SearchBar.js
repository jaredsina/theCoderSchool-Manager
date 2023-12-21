import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);

  const partners = useSelector((state) => state.partners);
  const programs = useSelector((state) => state.programs);
  const tasks = useSelector((state) => state.tasks);
  const files = useSelector((state) => state.files);

  // useEffect(() => {
  //   // filter the entire store for matches
  //   const filteredPartners = partners.filter((partner) =>
  //     partner.name.toLowerCase().includes(search.toLowerCase()),
  //   );
  //   const filteredPrograms = programs.filter((program) =>
  //     program.name.toLowerCase().includes(search.toLowerCase()),
  //   );
  //   const filteredTasks = tasks.filter((task) =>
  //     task.name.toLowerCase().includes(search.toLowerCase()),
  //   );
  //   const filteredFiles = files.filter((file) =>
  //     file.name.toLowerCase().includes(search.toLowerCase()),
  //   );
  //   // put the matches into an array
  //   setSearchList([
  //     ...filteredPartners,
  //     ...filteredPrograms,
  //     ...filteredTasks,
  //     ...filteredFiles,
  //   ]);
  // }, [search, partners, programs, tasks, files]);
  //! TODO: FINISH RENDERING THE SEARCH RESULTS
  // use the searchList to render the results below the search bar when it is open
  const renderedSearchList = searchList.map((item) => {
    if (item.type === "partner") {
      return (
        <Link
          to={`/dashboard/partners/${item.id}`}
          key={item.id}
          className="search-result"
          onClick={() => setOpen(false)}
        >
          <div className="flex items-center gap-4">
            <p className="text-sm">{item.name}</p>
          </div>
        </Link>
      );
    }
    if (item.type === "program") {
      return (
        <Link
          to={`/dashboard/programs/${item.id}`}
          key={item.id}
          className="search-result"
          onClick={() => setOpen(false)}
        >
          <div className="flex items-center gap-4">
            <p className="text-sm">{item.name}</p>
          </div>
        </Link>
      );
    }
  });

  if (open) {
    return (
      <div className="fixed inset-0 flex items-start justify-center pt-16 z-50 sm:pt-24">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="fixed inset-0 bg-slate-900/25 backdrop-blur transition-opacity opacity-100"
          onClick={() => {
            setOpen(false);
            setSearch("");
          }}
        />
        <div className="relative transition-all w-full max-w-lg transform px-4">
          <div className="bg-white p-4 flex gap-4 items-center rounded-lg shadow-lg overflow-hidden">
            <input
              type="text"
              className="search-bar flex-1 bg-transparent outline-none"
              placeholder="Find anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                color: "rgb(148, 163, 184)",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="lg:hidden ">
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            color: "rgb(2, 44, 34)",
          }}
          onClick={() => setOpen(true)}
        />
      </div>
      <div className=" hidden bg-emerald-50 rounded-lg flex-grow max-w-sm p-2 lg:flex gap-2 items-center">
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            color: "rgb(2, 44, 34)",
          }}
        />
        <input
          type="text"
          className="search-bar flex-1 bg-transparent outline-none text-sm"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </>
  );
};

export default SearchBar;
