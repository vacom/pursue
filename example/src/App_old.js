import React from "react";

import Add from "./Add";
import List from "./List";
import { compose, withConfig, withFetch } from "pursue";

class App extends React.Component {
  refreshList = () => {
    this.props.refetch();
  };
  render() {
    return (
      <div className="App">
        <Add refresh={this.refreshList} />
        <br />
        {this.props.loading ? (
          <div>Loading todos...</div>
        ) : this.props.data.result === null ||
          Object.keys(this.props.data.result).length === 0 ? (
          <div>No Todos Created yet</div>
        ) : (
          <List data={this.props.data.result} />
        )}
      </div>
    );
  }
}

export default compose(
  withConfig,
  withFetch(({ config }) => ({
    options: {
      endpoint: config.api.endpoints.todos
    },
    hasOptions: true
  }))
)(App);
