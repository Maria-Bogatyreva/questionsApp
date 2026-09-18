import {createContext, useEffect, useRef, useState} from "react";
import useDebounce from "../hooks/useDebounce.jsx";
import axios from "axios";

export const QuestionContext = createContext(null);


const api = axios.create({
  baseURL: 'https://api.yeatwork.ru/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})
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
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRate, setSelectedRate] = useState([]);
  const [selectedComplexity, setSelectedComplexity] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 10
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const prevSearchQuery  = useRef(debouncedSearchQuery);

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
  useEffect(()=> {
    const isSearchChanged =
      prevSearchQuery.current !== debouncedSearchQuery;

    if (isSearchChanged) {
      prevSearchQuery.current = debouncedSearchQuery;
      setCurrentPage(1);
    }

    const controller = new AbortController();
    const { signal } = controller;

    async function fetchQuestions() {
      const searchParams = new URLSearchParams({limit: limit, page: currentPage})

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
                          return acc}, [])
                        .flat()
        searchParams.set('complexity', convertComplexityParams.join(','))
      }

      if(debouncedSearchQuery.trim()) {
        searchParams.set('titleOrDescription', debouncedSearchQuery.trim())
      }

      try{
        setIsLoading(true);
        setError(null);
        setQuestions([]);
        const {data:result} = await api.get(`${questionsUrl}?${searchParams}`, {signal});

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
  }, [currentPage, selectedSpecialization, selectedSkills, selectedComplexity, selectedRate, debouncedSearchQuery])

  function handleNextPage(e) {
    e.preventDefault();
    setCurrentPage(prev => prev + 1)
  }

  function handlePrevPage(e) {
    e.preventDefault();
    setCurrentPage(prev => prev - 1)
  }

  function handlePageClick (e, pageNumber) {
    e.preventDefault();
    setCurrentPage(pageNumber)
  }

  function handleFilterChange(newValue, setter, multiple) {
    if (!multiple) {
      setter(prevState => (prevState === newValue ? null : newValue));
    } else {
      setter(prevState => {
        if (prevState.includes(newValue)) {
          return prevState.filter(el => el !== newValue);
        } else {
          return [...prevState, newValue];
        }
      });
    }
    setCurrentPage(1)
  }

  function handleSearch(e) {
    setSearchQuery(e.target.value)
  }

  return (
    <QuestionContext.Provider value={{
      questions,
      currentPage,
      setCurrentPage,
      totalPages,
      handleNextPage,
      handlePrevPage,
      handlePageClick,
      specializations,
      selectedSpecialization,
      setSelectedSpecialization,
      skills,
      selectedSkills,
      setSelectedSkills,
      statusData,
      rateData,
      selectedRate,
      setSelectedRate,
      complexityData,
      selectedComplexity,
      setSelectedComplexity,
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