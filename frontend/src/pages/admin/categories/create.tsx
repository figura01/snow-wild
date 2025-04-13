import { ADMIN_CREATE_CATEGORY } from "@/admin/requetes/mutations/category.mutations";
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
import { toast } from "@/ui/use-toast";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

function AdminCreateCategory() {
  const router = useRouter();
  const [createCategory, { data, loading, error }] = useMutation(
    ADMIN_CREATE_CATEGORY,
    {
      fetchPolicy: "network-only",
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    createCategory({
      variables: {
        data: {
          name: values.name,
        },
      },
      onCompleted: (res) => {
        console.log("res after completed", res);

        toast({
          title: "Success",
          description: "You successfully registred a category",
        });
        router.push("/admin/categories/list");
      },
      onError: (error) => {
        console.log("ERROR: ", error.message);
        toast({
          title: "Error",
          description: "This name is already used !",
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="md:w-[500px] md:mx-auto">
          <CardHeader>Create a neuw user</CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of category" {...field} />
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
  );
}

export default AdminCreateCategory;
