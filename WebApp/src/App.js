// Basic
import { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';

// Router
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// Pages
import Main from "./pages/main";

// Utils
import history from "./utils/history";

// Cookies
import { CookiesProvider } from 'react-cookie';

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Provider store={store}>
          <Router history={history}>
            <Routes>
              <Route path="/:address" element={<Main/>} />
              <Route path="*" element={<Main/>} />
            </Routes>
          </Router>
        </Provider>
      </CookiesProvider>
    );
  }
}

export default App;
