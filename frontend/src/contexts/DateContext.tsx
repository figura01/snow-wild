// DateContext.js
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
interface DateContextType {
  formInfos: {
    start_date: Date;
    end_date: Date;
  };
  setFormInfos: Dispatch<SetStateAction<{ start_date: Date; end_date: Date }>>;
}
const DateContext = createContext<DateContextType>({
  formInfos: {
    start_date: new Date(),
    end_date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 7
    ),
  },
  setFormInfos: () => {},
});

export function DateProvider({ children }: { children: React.ReactNode }) {
  const [formInfos, setFormInfos] = useState({
    start_date: new Date(),
    end_date: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 7
    ),
  });

  return (
    <DateContext.Provider value={{ formInfos, setFormInfos }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  return useContext(DateContext);
}
