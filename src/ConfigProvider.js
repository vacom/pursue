import React, { Children } from "react";
import PropTypes from "prop-types";

class ConfigProvider extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    children: PropTypes.any.isRequired
  };
  // you must specify what you’re adding to the context
  static childContextTypes = {
    config: PropTypes.object.isRequired
  };
  getChildContext() {
    const { config } = this.props;
    return { config };
  }
  render() {
    // `Children.only` enables us not to add a <div /> for nothing
    return Children.only(this.props.children);
  }
}
export default ConfigProvider;
