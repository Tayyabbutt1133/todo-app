import React from "react";
import getCookie from "../../utils/getcookie.js";
import { useEffect } from "react";

const Authcheck = ({ Component }) => {
  const cookie = getCookie("access_token");

  useEffect(() => {
    cookie;
  }, []);
  return function WrappedComponent(props) {
    if (cookie) {
      return <Component {...props} />;
    }
  };
};

export default Authcheck