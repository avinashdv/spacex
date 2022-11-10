import { useEffect, useState } from "react";
import PortalReactDOM from "react-dom";
import nasaIcon from "../../assets/images/nasa-icon.png";
import youtubeIcon from "../../assets/images/youtube-icon.png";
import wikiIcon from "../../assets/images/wiki-icon.png";
import useHttp from "../../hooks/useHttp";
import "./Modal.css";

const ModalDropdown = (props) => {
  const { sendRequest: fetch } = useHttp();

  const [rocketMission, setRocketMission] = useState({});

  useEffect(() => {
    const useData = (data) => {
      const mission = {};
      mission.flight_number = data.flight_number;
      mission.mission_name = data.mission_name;

      const completeDate = new Date(data.launch_date_utc);
      var dateString = completeDate.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });

      mission.launch_date = dateString;
      mission.rocket_name = data.rocket.rocket_name;
      mission.rocket_type = data.rocket.rocket_type;
      mission.nationality = data.rocket.second_stage.payloads[0].nationality;
      mission.manufacturer = data.rocket.second_stage.payloads[0].manufacturer;
      mission.payload_type = data.rocket.second_stage.payloads[0].payload_type;
      mission.orbit = data.rocket.second_stage.payloads[0].orbit;
      mission.img = data.links.mission_patch_small;
      mission.nasa = data.links.article_link;
      mission.wiki = data.links.wikipedia;
      mission.youtube = data.links.video_link;
      mission.launch_status = data.launch_success;
      mission.launch_status =
        data.launch_success !== null
          ? data.launch_success === true
            ? "Success"
            : "Failed"
          : "Upcoming";
      mission.launch_status_boolean = data.launch_success;
      mission.details = data.details;
      mission.launch_site = data.launch_site.site_name;
      setRocketMission(mission);
    };

    fetch(
      {
        url: `https://api.spacexdata.com/v3/launches/${props.rocketId}`,
      },
      useData
    );
  }, [props.rocketId]);

  return (
    <>
      <div
        className="modal fade"
        id="rocketModal"
        tabIndex="-1"
        aria-labelledby="rocketModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: "650px" }}>
          <div className="modal-content">
            <div className="d-flex justify-content-even p-4">
              <img
                src={rocketMission.img}
                alt={rocketMission.mission_name}
                style={{
                  width: "100px",
                  height: "100px",
                }}
              />
              <div className="d-flex flex-column ms-4 justify-content-between">
                <h1 className="modal-title fs-5" id="rocketModalLabel">
                  {rocketMission.mission_name}
                  <span
                    className={`${
                      rocketMission.launch_status_boolean !== null
                        ? rocketMission.launch_status_boolean
                          ? `text-success bg-success`
                          : `text-danger bg-danger`
                        : `text-warning bg-warning`
                    }  ms-3 bg-opacity-10 text-center px-3 py-1 rounded-5 status`}
                  >
                    {rocketMission.launch_status}
                  </span>
                </h1>
                <p>{rocketMission.rocket_name}</p>
                <div className="d-flex w-50 justify-content-between">
                  <a href={rocketMission.nasa} target="_blank">
                    <img src={nasaIcon} alt="nasa-icon" />
                  </a>
                  <a href={rocketMission.wiki} target="_blank">
                    <img src={wikiIcon} alt="wiki-icon" />
                  </a>
                  <a href={rocketMission.youtube} target="_blank">
                    <img src={youtubeIcon} alt="youtube-icon" />
                  </a>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                }}
              ></button>
            </div>
            <div className="modal-body px-4 py-2">
              <p className="m-0">{rocketMission.details}</p>
            </div>
            <div className="p-4">
              <div className="d-flex border-bottom py-3">
                <p className="w-50">Flight Number</p>
                <p className="w-50">{rocketMission.flight_number}</p>
              </div>
              <div className="d-flex border-bottom py-3">
                <p className="w-50">Mission Name</p>
                <p className="w-50">{rocketMission.mission_name}</p>
              </div>
              <div className="d-flex border-bottom py-3">
                <p className="w-50">Rocket Type</p>
                <p className="w-50">{rocketMission.rocket_type}</p>
              </div>
              <div className="d-flex border-bottom py-3">
                <p className="w-50">Rocket Name</p>
                <p className="w-50">{rocketMission.rocket_name}</p>
              </div>
              <div className="d-flex border-bottom py-3">
                <p className="w-50">Manufacturer</p>
                <p className="w-50">{rocketMission.manufacturer}</p>
              </div>
              <div className="d-flex border-bottom py-3">
                <p className="w-50">Nationality</p>
                <p className="w-50">{rocketMission.nationality}</p>
              </div>
              <div className="d-flex border-bottom py-3">
                <p className="w-50 m-0">Launch Date</p>
                <p className="w-50 m-0">{rocketMission.launch_date}</p>
              </div>
              <div className="d-flex border-bottom py-3">
                <p className="w-50">Payload Type</p>
                <p className="w-50">{rocketMission.payload_type}</p>
              </div>
              <div className="d-flex border-bottom py-3">
                <p className="w-50">Orbit</p>
                <p className="w-50">{rocketMission.orbit}</p>
              </div>
              <div className="d-flex py-3">
                <p className="w-50">Launch Site</p>
                <p className="w-50">{rocketMission.launch_site}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Modal(props) {
  return PortalReactDOM.createPortal(
    <ModalDropdown rocketId={props.rocketId} />,
    document.getElementById("bg-modal")
  );
}
