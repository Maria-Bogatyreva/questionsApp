import './main.scss'
import Questions from "../Questions/Questions.jsx";
import Filters from "../Filters/Filters.jsx";
import QuestionProvider from "../../context/QuestionContext.jsx";
import Pagination from "../Pagination/Pagination.jsx";
export default function Main() {
  return (
    <>
      <main className="main">
        <div className="container main__inner">
          <QuestionProvider>
            <div className="main__questions">
              <Questions />
              <Pagination />
            </div>
            <div className="main__filters">
              <Filters />
            </div>

          </QuestionProvider>
        </div>
      </main>
    </>
  )
}
