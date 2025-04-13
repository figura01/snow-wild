import { Dispatch, SetStateAction, useEffect } from "react";

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: Dispatch<SetStateAction<boolean>>,
  idElement: string,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        handler(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler, idElement]);
};
