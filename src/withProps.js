import React from "react";

/**
 * Gives the component new props
 * use: withProps({sample: 'Sample Prop'})(Component)
 */

const withProps = injectedProps => WrappedComponent => {
  const withProps = props => <WrappedComponent {...injectedProps} {...props} />;

  return withProps;
};

export default withProps;
