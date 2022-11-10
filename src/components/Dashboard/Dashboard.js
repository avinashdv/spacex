import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Dashboard(props) {
  const [searchParams] = useSearchParams();

  let filterValue = searchParams.get("filter");

  filterValue = filterValue === null ? "all" : filterValue;

  const launchClickHandler = (launch) => {
    props.sendDataToModal(launch.flight_number);
  };

  useEffect(() => {
    props.filterLaunchesBySuccess(filterValue);
  }, []);

  const launches =
    props.rocketLaunches &&
    props.rocketLaunches.length > 0 &&
    props.rocketLaunches.map((launch) => {
      return (
        <>
          <tr
            className="border border-0 py-3"
            data-bs-toggle="modal"
            data-bs-target="#rocketModal"
            onClick={() => {
              launchClickHandler(launch);
            }}
            key={launch.flight_number}
            style={{
              cursor: "pointer",
            }}
          >
            <th className="border border-0 py-3" scope="row">
              {launch.flight_number}
            </th>
            <td className="border border-0 py-3">{launch.launch_date_local}</td>
            <td className="border border-0 py-3">{launch.launch_site}</td>
            <td className="border border-0 py-3">{launch.mission_name}</td>
            <td className="border border-0 py-3">{launch.orbit}</td>
            <td className="text-center border border-0 py-3">
              <span
                className={`${
                  launch.launch_status_boolean !== null
                    ? launch.launch_status_boolean
                      ? `text-success bg-success`
                      : `text-danger bg-danger`
                    : `text-warning bg-warning`
                }  bg-opacity-10 text-center px-3 rounded-5 fw-semibold`}
              >
                {launch.launch_status}
              </span>
            </td>
            <td className="border border-0 py-3">{launch.rocket}</td>
          </tr>
        </>
      );
    });

  return (
    <>
      <table
        className="table border rounded"
        style={{
          borderCollapse: "separate",
          borderSpacing: "initial",
        }}
      >
        <thead className="bg-light">
          <tr className="border border-0">
            <th className="border border-0 py-3" scope="col">
              No:
            </th>
            <th className="border border-0 py-3" scope="col">
              Launched(UTC)
            </th>
            <th className="border border-0 py-3" scope="col">
              Location
            </th>
            <th className="border border-0 py-3" scope="col">
              Mission
            </th>
            <th className="border border-0 py-3" scope="col">
              Orbit
            </th>
            <th scope="col" className="border border-0 text-center py-3">
              Launch Status
            </th>
            <th className="border border-0 py-3" scope="col">
              Rocket
            </th>
          </tr>
        </thead>
        <tbody>{launches}</tbody>
      </table>
    </>
  );
}
