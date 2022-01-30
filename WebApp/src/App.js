// Basic
import { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';

// Router
import {
  Router,
  Route,
  Switch
} from "react-router-dom";

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// Pages
import Main from "./pages/main";
import history from "./utils/history";

// Cookies
import { CookiesProvider } from 'react-cookie';


class App extends Component {

  render() {
    return (
      <CookiesProvider>
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/:address" component={Main} />
            <Route path="*" component={Main} />
          </Switch>
        </Router>
      </Provider>
      </CookiesProvider>
    );
  }
}

export default App;
