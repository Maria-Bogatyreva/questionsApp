import {useSearchParams} from "react-router-dom";
import {useMemo} from "react";

export default function useQuestionParams() {
  const [params, setSearchParams] = useSearchParams();

  function getArrayParam(params, paramName) {
    const value = params.get(paramName);
    if (value === null) {
      return [];
    }
    return value.split(',').map(Number);
  }

  const page = params.get('page') || '1';
  const appliedSearch = params.get('search')  || '';
  const selectedSpecialization = params.get('specializationId') || '';
  const selectedSkills = useMemo(() => getArrayParam(params, 'skills'), [params]);
  const selectedRate = useMemo(() => getArrayParam(params, 'rate'), [params]);
  const selectedComplexity = useMemo(() => getArrayParam(params, 'complexity'), [params]);

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

  return {
    params,
    setSearchParams,
    page,
    appliedSearch,
    selectedSpecialization,
    selectedSkills,
    selectedRate,
    selectedComplexity,
    handleFilterChange,
    handleNextPage,
    handlePrevPage,
    handlePageClick
  }
}
