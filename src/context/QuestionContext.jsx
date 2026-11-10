import {createContext, useEffect, useRef, useState} from "react";
import useDebounce from "../hooks/useDebounce.jsx";
import {api} from "../api.js";
import axios from "axios";
import {complexityData} from "../constants/questionFilters.js";
import useQuestionParams from "../hooks/useQuestionParams.js";

export const QuestionContext = createContext(null);

const questionsUrl = "/questions/public-questions";

export default function QuestionProvider({children}) {
  const {
    params,
    setSearchParams,
    page,
    selectedSpecialization,
    selectedSkills,
    selectedRate,
    selectedComplexity,
  } = useQuestionParams();

  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [searchQuery, setSearchQuery] = useState(() => params.get('search') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 10
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const prevSearchQuery = useRef(debouncedSearchQuery);

  // Вопросы
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

    const controller = new AbortController();
    const {signal} = controller;

    async function fetchQuestions() {
      const searchParams = new URLSearchParams({limit: limit, page: page})

      if (selectedSpecialization) {
        searchParams.set('specializationId', selectedSpecialization)
      }

      if (selectedSkills.length) {
        searchParams.set('skills', selectedSkills.join(','))
      }

      if (selectedRate.length) {
        searchParams.set('rate', selectedRate.join(','))
      }

      if (selectedComplexity.length) {
        const convertComplexityParams =
          complexityData.filter(i => selectedComplexity.includes(i.id))
            .reduce((acc, element) => {
              acc.push(element.values);
              return acc
            }, [])
            .flat()
        searchParams.set('complexity', convertComplexityParams.join(','))
      }

      if (debouncedSearchQuery.trim()) {
        searchParams.set('titleOrDescription', debouncedSearchQuery.trim())
      }

      try {
        setIsLoading(true);
        setError(null);
        setQuestions([]);
        const {data: result} = await api.get(`${questionsUrl}?${searchParams}`, {signal});

        setQuestions(result.data)
        setTotalPages(Math.ceil(result.total / limit))

      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error.message);
          setError(error.message);
          setQuestions([]);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchQuestions();

    return () => {
      controller.abort();
    }
  }, [page, selectedSpecialization, selectedSkills, selectedComplexity, selectedRate, debouncedSearchQuery])

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  return (
    <QuestionContext.Provider value={{
      questions,
      totalPages,
      searchQuery,
      handleSearch,
      isLoading,
      error
    }}>
      {children}
    </QuestionContext.Provider>
  )
}