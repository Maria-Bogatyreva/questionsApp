import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: 'questionsApi',
  baseQuery: fetchBaseQuery({baseUrl:'https://api.yeatwork.ru/', timeout: 5000}),
  endpoints: (builder) => ({
    getSpecializations: builder.query({
      query: () => 'specializations?limit=15', // эндпоинт для получения ВСЕХ специализаций
      transformResponse: response => response.data
    }),
    getSkills: builder.query({
      query: () => 'skills?limit=10', // эндпоинт для получения ВСЕХ навыков
      transformResponse: response => response.data
    }),
  })
})

// экспорт хуков для использования в компонентах
export const {useGetSpecializationsQuery, useGetSkillsQuery} = apiSlice;