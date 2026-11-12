import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {complexityData} from "../constants/questionFilters.ts";
import type {Skill, Specialization, PaginatedResponse, Question, QuestionItem, QuestionsQueryParams} from "./questionsApi.types.ts";

export const apiSlice = createApi({
  reducerPath: 'questionsApi',
  baseQuery: fetchBaseQuery({baseUrl:'https://api.yeatwork.ru/', timeout: 5000}),
  endpoints: (builder) => ({
    getSpecializations: builder.query<Specialization[], void>({
      query: () => 'specializations?limit=15', // эндпоинт для получения ВСЕХ специализаций
      transformResponse: (response: PaginatedResponse<Specialization>) => response.data
    }),
    getSkills: builder.query<Skill[], void>({
      query: () => 'skills?limit=10', // эндпоинт для получения ВСЕХ навыков
      transformResponse: (response: PaginatedResponse<Skill>) => response.data
    }),
    getQuestions: builder.query<PaginatedResponse<QuestionItem>, QuestionsQueryParams>({
      query: (params) =>  {
        const {
          page,
          limit,
          appliedSearch,
          selectedSpecialization,
          selectedSkills,
          selectedRate,
          selectedComplexity
        } = params;
        const searchParams = new URLSearchParams({limit: limit.toString(), page: page})

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
              .reduce((acc: number[][], element) => {
                acc.push(element.values);
                return acc
              }, [])
              .flat()
          searchParams.set('complexity', convertComplexityParams.join(','))
        }

        if (appliedSearch.trim()) {
          searchParams.set('titleOrDescription', appliedSearch.trim())
        }
        return {
          url: '/questions/public-questions',
          params: searchParams
        }
      }

    }),
    getQuestion: builder.query<Question, string>({
      query: (id) => `/questions/public-questions/${id}`, // эндпоинт для получения одного вопроса
    }),
  })
})

// экспорт хуков для использования в компонентах
export const {useGetSpecializationsQuery, useGetSkillsQuery, useGetQuestionsQuery, useGetQuestionQuery} = apiSlice;