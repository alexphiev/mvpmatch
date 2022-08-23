import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

type FormValues = {
  username: string;
  password: string;
  role: number;
};

export default function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const toast = useToast();
  const navigate = useNavigate();

  async function onSubmit(values: FormValues) {
    const { username, password, role } = values;

    try {
      const res = await AuthService.register(username, password, role);
      if (res.data.id > 0) {
        navigate("/login");
      } else {
        toast({
          status: "error",
          title: "Something went wrong. Unable to register",
        });
      }
    } catch (error) {
      const response = (error as AxiosError).response;
      if (response) {
        toast({ status: "error", title: JSON.stringify(response.data) });
      } else {
        toast({ status: "error", title: "Failed to register" });
      }
    }
  }

  return (
    <Flex p={10} align="center" justifyContent="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={5}>
          <Heading size={"lg"}>Create an account</Heading>
          <FormControl isInvalid={"username" in errors}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              placeholder="username"
              {...register("username", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            {errors.username && (
              <FormErrorMessage>
                {JSON.stringify(errors.username.message)}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={"password" in errors}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              placeholder="password"
              {...register("password", {
                required: "This is required",
                minLength: { value: 4, message: "Minimum length should be 4" },
              })}
            />
            {errors.password && (
              <FormErrorMessage>
                {JSON.stringify(errors.password.message)}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={"role" in errors}>
            <FormLabel htmlFor="role">Role</FormLabel>
            <Select
              id="role"
              placeholder="role"
              {...register("role", {
                required: "This is required",
              })}
            >
              <option value={0}>Buyer</option>
              <option value={1}>Seller</option>
            </Select>
            {errors.role && (
              <FormErrorMessage>
                {JSON.stringify(errors.role.message)}
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
