import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/main-layout";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import { loadState } from "./store/store";

function App() {
  const admintoken = loadState("admin");
  return (
    <Routes>
      <Route index element={<MainLayout />} />
      <Route path="/users" element={<Users />}>
        <Route path=":userId" element={<UserDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
