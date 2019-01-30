import React from "react";
import PropTypes from "prop-types";
//Fetch
import axios from "axios";

const withFetch = config => WrappedComponent => {
  return class extends React.Component {
    displayName = "withFetch";
    static propTypes = {
      config: PropTypes.object.isRequired
    };
    state = {
      data: [],
      loading: true,
      network: {}
    };
    componentDidMount() {
      const { hasOptions } = config(this.props);
      if (!hasOptions) {
        this.setState({
          loading: false
        });
        return;
      }
      this._onFetch();
    }
    _onFetch = async () => {
      //{options: { name = "data", endpoint, ...rest }}
      try {
        //Gets the params data
        const { options } = config(this.props);
        const { endpoint } = options;
        //gets the default endpoint from the props
        let url = endpoint;
        const { api } = this.props.config;
        //Calls the server from the endpoint
        //const res = await axios.get(`${api.url}${url}`);
        const res = await axios({
          method: "get",
          url: `${api.url}${url}`,
          headers: { ...api.headers }
        });
        //Filters the data
        const { data, status, statusText } = res;
        const network = { status, statusText };
        //Checks for errors on the network and user auth
        this._onHandleErrors(status);
        //Updates the state and loads the component
        this.setState({
          data,
          network,
          loading: false
        });
      } catch (error) {
        this._onHandleErrors(401);
      }
    };
    _onLocalFetch = async endpoint => {
      try {
        const { api } = this.props.config;
        //Calls the server from the endpoint
        //const res = await axios.get(`${api.url}${endpoint}`);
        const res = await axios({
          method: "get",
          url: `${api.url}${endpoint}`,
          headers: { ...api.headers }
        });

        //Filters the data
        const { data, status, statusText } = res;
        const network = { status, statusText };
        //Checks for errors on the network and user auth
        this._onHandleErrors(status);
        //Updates the state and loads the component
        return { data, network };
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
      const { data, ...state } = this.state;
      const { options, ...rest } = config(this.props);
      let dynamicProps = [];

      if (rest.hasOptions) {
        dynamicProps[options.name || "data"] = data;
        dynamicProps["refetch"] = this._onFetch;
      }

      if (rest.hasLocalFetch) {
        dynamicProps["localFetch"] = this._onLocalFetch;
      }
      return <WrappedComponent {...dynamicProps} {...state} {...this.props} />;
    }
  };
};

export default withFetch;
