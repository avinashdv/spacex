import React, { useEffect, useState } from "react";

export default function Pagination(props) {
  const [disable, setDisable] = useState({
    left: false,
    right: false,
  });

  useEffect(() => {
    if (props.paginationRules.prev === props.paginationRules.next) {
      setDisable({ left: true, right: true });
    } else if (props.paginationRules.prev === props.paginationRules.pres) {
      setDisable((prevState) => ({ ...prevState, left: true }));
    } else if (props.paginationRules.pres === props.paginationRules.next) {
      setDisable((prevState) => ({ ...prevState, right: true }));
    } else {
      setDisable({ left: false, right: false });
    }
  }, [props]);

  const sendPage = (pageNumber) => {
    return props.sendPage(pageNumber);
  };

  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className="pagination float-end">
          <li className="page-item">
            <a
              className={`${
                disable.left ? "bg-light" : "bg-white"
              } page-link text-dark`}
              href="#"
              style={{
                pointerEvents: disable.left ? "none" : "auto",
              }}
              onClick={() => {
                sendPage(props.paginationRules.prev);
              }}
            >
              &lt;
            </a>
          </li>
          <li className="page-item">
            <a
              className={`${
                disable.right ? "bg-light" : "bg-white"
              } page-link text-dark`}
              href="#"
              style={{
                pointerEvents: disable.right ? "none" : "auto",
              }}
              onClick={() => {
                sendPage(props.paginationRules.next);
              }}
            >
              &gt;
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
