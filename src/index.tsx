// import * as React from "react";
import * as React from 'react'
import * as ReactDOM from "react-dom";
import App from "./App.tsx"
// import { Provider } from "react-redux";
// import { BrowserRouter } from "react-router-dom";
// import configureStore from "./store/configureStore";

// const configuredStore = configureStore();
// const app = (
//   <Provider store={configuredStore}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </Provider>
// );
const app = <App />
ReactDOM.render(app,document.getElementById("root"))