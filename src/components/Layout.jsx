import Header from "./Header/Header.jsx";
import QuestionProvider from "../context/QuestionContext.jsx";
import Footer from "./Footer/Footer.jsx";
import {Outlet} from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <QuestionProvider>
        <Outlet />
      </QuestionProvider>
      <Footer />
    </>
  )
}
