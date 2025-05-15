import { useEffect } from "react";

const useUnloadWarning = (unloading: boolean = true) => {
  useEffect(() => {
    if (!unloading) return;

    const listener = (evt: BeforeUnloadEvent) => {
      evt.preventDefault();
    };

    window.addEventListener("beforeunload", listener);

    return () => window.removeEventListener("beforeunload", listener);
  }, [unloading]);
};

export default useUnloadWarning;
