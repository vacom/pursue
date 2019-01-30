import React from "react";

class List extends React.Component {
  render() {
    return (
      <ul>
        {this.props.data.map((item, index) => {
          return (
            <li
              key={index}
              style={{ textDecoration: item.done ? "line-through" : "none" }}
            >
              {item.name} <button>Done</button>
              <button>X</button>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default List;
