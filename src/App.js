import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Modal from "./components/UI/Modal";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Filter from "./components/Filter/Filter";
import Pagination from "./components/UI/Pagination";

import useHttp from "./hooks/useHttp";

function App() {
  const { isLoading, sendRequest: fetchData } = useHttp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  let filterValue = searchParams.get("filter");

  filterValue = filterValue === null ? "all" : filterValue;

  const [rocketLaunches, setRocketLaunches] = useState([]);
  const [rocketId, setRocketId] = useState(1);

  const [filteredRocketLaunches, setFilteredRocketLaunches] = useState([]);

  const [dateFilter, setDateFilter] = useState(1);

  const [pageCount, setPageCount] = useState(1);
  const [paginationRules, setPaginationRules] = useState({
    prev: 1,
    pres: 1,
    next: 2,
  });

  useEffect(() => {
    const useData = (data) => {
      let rocketData = {};
      const res = [];
      let innerArr = [];
      let count = 0;
      data.forEach((el, i) => {
        rocketData.flight_number = String(el.flight_number).padStart(2, "0");

        const completeDate = new Date(el.launch_date_local);
        var onlyDate = String(completeDate.getDate()).padStart(2, "0");
        var dateString = completeDate.toLocaleString("en-us", {
          month: "long",
          year: "numeric",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        });

        rocketData.launch_date_local = `${onlyDate} ${dateString}`;
        rocketData.launch_year = completeDate.getFullYear();
        rocketData.launch_month = completeDate.getMonth() + 1;
        rocketData.launch_site = el.launch_site.site_name;
        rocketData.mission_name = el.mission_name;
        rocketData.orbit = el.rocket.second_stage.payloads[0].orbit;
        rocketData.launch_status =
          el.launch_success !== null
            ? el.launch_success === true
              ? "Success"
              : "Failed"
            : "Upcoming";
        rocketData.launch_status_boolean = el.launch_success;
        rocketData.rocket = el.rocket.rocket_name;

        count++;
        innerArr.push(rocketData);
        rocketData = {};
        if (count === 10) {
          res.push(innerArr);
          innerArr = [];
          count = 0;
        }
      });

      setRocketLaunches(() => {
        return res;
      });
      if (res.length < 2) {
        setPaginationRules((prevState) => {
          return {
            ...prevState,
            next: prevState.next - 1,
          };
        });
      }
      setFilteredRocketLaunches(res);
    };

    fetchData(
      {
        url: "https://api.spacexdata.com/v3/launches",
      },
      useData
    );
  }, []);

  const sendIdToModal = (id) => {
    setRocketId(id);
  };

  const sendPage = (pageNumber) => {
    if (pageCount > pageNumber) {
      setPaginationRules((prevState) => {
        if (pageNumber === 1) {
          return {
            ...prevState,
            pres: prevState.pres - 1,
            next: prevState.next - 1,
          };
        } else {
          return {
            ...prevState,
            prev: prevState.prev - 1,
            pres: prevState.pres - 1,
            next: prevState.next - 1,
          };
        }
      });
      setPageCount(() => pageCount - 1);
    } else {
      setPaginationRules((prevState) => {
        if (prevState.prev === prevState.pres) {
          return {
            ...prevState,
            pres: prevState.pres + 1,
            next: prevState.next + 1,
          };
        } else if (
          prevState.next === filteredRocketLaunches.length &&
          prevState.pres + 1 === prevState.next
        ) {
          return {
            ...prevState,
            next: prevState.next - 1,
          };
        } else {
          return {
            ...prevState,
            prev: prevState.prev + 1,
            pres: prevState.pres + 1,
            next: prevState.next + 1,
          };
        }
      });
      setPageCount(() => pageCount + 1);
    }
  };

  const filterLaunchesByDate = (value) => {
    let months = 0;
    let years = 0;
    const res = [];
    let innerArr = [];
    let count = 0;

    let lowerBoundMonth;
    let lowerBoundYear;

    let arr = value.split("-");
    let presentDate = new Date();

    if (arr[1].includes("month")) {
      months = parseInt(arr[0]);
      lowerBoundMonth = presentDate.getMonth() + 1 - 6;
      lowerBoundYear = presentDate.getFullYear();
      if (lowerBoundMonth < 0) {
        lowerBoundMonth = 12 - lowerBoundMonth;
        lowerBoundYear = lowerBoundYear - 1;
      }
    } else if (arr[1].includes("year")) {
      years = parseInt(arr[0]);
      lowerBoundYear = presentDate.getFullYear() - years;
    }

    if (months || years) {
      for (let el of rocketLaunches) {
        el.forEach((launch, i) => {
          if (months) {
            if (
              launch.launch_month >= lowerBoundMonth &&
              launch.launch_year >= lowerBoundYear
            ) {
              count++;
              innerArr.push(launch);
              if (count === 10) {
                res.push(innerArr);
                innerArr = [];
                count = 0;
              }
              setFilteredRocketLaunches(res);
            } else {
              setFilteredRocketLaunches(res);
            }
          } else {
            if (launch.launch_year >= lowerBoundYear) {
              count++;
              innerArr.push(launch);
              if (count === 10) {
                res.push(innerArr);
                innerArr = [];
                count = 0;
              }
              setFilteredRocketLaunches(res);
            } else {
              setFilteredRocketLaunches(res);
            }
          }
        });
      }

      if (res.length < 2) {
        setPaginationRules((prevState) => {
          return {
            ...prevState,
            next: prevState.next - 1,
          };
        });
      } else {
        setPaginationRules({
          prev: 1,
          pres: 1,
          next: 2,
        });
      }
      setPageCount(1);

      setDateFilter(lowerBoundYear);
    } else {
      setFilteredRocketLaunches(rocketLaunches);
    }
  };

  const filterLaunchesBySuccess = (value) => {
    let res = [];
    let innerArr = [];
    let count = 0;
    if (value === "success" || value === "failed" || value === "upcoming") {
      navigate(`/spacex/?filter=${value}`);
      for (let el of rocketLaunches) {
        el.forEach((launch) => {
          if (
            launch.launch_status.toLowerCase() === value &&
            (dateFilter === 1 ? true : launch.launch_year >= dateFilter)
          ) {
            innerArr.push(launch);
            count++;
            if (count === 10) {
              res.push(innerArr);
              innerArr = [];
              count = 0;
            }
          }
        });
      }
      if (count < 10 && count > 0) {
        res.push(innerArr);
      }
    } else {
      for (let el of rocketLaunches) {
        el.forEach((launch) => {
          if (dateFilter === 1 ? true : launch.launch_year >= dateFilter) {
            innerArr.push(launch);
            count++;
            if (count === 10) {
              res.push(innerArr);
              innerArr = [];
              count = 0;
            }
          }
        });
      }
    }
    setFilteredRocketLaunches(res);
    if (res.length < 2) {
      setPaginationRules((prevState) => {
        return {
          ...prevState,
          next: prevState.next - 1,
        };
      });
    } else {
      setPaginationRules({
        prev: 1,
        pres: 1,
        next: 2,
      });
    }
    setPageCount(1);
  };

  return (
    <>
      <Modal rocketId={rocketId} />
      <Navbar />
      <div className="container">
        <Filter
          filterLaunchesByDate={filterLaunchesByDate}
          filterLaunchesBySuccess={filterLaunchesBySuccess}
          defaultValue={filterValue}
        />

        {isLoading && (
          <div className="w-100 d-flex justify-content-center">
            <div className="spinner-border text-center" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {rocketLaunches.length > 0 && (
          <>
            <Dashboard
              rocketLaunches={filteredRocketLaunches[pageCount - 1]}
              sendDataToModal={sendIdToModal}
              isLoading={isLoading}
              filterLaunchesBySuccess={filterLaunchesBySuccess}
            />
            <Pagination
              paginationRules={paginationRules}
              sendPage={sendPage}
              pageCount={pageCount}
            />
          </>
        )}
      </div>
    </>
  );
}

export default App;
