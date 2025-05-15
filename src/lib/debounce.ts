import { useEffect, useState } from "react";

export const debounce = <TArgs>(func: (args: TArgs) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  const debounced = (args: TArgs) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};

export const useDebounce = <TArgs>(val: TArgs, wait: number = 250): TArgs => {
  const [debounced, setDebounced] = useState(val);

  useEffect(() => {
    const debounceFunc = debounce((state: TArgs) => setDebounced(state), wait);
    debounceFunc(val);

    return debounceFunc.cancel;
  }, [val, wait]);

  return debounced;
};
