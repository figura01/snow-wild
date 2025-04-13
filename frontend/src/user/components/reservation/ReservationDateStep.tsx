import { DATES_STORAGE_KEY } from "@/constants/localStrotageKeys";
import UseLocalStorage from "@/hooks/useLocalStorage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/Form";

import { useDate } from "@/contexts/DateContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CartWithoutActions from "../cart/CartWithoutActions";

const FirstFormSchema = z.object({
  date: z
    .date({
      required_error: "La date est requise.",
      invalid_type_error: "Ce champ doit être une date.",
    })
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "La date doit être valide.",
    }),
});
export interface DateFormInfos {
  start_date: Date;
  end_date: Date;
}
function ReservationDateStep({
  handleSubmit,
}: {
  handleSubmit: () => Promise<void>;
}) {
  const { formInfos, setFormInfos } = useDate();
  const { SetToLocalStorage } = UseLocalStorage();
  useEffect(() => {
    if (formInfos) {
      SetToLocalStorage(DATES_STORAGE_KEY, formInfos);
    }
  }, [formInfos]);

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  return (
    <>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={() => (
              <FormItem>
                <FormLabel className="mb-10 ml-3 w-full text-center text-3xl font-bold text-neutral-950">
                  Mes dates de location
                </FormLabel>
                <FormControl className="mt-4">
                  <div className="flex justify-center lg:h-20">
                    <div className="datePickerContainer h-full w-10/12 max-w-4xl items-center rounded-lg bg-blue-300 py-3 text-center shadow-lg md:flex md:justify-evenly">
                      <div>Du</div>
                      <DatePicker
                        selected={formInfos.start_date}
                        onChange={(date) => {
                          if (date) {
                            setFormInfos({ ...formInfos, start_date: date });
                          }
                        }}
                        selectsStart
                        startDate={formInfos.start_date}
                        endDate={formInfos.end_date}
                        placeholderText="Date de début"
                        className="mx-2 rounded-lg border-2 border-black py-2 text-center"
                      />
                      <div>au</div>
                      <DatePicker
                        selected={formInfos.end_date}
                        onChange={(date) => {
                          console.log("date selected:", date);
                          if (date) {
                            setFormInfos({ ...formInfos, end_date: date });
                          }
                        }}
                        selectsEnd
                        startDate={formInfos.start_date}
                        endDate={formInfos.end_date}
                        minDate={formInfos.start_date}
                        placeholderText="Date de fin"
                        className="mx-2 rounded-lg border-2 border-black py-2 text-center"
                      />
                    </div>
                    <span id="divider" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <CartWithoutActions handleSubmit={handleSubmit} />
    </>
  );
}

export default ReservationDateStep;
