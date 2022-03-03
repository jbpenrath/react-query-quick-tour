import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import ErrorToast from "../components/ErrorToast";

type ErrorContext = {
  error?: string;
  setError: (error: string | undefined) => void;
}

const ErrorContext = createContext<ErrorContext | undefined>(undefined);

const ErrorProvider = ({ children }: PropsWithChildren<{}>) => {
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if(error !== undefined) {
      const timeout = setTimeout(() => {
        setError(undefined)
      }, 4000);
      return () => {
        clearTimeout(timeout);
        if (error !== undefined) {
          setError(undefined);
        }
      }
    }
  }, [error])

  return (
    <ErrorContext.Provider value={{error, setError}}>
      {children}
      {error && <ErrorToast message={error} />}
    </ErrorContext.Provider>
  )
}

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError should be used within an <ErrorProvider />');
  }
  return context;
}

export default ErrorProvider;