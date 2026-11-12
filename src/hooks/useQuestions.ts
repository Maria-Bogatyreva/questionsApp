import useQuestionParams from "./useQuestionParams.ts";
import {useGetQuestionsQuery} from "../services/questionsApi.ts";
import {limit} from "../constants/questionFilters.ts";

export default function useQuestions() {
  const {page, selectedSpecialization, appliedSearch, selectedSkills, selectedRate, selectedComplexity} = useQuestionParams();
  const {currentData, error, isFetching: isLoading } = useGetQuestionsQuery({page, limit, appliedSearch, selectedSpecialization, selectedSkills, selectedRate, selectedComplexity})
  const questions = currentData?.data ?? [];
  const total = currentData?.total ?? 0;

  return {
    questions,
    total,
    error,
    isLoading
  }
}
