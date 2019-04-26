import React from "react";
import PropTypes from "prop-types";

const withFetch = config => WrappedComponent => {
  return class extends React.Component {
    displayName = "withFetch";
    static propTypes = {
      config: PropTypes.object
    };
    state = {
      response: [],
      loading: true,
      error: false
    };
    componentDidMount() {
      const { hasOptions } = config(this.props);
      if (!hasOptions) {
        this.setState({
          loading: false
        });
        return;
      }
      this.onFetch();
    }
    componentDidCatch(error) {
      this.setState({
        response: { error },
        loading: false,
        error: true
      });
    }
    delay = promiseToDelay =>
      new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const data = await promiseToDelay();
            resolve(data);
          } catch (err) {
            reject(err);
          }
        }, 1000);
      });
    onFetch = async () => {
      try {
        const { options } = config(this.props);

        const fetchConfig = {
          method: "GET",
          headers: new Headers({
            ...options.headers
          })
        };

        const res = options.hasDelay
          ? await this.delay(() => fetch(options.endpoint, fetchConfig))
          : await fetch(options.endpoint, fetchConfig);

        const data = await res.json();

        this.setState({
          response: data,
          loading: false,
          error: false
        });
      } catch (error) {
        this.setState({
          response: { error },
          loading: false,
          error: true
        });
      }
    };

    onLocalFetch = async (endpoint, config) => {
      try {
        const res = await fetch(endpoint, config);
        return res;
      } catch (error) {
        throw error;
      }
    };

    render() {
      const { response, loading, error } = this.state;
      const { options, ...rest } = config(this.props);
      let dynamicProps = [];
      const actions = loading ? {} : { refetch: this.onFetch, error };
      if (rest.hasOptions) {
        dynamicProps[options.name || "query"] = {
          loading,
          ...response,
          ...actions
        };
      }
      if (rest.hasLocalFetch) {
        dynamicProps["localFetch"] = this.onLocalFetch;
      }
      return <WrappedComponent {...dynamicProps} {...this.props} />;
    }
  };
};

export default withFetch;
