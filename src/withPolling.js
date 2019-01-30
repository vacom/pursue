import React from "react";
import PropTypes from "prop-types";

const withPolling = config => WrappedComponent => {
  return class extends React.Component {
    displayName = "withPolling";
    static propTypes = {
      config: PropTypes.object.isRequired
    };
    state = {
      timeoutPoll: 0
    };
    componentDidMount() {
      this._onPoll();
    }
    _onPoll = async () => {
      try {
        const { options } = config(this.props);
        if (options.enable) {
          this.setState({
            timeoutPoll: setTimeout(() => {
              options.update();
              this._onPoll();
            }, options.interval)
          });
        }
      } catch (error) {
        return error;
      }
    };

    render() {
      let dynamicProps = [];
      dynamicProps["timeoutPoll"] = this.state.timeoutPoll;
      return <WrappedComponent {...dynamicProps} {...this.props} />;
    }
  };
};

export default withPolling;
