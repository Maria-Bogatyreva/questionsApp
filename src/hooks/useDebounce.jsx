import {useEffect, useState} from "react";

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(()=>{
      setDebouncedValue(value)
    }, delay)

    return ()=>{
      clearInterval(timeout)
    }
  }, [value, delay]);

  return debouncedValue

}