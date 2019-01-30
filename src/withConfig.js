import React, { Component } from "react";
import PropTypes from "prop-types";

const withConfig = ComponentToWrap => {
  return class ConfigComponent extends Component {
    // let’s define what’s needed from the `context`
    static contextTypes = {
      config: PropTypes.object.isRequired
    };
    render() {
      const { config } = this.context;
      // what we do is basically rendering `ComponentToWrap`
      // with an added `config` prop, like a hook
      return <ComponentToWrap {...this.props} config={config} />;
    }
  };
};

export default withConfig;
