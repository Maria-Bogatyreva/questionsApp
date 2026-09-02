import {createContext, useEffect, useRef, useState} from "react";
import useDebounce from "../hooks/useDebounce.jsx";

export const QuestionContext = createContext(null);

const specializationUrl = "https://api.yeatwork.ru/specializations?limit=15"; //Специализация
const skillsUrl = "https://api.yeatwork.ru/skills?limit=10"; // Навыки
const questionsUrl = "https://api.yeatwork.ru/questions/public-questions";

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

  const limit = 10
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const prevSearchQuery  = useRef(debouncedSearchQuery);

  // Фильтры
  useEffect(() => {
    async function fetchFiltersData() {
      try {
        const specializationsPromise = fetch(specializationUrl);
        const skillsPromise = fetch(skillsUrl);

        const [specializationsResponse, skillsResponse] =
          await Promise.all([
            specializationsPromise,
            skillsPromise
          ])

        if (!specializationsResponse.ok) {
          throw new Error(`Ошибка, ${specializationsResponse.status}`)
        }

        if (!skillsResponse.ok) {
          throw new Error(`Ошибка, ${skillsResponse.status}`)
        }

        const [specializationsAnswer, skillsAnswer] =
          await Promise.all([
            specializationsResponse.json(),
            skillsResponse.json()
          ])

        setSpecializations(specializationsAnswer.data)
        setSkills(skillsAnswer.data)


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
    if (prevSearchQuery.current !== debouncedSearchQuery) {
      prevSearchQuery.current = debouncedSearchQuery;
      setCurrentPage(1)
      return;
    }

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
        const response = await fetch(`${questionsUrl}?${searchParams}`);
        if (!response.ok) {
          throw new Error(`Ошибка ${response.status}`)
        }

        const result = await response.json();
        setQuestions(result.data)
        setTotalPages(Math.ceil(result.total / limit))

      } catch (error) {
        console.log(error.message)
      } finally {
        console.log('загрузка завершена')
      }
    }

    fetchQuestions();
  }, [currentPage, selectedSpecialization, selectedSkills, selectedComplexity, selectedRate, debouncedSearchQuery])

  function handleNextPage() {
    setCurrentPage(prev => prev + 1)
  }

  function handlePrevPage() {
    setCurrentPage(prev => prev - 1)
  }

  function handlePageClick (pageNumber) {
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
      handleSearch
    }}>
      {children}
    </QuestionContext.Provider>
  )
}