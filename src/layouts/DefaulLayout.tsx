import { Outlet } from "react-router-dom";
import { Menu } from "../components/Menu";
import { Header } from "../components/Header";

export function DefaultLayout() {
  return (
    <div className="flex min-h-screen">
      <Menu />

      <div className="flex-1">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
