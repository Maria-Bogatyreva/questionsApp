import useQuestionParams from "./useQuestionParams.js";
import {useEffect, useRef, useState} from "react";
import useDebounce from "./useDebounce.jsx";

export default function useQuestionSearch() {
  const {params, setSearchParams} = useQuestionParams();
  const [searchQuery, setSearchQuery] = useState(() => params.get('search') || '');

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const prevSearchQuery = useRef(debouncedSearchQuery);

  useEffect(() => {
    const isSearchChanged =
      prevSearchQuery.current !== debouncedSearchQuery;

    if (isSearchChanged) {
      prevSearchQuery.current = debouncedSearchQuery;
      setSearchParams(prev => {
        prev.set('page', 1);

        if (debouncedSearchQuery.trim().length) {
          prev.set('search', debouncedSearchQuery);
        } else {
          prev.delete('search');
        }

        return prev;
      })
    }
  }, [setSearchParams, debouncedSearchQuery])

  return {
    searchQuery,
    handleSearch
  }
}
