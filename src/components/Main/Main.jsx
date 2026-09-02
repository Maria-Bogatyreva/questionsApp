import './main.scss'
import Questions from "../Questions/Questions.jsx";
import Filters from "../Filters/Filters.jsx";
import {QuestionContext} from "../../context/QuestionContext.jsx";
import Pagination from "../Pagination/Pagination.jsx";
import {useContext} from "react";
import Skeleton from "../Skeleton/Skeleton.jsx";

export default function Main() {
  const {isLoading} = useContext(QuestionContext);

  return (
      <main className="main">
        <div className="container main__inner">
            <div className="main__questions">
              {isLoading ?
                <Skeleton />
                :
                <>
                  <Questions />
                  <Pagination />
                </>
              }
            </div>
            <div className="main__filters">
              <Filters />
            </div>
        </div>
      </main>
  )
}
