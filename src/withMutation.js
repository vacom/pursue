import React from "react";
import PropTypes from "prop-types";

const withMutation = config => WrappedComponent => {
  return class extends React.Component {
    displayName = "withMutation";
    static propTypes = {
      config: PropTypes.object
    };
    componentDidCatch(error) {
      throw error;
    }
    onMutation = async () => {
      try {
        const { options } = config(this.props);

        const fetchConfig = {
          method: options.method || "POST",
          headers: new Headers({
            ...options.headers
          }),
          body: options.data
        };

        return await fetch(options.endpoint, fetchConfig);
      } catch (error) {
        throw error;
      }
    };

    onLocalMutation = async (endpoint, method, data, config) => {
      try {
        return await fetch(endpoint, {
          method: method || "POST",
          ...config,
          body: data
        });
      } catch (error) {
        throw error;
      }
    };

    render() {
      const { options, ...rest } = config(this.props);
      let dynamicProps = [];
      if (rest.hasOptions) {
        dynamicProps[options.name || "mutation"] = this.onMutation;
      }
      if (rest.hasLocalFetch) {
        dynamicProps["localMutation"] = this.onLocalFetch;
      }
      return <WrappedComponent {...dynamicProps} {...this.props} />;
    }
  };
};

export default withMutation;
