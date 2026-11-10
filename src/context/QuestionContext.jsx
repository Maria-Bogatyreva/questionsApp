import {createContext, useEffect, useState} from "react";
import {api} from "../api.js";
import axios from "axios";
import {complexityData} from "../constants/questionFilters.js";
import useQuestionParams from "../hooks/useQuestionParams.js";
import useQuestionSearch from "../hooks/useQuestionSearch.js";

export const QuestionContext = createContext(null);

const questionsUrl = "/questions/public-questions";

export default function QuestionProvider({children}) {
  const {
    page,
    selectedSpecialization,
    selectedSkills,
    selectedRate,
    selectedComplexity,
  } = useQuestionParams();

  const {
    searchQuery,
    handleSearch,
    debouncedSearchQuery
  } = useQuestionSearch()

  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 10


  // Вопросы
  useEffect(() => {
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
  }, [page, selectedSpecialization, selectedSkills, selectedComplexity, selectedRate,debouncedSearchQuery])

  return (
    <QuestionContext.Provider value={{
      searchQuery,
      handleSearch,
      questions,
      totalPages,
      isLoading,
      error
    }}>
      {children}
    </QuestionContext.Provider>
  )
}