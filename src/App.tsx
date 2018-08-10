import * as React from "react";
import { hot } from "react-hot-loader";
// import FeedsContainer from "./containers/FeedsContainer.tsx";
// import FeedContainer from "./containers/FeedContainer";
// import { Route } from "react-router-dom";
// import { Switch } from "react-router-dom";
class App extends React.Component<any, {}> {
  render() {
    return (
      <div >
          {/* <Switch>
            <Route exact path={"/"} component={FeedsContainer} />
            <Route path={`/feed/:feedId`} component={FeedContainer} />
          </Switch> */}
          Hello world
      </div>
    );
  }
}
export default hot(module)(App);