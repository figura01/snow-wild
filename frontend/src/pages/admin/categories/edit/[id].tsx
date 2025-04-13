import { ADMIN_UPDATE_CATEGORY } from "@/admin/requetes/mutations/category.mutations";
import { ADMIN_GET_CATEGORY_BY_ID } from "@/admin/requetes/queries/category.queries";
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
import { useLazyQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

function AdminEditCategory() {
  const router = useRouter();
  const [getCategory, { data, loading, error }] = useLazyQuery(
    ADMIN_GET_CATEGORY_BY_ID,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [updateCategory] = useMutation(ADMIN_UPDATE_CATEGORY, {
    fetchPolicy: "network-only",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (router.query.id) {
      getCategory({
        variables: {
          findCategoryId: router.query.id,
        },
        onCompleted: (res) => {
          console.log("res: ", res);
          form.setValue("name", res.findCategory.name);
        },
        onError: (error) => {
          console.log("Error on get category", error);
        },
      });
    }
  }, [router.query.id, getCategory, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values: ", values);
    updateCategory({
      variables: {
        data: {
          name: values.name,
          id: router.query.id,
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
          <CardHeader>Edit Category</CardHeader>
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

export default AdminEditCategory;
