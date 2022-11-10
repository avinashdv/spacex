import React from "react";

export default function Filter(props) {
  const pastLaunchFilterHandler = (e) => {
    props.filterLaunchesByDate(e.target.value);
  };

  const successRateFilterHandler = (e) => {
    props.filterLaunchesBySuccess(e.target.value);
  };

  return (
    <>
      <div className="py-4 d-flex justify-content-between">
        <div className="dropdown d-flex align-items-center justify-content-between">
          <div className="me-2">
            <i className="far fa-calendar"></i>
          </div>
          <select
            className="form-select border-0"
            aria-label="Default select example"
            onChange={pastLaunchFilterHandler}
            defaultValue={"all-time"}
          >
            <option value="all-time">All Time</option>
            <option value="6-months">Past 6 months</option>
            <option value="1-year">Past 1 Year</option>
            <option value="2-year">Past 2 Years</option>
            <option value="5-year">Past 5 Years</option>
            <option value="10-year">Past 10 Years</option>
          </select>
        </div>

        <div className="dropdown dropdown d-flex align-items-center justify-content-between">
          <div className="me-2">
            <i className="fas fa-filter"></i>
          </div>
          <select
            className="form-select border-0"
            aria-label="Default select example"
            onChange={successRateFilterHandler}
            defaultValue={props.defaultValue}
          >
            <option value="all">All Launches</option>
            <option value="upcoming">Upcoming Launches</option>
            <option value="success">Successful Launches</option>
            <option value="failed">Failed Launches</option>
          </select>

          {/* <button
            className="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            All launches
          </button>
          <ul className="dropdown-menu p-0">
            <li>
              <a className="dropdown-item" href="#">
                All Launches
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Upcoming Launches
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Successful Launches
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Failed Launches
              </a>
            </li>
          </ul> */}
        </div>
      </div>
    </>
  );
}
