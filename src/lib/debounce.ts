export const debounce = <TArgs>(func: (args: TArgs) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  const debounced = (args: TArgs) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};
