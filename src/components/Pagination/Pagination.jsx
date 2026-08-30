import {useContext} from "react";
import {QuestionContext} from "../../context/QuestionContext.jsx";
import './pagination.scss'

export default function Pagination() {
  const {currentPage, handleNextPage, handlePrevPage, handlePageClick, totalPages} = useContext(QuestionContext);

  if (!totalPages) return null;

  function paginationTemplate(
    currentPage,
    totalPages,
    siblingCount = 1,
    edgePageCount = 6
  ) {
    if (totalPages <= edgePageCount + 1) {
      return Array.from(
        {length: totalPages},
        (_, index) => index + 1
      );
    }

    const leftBound = Math.max(
      currentPage - siblingCount,
      1
    );

    const rightBound = Math.min(
      currentPage + siblingCount,
      totalPages
    );

    const isNearStart =
      currentPage <= edgePageCount - siblingCount;

    const isNearEnd =
      currentPage >=
      totalPages - (edgePageCount - siblingCount) + 1;

    const finalLeftBound = isNearEnd
      ? totalPages - edgePageCount + 1
      : isNearStart
        ? 1
        : leftBound;

    const finalRightBound = isNearEnd
      ? totalPages
      : isNearStart
        ? edgePageCount
        : rightBound;

    const showLeftDots = finalLeftBound > 2;
    const showRightDots = finalRightBound < totalPages - 1;

    const result = [1];

    if (showLeftDots) {
      result.push("...");
    } else {
      for (let page = 2; page < finalLeftBound; page++) {
        result.push(page);
      }
    }

    for (
      let page = finalLeftBound;
      page <= finalRightBound;
      page++
    ) {
      if (page !== 1 && page !== totalPages) {
        result.push(page);
      }
    }

    if (showRightDots) {
      result.push("...");
    } else {
      for (
        let page = finalRightBound + 1;
        page < totalPages;
        page++
      ) {
        result.push(page);
      }
    }

    result.push(totalPages);

    return result;
  }

  const pages = paginationTemplate(currentPage, totalPages);

  return (
    <div className="pagination">
      {currentPage > 1 &&
        <a href="#!" onClick={handlePrevPage} className="pagination__btn">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M12.7759 8.55806C13.02 8.80214 13.02 9.19786 12.7759 9.44194L8.84287 13.375H20.6673C21.0125 13.375 21.2923 13.6548 21.2923 14C21.2923 14.3452 21.0125 14.625 20.6673 14.625H8.84287L12.7759 18.5581C13.02 18.8021 13.02 19.1979 12.7759 19.4419C12.5318 19.686 12.1361 19.686 11.892 19.4419L6.89204 14.4419C6.64796 14.1979 6.64796 13.8021 6.89204 13.5581L11.892 8.55806C12.1361 8.31398 12.5318 8.31398 12.7759 8.55806Z"
                  fill="currentColor"/>
          </svg>
        </a>
      }

      <div className="pagination__list">
        {pages.map((page, index) =>
          page === '...' ? (
            <span key={`dots-${index}`}>...</span>
          ) : (
            <a href="#!"
              key={page}
              onClick={() => handlePageClick(page)}
              className={`pagination__link trs ${page === currentPage ? '_active' : ''}`}
            >
              {page}
            </a>
          )
        )}

      </div>
      {
        currentPage < totalPages &&
        <a href="#!" onClick={handleNextPage} className="pagination__btn">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="-0.5" width="27" height="27" rx="13.5"
                  transform="matrix(1 1.74846e-07 1.74846e-07 -1 8.74228e-08 27)" stroke="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M15.2254 19.4419C15.4695 19.686 15.8652 19.686 16.1093 19.4419L21.1093 14.4419C21.3533 14.1979 21.3533 13.8021 21.1093 13.5581L16.1093 8.55806C15.8652 8.31398 15.4695 8.31398 15.2254 8.55806C14.9813 8.80214 14.9813 9.19787 15.2254 9.44194L19.1584 13.375L7.33399 13.375C6.98881 13.375 6.70899 13.6548 6.70899 14C6.70899 14.3452 6.98881 14.625 7.33399 14.625L19.1584 14.625L15.2254 18.5581C14.9813 18.8021 14.9813 19.1979 15.2254 19.4419Z"
                  fill="currentColor"/>
          </svg>
        </a>
      }
    </div>
  )
}
