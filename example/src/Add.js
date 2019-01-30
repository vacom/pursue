import React from "react";
import { compose, withConfig, withMutation, withFetch } from "pursue";

class Add extends React.Component {
  state = {
    text: ""
  };
  onAddTodo = async () => {
    const { localFetch, config, post } = this.props;
    const getTodos = await localFetch(config.api.endpoints.todos);
    const todos = [
      {
        name: this.state.text,
        done: false
      },
      ...getTodos.data.result
    ];
    console.log("string = ", JSON.stringify(todos));

    const add = await post(JSON.stringify(todos));
    if (add.data.ok) {
      this.setState({ text: "" });
      this.props.refresh();
      console.log("guardou");

      console.log("send = ", add);
    }
  };
  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="todo name..."
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
        />
        <button onClick={this.onAddTodo}>Add</button>
        <button onClick={() => this.props.refresh()}>Refresh</button>
      </div>
    );
  }
}

export default compose(
  withConfig,
  withFetch(props => ({
    hasLocalFetch: true,
    hasOptions: false
  })),
  withMutation(props => ({
    options: {
      endpoint: props.config.api.endpoints.add,
      method: "POST" //delete, put...
    }
  }))
)(Add);
