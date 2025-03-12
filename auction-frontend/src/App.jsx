import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ItemList from "./pages/admin/ItemList";
import AddItem from "./pages/admin/AddItem";
import EditItem from "./pages/admin/EditItem";
import ItemDetail from "./pages/admin/ItemDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ItemList />} />
          <Route path="add" element={<AddItem />} />
          <Route path="edit/:id" element={<EditItem />} />
          <Route path="detail/:id" element={<ItemDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
