// Basic
import { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';

// Router
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

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
          <Router history={history}>
            <Routes>
              <Route path="/:address" element={<Main/>} />
              <Route path="*" element={<Main/>} />
            </Routes>
          </Router>
      </CookiesProvider>
    );
  }
}

export default App;
