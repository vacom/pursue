# Pursue

Inspired by the definitions of GraphQL, such as Mutation, this library offers a simple HTTP client based on HOCs. Provides a way to reduce boilerplate when working with request notably with an API in REST. Simple and easy to integrate with just one configuration, you can have almost the same capabilities as a "GraphQL API", for example: injection of the endpoint data in the props, loading state and finally refetch function. This library has two main HOCs, withFetch and withMutation and others as utility form. Below is explained in more detail.

![Pursue](http://i65.tinypic.com/2u6idja.jpg)

## installation

Just install the dependency and start using

```javascript
npm i pursue or yarn add pursue
```

### How to import

After installing the dependency, just import the components you need

```javascript
import { withFetch, withConfig, compose } from "pursue";
```

### Configuration

To get started, you first need to configure your API with the ConfigProvider that is provided in the library

It is necessary to pass an object with the necessary configurations, such as: mode (prod or dev), api with url and loginUrl (redirects with gets errors codes from the server), these are the obligatory, inside the endpoints are flexible since are yours endpoints. This object serves as an example.

```javascript
import { ConfigProvider } from "pursue";

const config = {
  mode: "dev",
  api: {
    url: "https://dog.ceo/api/breeds",
    loginUrl: "https://dog.ceo",
    headers: {
      ...e.g Authorization etc
    }
    endpoints: {
      list: "/list/all",
      random: "/image/random",
      breed: (name = "hound") => `/${name}/images`,
      sub: (name = "hound") => `/${name}/list`
    }
  }
};

ReactDOM.render(
  <ConfigProvider config={config}>
    <App />
  </ConfigProvider>,
  document.getElementById("root")
);
```

### **Important Note**

In order for the HOCs to function as they should, you have to ensure that the set-up settings are passed on all the components where you use these HOCs. For this you need to use withConfig, this causes the previous configuration to pass to the component's props.

```javascript
import { withConfig } from "pursue";

withConfig(Component);
```

To use more than one HOC at the same time, use the compose that is included in the library

```javascript
import { compose, withConfig } from "pursue";

export default compose(
  withConfig,
  ...more hocs
)(App);
```

## Handle fetch

To call the server data is done with withFetch. Below are several ways to use this HOC

### Default

As you can see, it is simple to request the server to collect data. This is the default behavior, it must be said that you have options, since there are ways to use this HOC without options. As you can see also, you have access to the props in this HOC, in this sense you can use the endpoints inserted in the configuration file.

```javascript
import { withFetch } from "pursue";

withFetch(props => ({
  options: {
    endpoint: props.config.api.endpoints.random
  },
  hasOptions: true
}));
```

After the component render is returned the data through the props of the component and other data as loading state.

```javascript
this.props.data; //data from the server (prop: data is default name);
this.props.loading; //loading state when fetching data (true or false);
this.props.network; // state of the request;
this.props.refetch(); //refetch function to call the server again;
```

### Fetch with custom name

If you do not want the prop to have the default "data" you can always change the name in the HOC options

```javascript
import { withFetch } from "pursue";

withFetch(props => ({
  options: {
    name: "randomData",
    endpoint: props.config.api.endpoints.random
  },
  hasOptions: true
}));

//then
this.props.randomData; //data from the server
```

### Local Fetch

Sometimes we do not want to inject the data through the component's props but then use a future function or even a button action (onClick). For this we can use withFetch with local, this is so that it is possible to make requests after the component render.

```javascript
import { withFetch } from "pursue";

withFetch(() => ({
  hasOptions: false,
  hasLocalFetch: true
}));

//using as a promise
this.props
  .localFetch(endpoint)
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });

//using as async await
async function Call() {
  const res = await this.props.localFetch(endpoint);
  console.log(res);
}
```

### Fetch with name, props and local fetch

It is also possible to use all the options provided by the HOC, such as local fetch, injection of props etc.

```javascript
import { withFetch } from "pursue";

withFetch(props => ({
  options: {
    name: "datasource",
    endpoint: props.config.api.endpoints.list
  },
  hasLocalFetch: true,
  hasOptions: true
}));
```

### Fetch with params

As the hoc is connecting to the component there is access to all the props that come with it, this allows a great dynamics in the requests to your endpoints, you can create dynamic endpoints to collect parameters, as shown in the example below

```javascript
import { withFetch } from "pursue";

withFetch(({ config, name }) => ({
  options: {
    endpoint: config.api.endpoints.breed(name)
  },
  hasOptions: true
}));
```

### Using multiple fetch

You can use more than one hoc to fetch different endpoints, you just need to give different names to each fetch so that the props are correct.

```javascript
import { compose, withConfig, withFetch } from "pursue";

export default compose(
  withConfig,
  withFetch(props => ({
    options: {
      name: "randomData",
      endpoint: props.config.api.endpoints.random
    },
    hasOptions: true
  })),
  withFetch(({ config, name }) => ({
    options: {
      name: "breeds",
      endpoint: config.api.endpoints.breed(name)
    },
    hasOptions: true
  })),
  withFetch(() => ({
    hasOptions: false,
    hasLocalFetch: true
  }))
)(App);
```

## Handle Mutation

To modify the data on the server it is necessary to use withMutation. A mutation can be a post, a delete, an update something that modifies the data in some way

### Default

As you can as fetch, it is also simple to make a request to modify data on the server, so after rendering the component you have access through the prop the post (default name) to send the data as your endpoint parameter

```javascript
import { withMutation } from "pursue";

withMutation(props => ({
  options: {
    endpoint: props.config.api.endpoints.create,
    method: "post" //delete, put...
  }
}));

//Then use async or a promise
//use post prop to pass the data to your post endpoint
this.props.post(data);
```

### Mutation with name

If you want to have control of the prop or even have more than one mutation in your component you can change the name in the options

```javascript
import { withMutation } from "pursue";

withMutation(({ config, id }) => ({
  options: {
    name: "deleteDog",
    endpoint: config.api.endpoints.delete(id),
    method: "delete" //put, post...
  }
}));

//Then use async or a promise
this.props.deleteDog(data);
```

### With local mutation

Sometimes we do not want to inject the mutation through the component's props but then use a future function or even a button action (onClick). For this we can use withMutation with local, this is so that it is possible to make requests after the component render.

```javascript
import { withMutation } from "pursue";

withMutation(() => ({
  options: {
    name: "size",
    method: "put"
  },
  hasLocalMutation: true
}));

//using as a promise
this.props
  .localMutation(endpoint, { UIHeight, UIWidth })
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });

//using as async await
async function Call() {
  const res = await this.props.localMutation(endpoint, { UIHeight, UIWidth });
  console.log(res);
}
```

### Mutation with params

As the hoc is connecting to the component there is access to all the props that come with it, this allows a great dynamics in the requests to your endpoints, you can create dynamic endpoints to collect parameters, as shown in the example below

```javascript
import { withMutation } from "pursue";

withMutation(({ config, id }) => ({
  options: {
    name: "updateDog",
    endpoint: config.api.endpoints.update(id),
    method: "put" //put, post...
  }
}));

//Then use async or a promise
this.props.updateDog(data);
```

### Using multiple mutation

You can use more than one hoc to modify different endpoints, you just need to give different names to each mutation so that the props are correct.

```javascript
import { compose, withConfig, withMutation } from "pursue";

export default compose(
  withConfig,
  withMutation(props => ({
    options: {
      endpoint: props.config.api.endpoints.create,
      method: "post" //delete, put...
    }
  })),
  withMutation(({ config, id }) => ({
    options: {
      name: "deleteDog",
      endpoint: config.api.endpoints.delete(id),
      method: "delete" //put, post...
    }
  })),
  withMutation(() => ({
    options: {
      name: "size",
      method: "put"
    },
    hasLocalMutation: true
  }))
)(App);
```

## Fetch and Mutation

To make things more interesting, everything that was mentioned before can be used at the same time, that is, a component can have several mutations or several fetchs you just have to use the compose to group everything together.

```javascript
import { compose, withConfig, withFetch, withMutation } from "pursue";

export default compose(
  withConfig,
  withFetch(props => ({
    options: {
      name: "datasource",
      endpoint: props.config.api.endpoints.list
    },
    hasLocalFetch: true,
    hasOptions: true
  })),
  withMutation(props => ({
    options: {
      endpoint: props.config.api.endpoints.create,
      method: "post" //delete, put...
    }
  }))
)(App);
```

## Utilities

Below are some utilities that may be useful to help compose HOCs

### Compose

Useful for composing multiple functions at once, use composing to compose multiple hocs at the same time.

```javascript
import { compose } from "pursue";

compose(...(hocs / functions))(Component);
```

### withPolling

If you need to listen for changes on the server, use the withPolling to have it done within a interval provided by you. A refetch prop e provided by another mutation so this refetch is calling a mutation provided by you in the component.

```javascript
import { withPolling } from "pursue";

withPolling(({ refetch, config: { poll } }) => ({
  options: {
    interval: poll.interval,
    update: refetch,
    enable: poll.enable
  }
}));
//then
//componentWillUnmount() - Clears the polling time
clearTimeout(this.props.timeoutPoll);
```

### withProps

If you need to add or custom props, use withProps to provide such capabilities to the component.

```javascript
import { withProps } from "pursue";

withProps({ sample: "Sample Prop" })(Component);
```
