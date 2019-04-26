import React from "react";

import { compose, withConfig, withFetch } from "pursue";

class App extends React.Component {
  render() {
    console.log(this.props);

    return <div className="App">hey</div>;
  }
}

export default compose(
  withConfig,
  withFetch(({ config }) => ({
    options: {
      endpoint: "https://dog.ceo/api/breeds/image/random",
      headers: {}
    },
    hasOptions: true
  }))
)(App);
