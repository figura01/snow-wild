import { CREATE_USERS_BY_ADMIN } from "@/admin/requetes/mutations/user.mutations";
import { UserRoleEnum } from "@/types";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/Form";
import { Input } from "@/ui/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/Select";
import { toast } from "@/ui/use-toast";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
const phoneValidation = new RegExp(
  /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g
);
// console.log(phoneValidation.test('+330612345678'))
// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Email is not valid" }),
  role: z.string().min(1, {
    message: "A role must be selected.",
  }),
  password: z.string().min(1, { message: "Must have at least 1 character" }),
  // .regex(passwordValidation, {
  //   message: 'Your password is not valid',
  // }),
  phone: z
    .string()
    .min(1, { message: "Phone number can't be empty" })
    .regex(phoneValidation, { message: "Your phone number is invalid" }),
  // .or(z.literal("")),
});

export default function CreateUserAdmin() {
  const router = useRouter();
  const [createUser, { data, loading, error }] = useMutation(
    CREATE_USERS_BY_ADMIN,
    {
      fetchPolicy: "no-cache",
    }
  );
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: undefined,
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);

    createUser({
      variables: {
        infos: {
          ...values,
        },
      },
      onCompleted: (data) => {
        console.log("succes");
        console.log("data: => ", data);
        toast({
          title: "Success",
          description: "You successfully registred a new user",
        });
        router.push("/admin/users/list");
      },
      onError: (err) => {
        console.log("error");
        console.log(err.message);
        toast({
          title: "Error",
          description: err.message,
        });
      },
    });
  };
  return (
    <>
      <h1>Create User</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="md:w-[500px] md:mx-auto">
            <CardHeader>Create a neuw user</CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Snow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="John-Snow@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem
                    className="mb-3"
                  >
                    <FormLabel>Pone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0630609940" {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/* <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-left">Phone Number</FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput 
                        placeholder="Enter a phone number" {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-left">
                      Enter a phone number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="role"
                render={({ field }: { field: any }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {(
                            Object.keys(UserRoleEnum) as Array<
                              keyof typeof UserRoleEnum
                            >
                          ).map((key) => {
                            return (
                              <SelectItem
                                key={`role_${key}`}
                                value={UserRoleEnum[key]}
                              >
                                {key}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start mb-3">
                    <FormLabel className="text-left">Phone Number</FormLabel>
                    <FormControl className="w-full">
                      {/* <PhoneInput 
                        placeholder="Enter a phone number" {...field}
                        defaultCountry="FR"
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start mb-3">
                    <FormLabel className="text-left">Password</FormLabel>
                    <FormControl className="w-full">
                      <Input
                        type="password"
                        placeholder="Enter a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
