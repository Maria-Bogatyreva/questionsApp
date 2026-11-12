export interface Specialization {
  id: number;
  title: string;
}

export interface Skill {
  id: number;
  title: string;
  imageSrc: string | null;
}

export interface QuestionItem {
  id: number;
  complexity: number;
  title: string;
  rate: number;
  shortAnswer: string;
}

export interface Question extends QuestionItem {
  description: string;
  imageSrc: string | null;
  longAnswer: string;
  questionSkills: Skill[];
}

export interface QuestionsQueryParams {
  page: string;
  limit: number;
  appliedSearch: string;
  selectedSpecialization: string;
  selectedSkills: number[];
  selectedRate: number[];
  selectedComplexity: number[];
}

export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  page: number;
  total: number;
}