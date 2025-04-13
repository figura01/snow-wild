import ControlledInput from "@/admin/components/ControlledInput";
import {
  BootsSizes,
  ClothSizes,
  SkiSizes,
  SnowboardSizes,
  StickSizes,
} from "@/constants/sizes";
import { UPDATE_MATERIAL_ADMIN } from "@/requetes/mutations/material.mutations";
import { LIST_CATEGORIES } from "@/requetes/queries/category.queries";
import { GET_MATERIAL_BY_ID } from "@/requetes/queries/material.queries";
import { CategoryType } from "@/types";
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
import { Label } from "@/ui/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/Select";
import { Textarea } from "@/ui/Textarea";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";

import SizeLabel from "@/admin/components/SizeLabel";
import UseLocalStorage from "@/hooks/useLocalStorage";
import axios from "axios";
import { CircleX } from "lucide-react";

const formSchema = z.object({
  category: z.object({ name: z.string(), id: z.string() }),
  sizes: z
    .array(
      z.object({
        size: z.string(),
        quantity: z
          .number()
          .min(1, { message: "Quantity should be more than 0" })
          .positive({ message: "Quantity should be more than 0" }),
      }),
    )
    .min(1, { message: "At minimum a size is required" })
    .nonempty({ message: "Some size should be selected" })
    .min(1, { message: "Some size should be selected" }),
  name: z.string().min(2, { message: "Name should be more than 2 carac" }),
  description: z
    .string()
    .min(1, { message: "Product should have a description" }),
  picture: z
    .custom<File>((v) => v instanceof File, {
      message: "Image is required",
    })
    .optional(),
  price: z.number().min(1, { message: "A price is required" }),
});

type FormSchema = z.infer<typeof formSchema>;

const EditProductAdmin = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(LIST_CATEGORIES, {
    fetchPolicy: "no-cache",
  });
  const [getMaterial] = useLazyQuery(GET_MATERIAL_BY_ID, {
    fetchPolicy: "no-cache",
  });
  const [loadedData, setLoadedData] = useState({});

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: undefined,
      sizes: [],
      name: "",
      description: "",
      picture: undefined,
      price: 0,
    },
    mode: "onChange",
  });

  const { watch } = form;
  const watchCategory = watch("category");
  const watchSizes = watch("sizes");

  console.log("watchSizes: ", watchSizes);

  const inputFileRef = useRef<any>(null);
  const [updateMaterial] = useMutation(UPDATE_MATERIAL_ADMIN);
  useEffect(() => {
    if (router.query.id) {
      console.log(router.query.id);
      getMaterial({
        variables: {
          findMaterialByIdId: router.query.id,
        },
        onCompleted: (data) => {
          console.log("data: ", data);
          form.setValue("name", data.findMaterialById.name);
          form.setValue("description", data.findMaterialById.description);
          form.setValue("price", Number(data?.findMaterialById?.price));
          form.setValue("category", data.findMaterialById?.category);
          form.setValue("sizes", data.findMaterialById?.sizes);

          console.log(form.getValues("category"));
          setLoadedData(data);
        },
        onError: (error) => {
          console.log("error");
          console.log(error);
        },
      });
    }
  }, [router.query.id, getMaterial, form]);

  const findNameOfCategorie = (id: string) => {
    let cat = data.categories.find((el: CategoryType) => el.id === id);
    return cat.name;
  };

  const handleChangeCategory = (
    value: string,
    field: ControllerRenderProps<FieldValues, "category">,
  ) => {
    let name = findNameOfCategorie(value);
    if (name) {
      field.onChange({ name: name, id: value });
    }
  };

  const handleClickSize = (
    field: ControllerRenderProps<FieldValues, "sizes">,
    size: string,
  ) => {
    if (!watchSizes?.some((e) => e.size === size)) {
      console.log(watchSizes);
      let copyArr = [...watchSizes, { size, quantity: 0 }];
      form.setValue("sizes", copyArr as any);
    } else {
      let filtredSizes = watchSizes.filter((s) => s.size !== size);
      form.setValue("sizes", filtredSizes as any);
    }
  };

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const file = inputFileRef?.current?.files[0]; // Récupérer le fichier sélectionné
    const { GetFromLocalStorage, RemoveFromLocalStorage } = UseLocalStorage();
    const pictureFromLocalStorage = GetFromLocalStorage("product_row");
    const currentPicture = pictureFromLocalStorage._valuesCache.picture; // Récupérer l'image actuelle du produit
    RemoveFromLocalStorage("product_row");
    // Créer un FormData pour envoyer les données
    const formData = new FormData();

    // Si un fichier est sélectionné, l'ajouter au FormData
    if (file) {
      formData.append("file", file, file.name);
    }

    // Si aucune nouvelle image n'est sélectionnée, vérifier si une image existante est présente
    const pictureToSend = file ? file.name : currentPicture || null;

    // Si pictureToSend est null, cela signifie qu'aucune image n'est disponible
    if (!pictureToSend) {
      console.log("Aucune image à envoyer");
    }

    // Envoyer le FormData avec l'image si un fichier est ajouté
    if (file) {
      axios
        .post(`${process.env.NEXT_PUBLIC_IMAGE_URL}/upload`, formData)
        .then((result) => {
          console.log("result", result);
          if (result?.data?.status === "success") {
            updateMaterial({
              variables: {
                data: {
                  ...data,
                  id: router.query.id,
                  picture: result.data.filename || currentPicture, // Utiliser l'URL de l'image directement ici
                },
              },
            })
              .then((res) => {
                console.log("res: =======>", res);
                if (res.data) {
                  router.push("/admin/products/list");
                }
              })
              .catch((err) => {
                console.log("err ===>", err);
              });
          }
        })
        .catch((err) => {
          console.log("Error uploading file: ", err);
        });
    } else {
      // Si aucun fichier n'est envoyé, on utilise l'ancienne image
      updateMaterial({
        variables: {
          data: {
            ...data,
            id: router.query.id,
            picture: pictureToSend || "", // S'assurer que la valeur passée est une chaîne (URL ou vide)
          },
        },
      })
        .then((res) => {
          console.log("res: =======>", res);
          if (res.data) {
            router.push("/admin/products/list");
          }
        })
        .catch((err) => {
          console.log("err ===>", err);
        });
    }
  };

  const renderSizesByCategory = (field: any) => {
    console.log("renderSizesByCategory :", watchCategory.name);
    switch (watchCategory.name) {
      case "ski":
        return SkiSizes?.map((s: string, index: number) => {
          return (
            <SizeLabel
              key={`size_label_${s}`}
              label={s}
              field={field}
              isActive={watchSizes?.some((e) => e.size === s)}
              onHandleClickSize={handleClickSize}
            />
          );
        });
      // break;
      case "accessory":
        return ClothSizes?.map((s: string, index: number) => {
          return (
            <SizeLabel
              key={`size_label_${s}`}
              label={s}
              field={field}
              isActive={watchSizes?.some((e) => e.size === s)}
              onHandleClickSize={handleClickSize}
            />
          );
        });
        break;
      case "snowboard":
        return SnowboardSizes?.map((s: string, index: number) => {
          return (
            <SizeLabel
              key={`size_label_${s}`}
              label={s}
              field={field}
              isActive={watchSizes?.some((e) => e.size === s)}
              onHandleClickSize={handleClickSize}
            />
          );
        });
        break;
      case "boots":
        return BootsSizes?.map((s: string, index: number) => {
          return (
            <SizeLabel
              key={`size_label_${s}`}
              label={s}
              field={field}
              isActive={watchSizes?.some((e) => e.size === s)}
              onHandleClickSize={handleClickSize}
            />
          );
        });
      case "stick":
        return StickSizes?.map((s: string, index: number) => {
          return (
            <SizeLabel
              key={`size_label_${s}`}
              label={s}
              field={field}
              isActive={watchSizes?.some((e) => e.size === s)}
              onHandleClickSize={handleClickSize}
            />
          );
        });
    }
  };

  const renderBlocSizes = () => {
    return (
      <div className="mb-3">
        <Label>Select sizes</Label>
        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormItem className="mb-3" {...field}>
              <FormControl>
                <div className="flex flex-row flex-wrap justify-start gap-1">
                  {renderSizesByCategory(field)}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  const renderBlocSizePerQuantity = () => {
    return watchSizes.map(
      (s: { size: string; quantity: number }, index: number) => {
        return (
          <FormField
            control={form.control}
            key={`field.${index}`}
            name={`sizes`}
            render={({ field }) => {
              return (
                <>
                  <FormItem>
                    <FormLabel>Quantity per size(s)</FormLabel>
                    <FormControl>
                      <div className="justify-strat flex items-center gap-2">
                        <div className="flex h-9 w-14 items-center justify-center rounded-md bg-gray-950 px-3 text-sm text-white">
                          {field.value[index]?.size}
                        </div>
                        <ControlledInput
                          initialValue={field.value[index]?.quantity || 0}
                          index={index}
                          form={form}
                        />
                        <CircleX
                          className="hover:cursor-pointer hover:text-red-400"
                          onClick={() => {
                            let arrCopy: any = watchSizes.filter(
                              (s) => s.size !== field.value[index].size,
                            );

                            form.setValue("sizes", arrCopy);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              );
            }}
          />
        );
      },
    );
  };

  return (
    data && (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="form">
          <Card className="mx-auto md:w-[400px]">
            <CardHeader>
              <h1>Edit Product</h1>
            </CardHeader>

            <CardContent>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem
                    className="mb-3"
                    onChange={(e: any) => {
                      field.onChange(e.target?.value);
                    }}
                  >
                    <FormLabel className="font-bold">
                      Product&apos;s name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem
                    className="mb-3"
                    onChange={(e: any) => {
                      field.onChange(e.target?.value);
                    }}
                  >
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="mb-3 flex items-center">
                        <Input
                          {...field}
                          type="number"
                          placeholder="100"
                          className="w-full"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <span className="ml-4"> €</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="picture"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Picture</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        required={false}
                        type="file"
                        placeholder="image.jpeg"
                        ref={inputFileRef}
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchCategory !== undefined && watchCategory.name.length > 0 && (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel>Category</FormLabel>

                      <Select
                        onValueChange={(value) => {
                          handleChangeCategory(value, field as any);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={watchCategory?.name}
                              placeholder={watchCategory?.name}
                              //defaultValue={watchCategory?.name}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {!loading &&
                              data?.categories.map(
                                (c: CategoryType, index: number) => {
                                  return (
                                    <SelectItem
                                      key={`category_${c.id}_${index}`}
                                      value={c.id.toString()}
                                    >
                                      {c.name}
                                    </SelectItem>
                                  );
                                },
                              )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {
                        <p className="text-red-500">
                          {form.getFieldState("category").error?.message}
                        </p>
                      }
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div>
                {watchCategory && (
                  <>
                    {renderBlocSizes()}
                    {watchSizes?.length > 0 && (
                      <>{renderBlocSizePerQuantity()}</>
                    )}
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Update</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    )
  );
};

export default EditProductAdmin;
