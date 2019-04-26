import React, { Fragment, cloneElement } from "react";
import PropTypes from "prop-types";

function HandleFallback({
  render,
  data,
  customLoading,
  LoadingComponent,
  ErrorComponent
}) {
  if (data.loading) {
    return customLoading ? (
      cloneElement(LoadingComponent)
    ) : (
      <div>Loading...</div>
    );
  }
  if (data.error) {
    return customLoading ? cloneElement(ErrorComponent) : <div>Error...</div>;
  }

  return <Fragment>{render(data)}</Fragment>;
}

HandleFallback.defaultProps = {
  customLoading: false
};

HandleFallback.propTypes = {
  render: PropTypes.func,
  customLoading: PropTypes.bool,
  LoadingComponent: PropTypes.node,
  ErrorComponent: PropTypes.node,
  data: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array.isRequired
  ])
};

export default HandleFallback;
