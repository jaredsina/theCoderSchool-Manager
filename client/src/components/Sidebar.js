import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const partners = useSelector((state) => state.partners);
  const programs = useSelector((state) => state.programs);

  const [search, setSearch] = useState("");
  const [partnersList, setPartnersList] = useState([]);
  const [programsList, setProgramsList] = useState([]);
  const [programsWithoutPartners, setProgramsWithoutPartners] = useState([]);
  const [sort, setSort] = useState("Alphabetical");
  const [filters, setFilters] = useState([]);

  // update the filters array when a new filter is checked or unchecked
  const filterChange = (e) => {
    if (e.target.checked) {
      setFilters(filters.concat(e.target.value));
    } else {
      setFilters(filters.filter((filter) => filter !== e.target.value));
    }
  };

  useEffect(() => {
    // filter the partners based on the search input and filters
    let filteredPartners = partners.filter((partner) => {
      // if the partner name matches the search input
      if (partner.name.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }
      // if the partner has programs and the program names match the search input
      if (partner.programs.length > 0) {
        return partner.programs.some((program) =>
          program.name.toLowerCase().includes(search.toLowerCase()),
        );
      }
      // if no matches are found
      return false;
    });

    // filter the filteredPartners by the active/inactive filter on their programs array
    // if both are checked
    if (filters.includes("Active") && filters.includes("Inactive")) {
      // do nothing
    } else if (filters.includes("Active")) {
      // filter out partners with no active programs
      filteredPartners = filteredPartners.filter((partner) => {
        if (partner.programs.length > 0) {
          return partner.programs.some((program) => program.status === true);
        }
        return false;
      });
      // if the partner has programs that are active change the partners programs list to only include active programs
      filteredPartners = filteredPartners.map((partner) => {
        if (partner.programs.length > 0) {
          return {
            ...partner,
            programs: partner.programs.filter(
              (program) => program.status === true,
            ),
          };
        }
        return partner;
      });
    } else if (filters.includes("Inactive")) {
      // filter out active partners
      filteredPartners = filteredPartners.filter((partner) => {
        if (partner.programs.length > 0) {
          return partner.programs.some((program) => program.status === false);
        }
        return false;
      });
      // if the partner has programs that are inactive change the partners programs list to only include inactive programs
      filteredPartners = filteredPartners.map((partner) => {
        if (partner.programs.length > 0) {
          return {
            ...partner,
            programs: partner.programs.filter(
              (program) => program.status === false,
            ),
          };
        }
        return partner;
      });
    }

    // combine all filters into one process
    const filteredPrograms = programs.filter((program) => {
      if (program.name.toLowerCase().includes(search.toLowerCase())) {
        // if both are checked
        if (filters.includes("Active") && filters.includes("Inactive")) {
          return true;
        }
        if (filters.includes("Active")) {
          return program.status === true;
        }
        if (filters.includes("Inactive")) {
          return program.status === false;
        }
        return true;
      }
      return false;
    });

    // sort the list of partners and programs based on the sort input
    if (sort === "Alphabetical") {
      // sort the partners alphabetically
      filteredPartners.sort((a, b) => a.name.localeCompare(b.name));

      // sort the programs alphabetically
      filteredPrograms.sort((a, b) => a.name.localeCompare(b.name));
    }

    // get a list of all the partners and their programs
    setPartnersList(
      filteredPartners.map((partner) => (
        <li key={partner.id}>
          <Link to={`/dashboard/${partner.id}`}>{partner.name}</Link>
          {partner.programs.length > 0 ? (
            <ul>
              {partner.programs.map((program) => (
                <li key={program.id}>
                  <Link to={`/dashboard/${program.id}`}>{program.name}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      )),
    );
    // get a list of all the programs
    setProgramsList(
      filteredPrograms.map((program) => (
        <li key={program.id}>
          <Link to={`/dashboard/${program.id}`}>{program.name}</Link>
        </li>
      )),
    );

    // get a list of all the programs without partners
    setProgramsWithoutPartners(
      filteredPrograms.map((program) => {
        if (program.partner === null) {
          return (
            <li key={program.id}>
              <Link to={`/dashboard/${program.id}`}>{program.name}</Link>
            </li>
          );
        }
        return null;
      }),
    );
  }, [search, partners, programs, sort, filters]);

  return (
    <div className="sidebar">
      Search
      <input type="text" onChange={(e) => setSearch(e.target.value)} />
      Sort:
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="Alphabetical">Alphabetical</option>
        <option value="Newest">Newest</option>
        <option value="Oldest">Oldest</option>
      </select>
      <p>Filter:</p>
      {/* Filter for active and inactive programs using checkbox */}
      <label htmlFor="activeStatus">
        Active
        <input
          type="checkbox"
          id="activeStatus"
          name="activeStatus"
          value="Active"
          onChange={(e) => filterChange(e)}
        />
      </label>
      <label htmlFor="inactiveStatus">
        Inactive
        <input
          type="checkbox"
          id="inactiveStatus"
          name="inactiveStatus"
          value="Inactive"
          onChange={(e) => filterChange(e)}
        />
      </label>
      <h4>Partners</h4>
      <ul>{partnersList}</ul>
      <h4>No Partner Programs</h4>
      <ul>{programsWithoutPartners}</ul>
      <h4>Programs</h4>
      <ul>{programsList}</ul>
    </div>
  );
};

export default Sidebar;
