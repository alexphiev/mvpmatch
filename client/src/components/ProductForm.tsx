import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import ProductService from "../services/product.service";

type Props = {
  sellerId: number;
  productId?: number;
  onClose: () => void;
  defaultValues?: ProductFormValues;
  isNew: boolean;
};

export interface ProductFormValues {
  productName: string;
  cost: number;
  amountAvailable: number;
}

export default function ProductForm({
  sellerId,
  productId,
  onClose,
  defaultValues,
  isNew,
}: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues,
  });
  const toast = useToast();

  async function onSubmit(values: ProductFormValues) {
    const { productName, cost, amountAvailable } = values;

    if (isNew) {
      try {
        await ProductService.addProduct(
          productName,
          cost,
          amountAvailable,
          sellerId,
        );
        toast({
          status: "success",
          title: "New product added",
        });
        onClose();
      } catch (error) {
        const response = (error as AxiosError).response;
        if (response) {
          toast({ status: "error", title: JSON.stringify(response.data) });
        } else {
          toast({ status: "error", title: "Failed to add the new product" });
        }
      }
    } else {
      if (productId) {
        try {
          await ProductService.udateProduct(productId, {
            productName,
            cost,
            amountAvailable,
          });
          toast({
            status: "success",
            title: "Product updated",
          });
          onClose();
        } catch (error) {
          const response = (error as AxiosError).response;
          if (response) {
            toast({ status: "error", title: JSON.stringify(response.data) });
          } else {
            toast({ status: "error", title: "Failed to update the product" });
          }
        }
      }
    }
  }

  return (
    <Flex p={10} align="center" justifyContent="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={5}>
          <FormControl isInvalid={"productName" in errors}>
            <FormLabel htmlFor="productName">Name</FormLabel>
            <Input
              id="productName"
              placeholder="productName"
              {...register("productName", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            {errors.productName && (
              <FormErrorMessage>
                {JSON.stringify(errors.productName.message)}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={"cost" in errors}>
            <FormLabel htmlFor="cost">Unit cost (€)</FormLabel>
            <Input
              id="cost"
              placeholder="cost"
              type={"decimal"}
              {...register("cost", {
                required: "This is required",
                min: 0,
              })}
            />
            {errors.cost && (
              <FormErrorMessage>
                {JSON.stringify(errors.cost.message)}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={"amountAvailable" in errors}>
            <FormLabel htmlFor="amountAvailable">Amount</FormLabel>
            <Input
              id="amountAvailable"
              placeholder="amountAvailable"
              type={"number"}
              {...register("amountAvailable", {
                required: "This is required",
                min: 0,
              })}
            />
            {errors.amountAvailable && (
              <FormErrorMessage>
                {JSON.stringify(errors.amountAvailable.message)}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </VStack>
      </form>
    </Flex>
  );
}
