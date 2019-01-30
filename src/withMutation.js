import React from "react";
import PropTypes from "prop-types";
//Fetch
import axios from "axios";
//Utils
import qs from "qs";

const withMutation = config => WrappedComponent => {
  return class extends React.Component {
    displayName = "withMutation";
    static propTypes = {
      config: PropTypes.object.isRequired
    };
    _onSendData = async (body, params) => {
      try {
        const { options } = config(this.props);
        const { endpoint, method } = options;

        const { api } = this.props.config;
        let url = !params ? endpoint : `${endpoint}${params}`;

        const res = await axios({
          method,
          url: `${api.url}${url}`,
          data: qs.stringify(body),
          headers: { ...api.headers }
        });

        //Filters the payload data from the server
        const { data, status } = res;
        //Checks for errors on the network and user auth
        this._onHandleErrors(status);
        //Updates the state and loads the component
        return { data, status };
      } catch (error) {
        this._onHandleErrors(error.response.status);
      }
    };
    _onLocalMutation = async (endpoint, body) => {
      try {
        const { api } = this.props.config;
        const { options } = config(this.props);
        const { method } = options;
        //Calls the server from the endpoint
        const res = await axios({
          method,
          url: `${api.url}${endpoint}`,
          data: qs.stringify(body),
          headers: { ...api.headers }
        });
        //Filters the payload data from the server
        const { data, status } = res;
        //Checks for errors on the network and user auth
        this._onHandleErrors(status);
        //Updates the state and loads the component
        return { data, status };
      } catch (error) {
        this._onHandleErrors(error.response.status);
      }
    };
    _onHandleErrors = (status = 200) => {
      const { api, mode } = this.props.config;
      //redirect the page if something went wrong
      if (status === 401) {
        if (mode === "dev") {
          document.location.replace(api.loginUrl);
        } else {
          window.location.reload(true);
        }
        return;
      }

      if (status === 500) {
        //@TODO where to go from here?
        console.error("Internal Critical Error!");
        return;
      }
    };
    render() {
      const { options, ...rest } = config(this.props);
      let dynamicProps = [];
      dynamicProps[options.name || "post"] = this._onSendData;
      if (rest.hasLocalMutation) {
        dynamicProps["localMutation"] = this._onLocalMutation;
      }
      return <WrappedComponent {...dynamicProps} {...this.props} />;
    }
  };
};

export default withMutation;
