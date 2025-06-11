import logo from './logo.svg';
import { BrowserRouter as Router } from "react-router-dom";
import Routing from "./utils/routing";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";

const store = createStore({
  authName: "_auth",
  authType: "localstorage",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",

  refresh: {
    endpoint: "http://127.0.0.1:8000/api/v1/users/user/token/refresh/",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: (refreshToken) => JSON.stringify({ refresh: refreshToken }),
    tokenExpireTime: 5, // Time before token expiration (in minutes) to trigger refresh
  },
});

function App() {
  console.log(store);
  return (
    <AuthProvider store={store}>
      <Router>
        <Routing />
      </Router>
    </AuthProvider>
  );
}

export default App;
