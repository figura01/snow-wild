import { CartItem } from "@/contexts/CartContext";
import { Reservation } from "@/types/reservation";
import { DateFormInfos } from "@/user/components/reservation/ReservationDateStep";
import { RowData } from "@tanstack/react-table";
// FormDataCard : FOR LATER MAYBE
export default function UseLocalStorage() {
  const EmptyLocalStorage = (...storageKeys: string[]) => {
    storageKeys.forEach((key: string) => {
      localStorage.removeItem(key);
    });
  };

  const SetToLocalStorage = (
    storageKey: string,
    itemToStore: CartItem[] | DateFormInfos | RowData | Reservation,
  ) => {
    if (itemToStore)
      localStorage.setItem(storageKey, JSON.stringify(itemToStore));
  };
  const RemoveFromLocalStorage = (storageKey: string) => {
    localStorage.removeItem(storageKey);
  };
  const GetFromLocalStorage = (storageKey: string) => {
    if (typeof window !== "undefined") {
      const storedItem = localStorage.getItem(storageKey);
      if (storedItem) return JSON.parse(storedItem);
    }
  };

  return {
    EmptyLocalStorage,
    SetToLocalStorage,
    GetFromLocalStorage,
    RemoveFromLocalStorage,
  };
}
