import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/regular/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ItemList from "./pages/admin/ItemList";
import AddItem from "./pages/admin/AddItem";
import EditItem from "./pages/admin/EditItem";
import ItemDetail from "./pages/admin/ItemDetail";
import Unauthorized from "./pages/Unauthorized";
import UserLayout from "./pages/regular/UserLayout";
import UserItemDetail from "./pages/regular/UserItemDetail";
import AutoBidConfig from "./pages/regular/AutoBidding";
import NotificationsPage from "./pages/regular/NotificationsPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route element={<ProtectedRoute allowedRoles={["regular"]} />}>
        <Route path="/home" element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/auto-bid-config" element={<AutoBidConfig />} />
        <Route path="items/:id" element={<UserItemDetail />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ItemList />} />
          <Route path="add" element={<AddItem />} />
          <Route path="edit/:id" element={<EditItem />} />
          <Route path="detail/:id" element={<ItemDetail />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
