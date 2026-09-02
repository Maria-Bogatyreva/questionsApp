import Header from "./components/Header/Header.jsx";
import Main from "./components/Main/Main.jsx";
import Footer from "./components/Footer/Footer.jsx";
import QuestionProvider from "./context/QuestionContext.jsx";

function App() {

  return (
    <>
      <Header />
      <QuestionProvider>
        <Main />
      </QuestionProvider>
      <Footer />
    </>
  )
}

export default App
