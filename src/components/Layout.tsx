import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";
import {Outlet} from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
        <Outlet />
      <Footer />
    </>
  )
}
