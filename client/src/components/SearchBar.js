import { faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
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

  useEffect(() => {
    if (search) {
      // filter the entire store for matches
      // add result types to all results so we can show it on the search results
      const filteredPartners = partners
        .filter((partner) =>
          partner.name.toLowerCase().includes(search.toLowerCase()),
        )
        .map((p) => {
          const modifiedPartner = { ...p };
          modifiedPartner.resultType = "program";
          return modifiedPartner;
        });

      const filteredPrograms = programs
        .filter((program) =>
          program.name.toLowerCase().includes(search.toLowerCase()),
        )
        .map((p) => {
          const modifiedProgram = { ...p };
          modifiedProgram.resultType = "program";
          return modifiedProgram;
        });
      const filteredTasks = tasks
        .filter((task) =>
          task.name.toLowerCase().includes(search.toLowerCase()),
        )
        .map((p) => {
          const modifiedTask = { ...p };
          modifiedTask.resultType = "task";
          return modifiedTask;
        });
      const filteredFiles = files
        .filter((file) =>
          file.filename.toLowerCase().includes(search.toLowerCase()),
        )
        .map((p) => {
          const modifiedFiles = { ...p };
          modifiedFiles.resultType = "file";
          return modifiedFiles;
        });
      // put the matches into an array
      setSearchList([
        ...filteredPartners,
        ...filteredPrograms,
        ...filteredTasks,
        ...filteredFiles,
      ]);
    }
    if (!search) {
      setSearchList([]);
    }
  }, [search, partners, programs, tasks, files]);

  // use the searchList to render the results below the search bar when it is open
  const renderedSearchList = searchList.map((item) => {
    return (
      <Link
        to={
          item.resultType === "file"
            ? `/dashboard/${item.partnerId ? item.partnerId : item.programId}`
            : `/dashboard/${item.id}`
        }
        key={item.id}
        className="search-result"
        onClick={() => setOpen(false)}
      >
        <div className="flex items-center justify-between m-2 p-4 bg-emerald-50 hover:bg-emerald-950 rounded-lg hover:text-white">
          <p className="text-sm w-48">
            {item.resultType === "file" ? item.filename : item.name}{" "}
          </p>
          <div className="flex gap-16">
            <span className=" text-emerald-700 text-xs">{item.resultType}</span>
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{
                color: "rgb(236,253,245)",
                width: ".5em",
              }}
            />
          </div>
        </div>
      </Link>
    );
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
          <div className="bg-white p-4 flex gap-4 items-center rounded-t-lg shadow-lg overflow-hidden border-b-slate-200 border-b">
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
          <div className="bg-white rounded-b-lg p-4">{renderedSearchList}</div>
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
      <div
        className="hidden bg-emerald-50 rounded-lg flex-grow max-w-xs p-2 lg:flex gap-2 items-center hover:bg-emerald-100"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            color: "rgb(2, 44, 34)",
          }}
        />
        <p className="flex-1 bg-transparent outline-none text-sm text-gray-400">
          Search
        </p>
      </div>
    </>
  );
};

export default SearchBar;
