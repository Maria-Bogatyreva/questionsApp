import {createContext, useEffect, useState} from "react";

export const QuestionContext = createContext(null);

const specializationUrl = "https://api.yeatwork.ru/specializations?limit=15"; //Специализация
const skillsUrl = "https://api.yeatwork.ru/skills?limit=10"; // Навыки
const questionsUrl = "https://api.yeatwork.ru/questions/public-questions?";

const rating = [
  {
    id: 0,
    title: '1'
  },
  {
    id: 1,
    title: '2'
  },
  {
    id: 2,
    title: '3'
  },
  {
    id: 3,
    title: '4'
  },
  {
    id: 4,
    title: '5'
  }
]
const complexity = [
  {
    id: 0,
    title: '1-3'
  },
  {
    id: 1,
    title: '4-6'
  },
  {
    id: 2,
    title: '7-8'
  },
  {
    id: 3,
    title: '9-10'
  }
]
const status = [
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
  const [specializations, setSpecialization] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function fetchData() {
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

        setSpecialization(specializationsAnswer.data)
        setSkills(skillsAnswer.data)


      } catch (error) {
        console.log(error.message)

      } finally {
        console.log('загрузка завершена')
      }
    }

    fetchData()
  }, []);
  return (
    <QuestionContext.Provider value={{specializations, skills, status, rating, complexity}}>
      {children}
    </QuestionContext.Provider>
  )
}