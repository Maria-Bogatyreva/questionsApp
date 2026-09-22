import {createContext, useEffect, useMemo, useRef, useState} from "react";
import useDebounce from "../hooks/useDebounce.jsx";
import {api} from "../api.js";
import axios from "axios";
import {useSearchParams} from "react-router-dom";

export const QuestionContext = createContext(null);

const specializationUrl = "/specializations?limit=15"; //Специализация
const skillsUrl = "/skills?limit=10"; // Навыки
const questionsUrl = "/questions/public-questions";

const rateData = [
  {
    id: 1,
    title: '1'
  },
  {
    id: 2,
    title: '2'
  },
  {
    id: 3,
    title: '3'
  },
  {
    id: 4,
    title: '4'
  },
  {
    id: 5,
    title: '5'
  }
]
const complexityData = [
  {
    id: 0,
    values: [1, 2, 3],
    title: '1-3'
  },
  {
    id: 1,
    values: [4, 5, 6],
    title: '4-6'
  },
  {

    id: 2,
    values: [7, 8],
    title: '7-8'
  },
  {
    id: 3,
    values: [9, 10],
    title: '9-10'
  }
]
const statusData = [
  {
    id: 0,
    title: 'Изученные'
  },
  {
    id: 1,
    title: 'Не изученные'
  },
  {
    id: 2,
    title: 'Все'
  }
]

export default function QuestionProvider({children}) {
  const [params, setSearchParams] = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState(() => params.get('search') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function getArrayParam(params, paramName) {
    const value = params.get(paramName);
    if (value === null) {
      return [];
    }
    return value.split(',').map(Number);
  }

  const page = params.get('page') || '1';
  const selectedSpecialization = params.get('specializationId') || '';
  const selectedSkills = useMemo(() => getArrayParam(params, 'skills'), [params]);
  const selectedRate = useMemo(() => getArrayParam(params, 'rate'), [params]);
  const selectedComplexity = useMemo(() => getArrayParam(params, 'complexity'), [params]);

  const limit = 10
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const prevSearchQuery = useRef(debouncedSearchQuery);

  // Фильтры
  useEffect(() => {
    async function fetchFiltersData() {
      try {
        const specializationsPromise = api.get(specializationUrl);
        const skillsPromise = api.get(skillsUrl);


        const [{data: specializations}, {data: skills}] =
          await Promise.all([
            specializationsPromise,
            skillsPromise
          ])

        setSpecializations(specializations.data)
        setSkills(skills.data)


      } catch (error) {
        console.log(error.message)

      } finally {
        // console.log('загрузка завершена')
      }
    }

    fetchFiltersData()
  }, []);

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

  function handleNextPage(e) {
    e.preventDefault();
    setSearchParams(prev => {
      prev.set('page', Number(page) + 1);
      return prev;
    })
  }

  function handlePrevPage(e) {
    e.preventDefault();
    setSearchParams(prev => {
      prev.set('page', Number(page) - 1);
      return prev;
    })
  }

  function handlePageClick(e, pageNumber) {
    e.preventDefault();
    setSearchParams(prev => {
      prev.set('page', Number(pageNumber));
      return prev;
    })
  }

  function handleFilterChange(newValue, paramName, multiple) {
    if (!multiple) {
      setSearchParams(prev => {
        prev.set('page', 1);
        if (newValue !== Number(selectedSpecialization)) {
          prev.set('specializationId', newValue)
        } else {
          prev.delete('specializationId')
        }
        return prev;
      })
    } else {
      const current = params.get(paramName)?.split(',').map(Number) ?? [];
      const updated = current.includes(newValue)
        ? current.filter(v => v !== newValue)
        : [...current, newValue];

      setSearchParams(prev => {
        prev.set('page', 1);
        updated.length ? prev.set(paramName, updated.join(',')) : prev.delete(paramName);
        return prev;
      });
    }
  }

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  return (
    <QuestionContext.Provider value={{
      questions,
      page,
      totalPages,
      handleNextPage,
      handlePrevPage,
      handlePageClick,
      specializations,
      selectedSpecialization,
      skills,
      selectedSkills,
      statusData,
      rateData,
      selectedRate,
      complexityData,
      selectedComplexity,
      handleFilterChange,
      searchQuery,
      handleSearch,
      isLoading,
      error
    }}>
      {children}
    </QuestionContext.Provider>
  )
}