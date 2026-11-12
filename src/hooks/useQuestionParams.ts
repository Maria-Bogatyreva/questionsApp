import {useSearchParams} from "react-router-dom";
import {useMemo, type MouseEvent} from "react";


type AllowedParamName = 'skills' | 'rate' | 'complexity';

export default function useQuestionParams() {
  const [params, setSearchParams] = useSearchParams();

  function getArrayParam(params: URLSearchParams, paramName: AllowedParamName) {
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

  function handleFilterChange(newValue: number, paramName: AllowedParamName | undefined, multiple:boolean) {
    if (!multiple) {
      setSearchParams(prev => {
        prev.set('page', '1');
        if (newValue !== Number(selectedSpecialization)) {
          prev.set('specializationId', newValue.toString())
        } else {
          prev.delete('specializationId')
        }
        return prev;
      })
    } else {
      if (paramName) {
        const current = params.get(paramName)?.split(',').map(Number) ?? [];
        const updated = current.includes(newValue)
          ? current.filter(v => v !== newValue)
          : [...current, newValue];

        setSearchParams(prev => {
          prev.set('page', '1');

          if(updated.length) {
            prev.set(paramName, updated.join(','))
          } else {
            prev.delete(paramName);
          }
          return prev;
        });
      }

    }
  }

  function handleNextPage(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setSearchParams(prev => {
      prev.set('page', (Number(page) + 1).toString());
      return prev;
    })
  }

  function handlePrevPage(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setSearchParams(prev => {
      prev.set('page', (Number(page) - 1).toString());
      return prev;
    })
  }

  function handlePageClick(e: MouseEvent<HTMLAnchorElement>, pageNumber:number) {
    e.preventDefault();
    setSearchParams(prev => {
      prev.set('page', pageNumber.toString());
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
