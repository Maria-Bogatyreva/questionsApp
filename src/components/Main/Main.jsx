import './main.scss'
import Questions from "../Questions/Questions.jsx";
import Filters from "../Filters/Filters.jsx";
import QuestionProvider from "../../context/QuestionCotext.jsx";
export default function Main() {
  return (
    <>
      <main className="main">
        <div className="container main__inner">
          <QuestionProvider>
            <Questions />
            <Filters />
          </QuestionProvider>
        </div>
      </main>
    </>
  )
}
