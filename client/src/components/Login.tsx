import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

type FormValues = {
  username: string;
  password: string;
};

function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const toast = useToast();
  const navigate = useNavigate();

  async function onSubmit(values: FormValues) {
    const { username, password } = values;
    try {
      const res = await AuthService.login(username, password);
      const role = res.role;

      if (role === null || role === undefined) {
        toast({
          status: "error",
          title: "Something went wrong during the authentication",
        });
      } else {
        if (role === 0) {
          navigate("/buyer");
        } else if (role === 1) {
          navigate("/seller");
        }
      }
    } catch (error) {
      toast({ status: "error", title: "Authentication failed" });
    }
  }

  return (
    <Flex p={10} align="center" justifyContent="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={5}>
          <Heading size={"lg"}>Login</Heading>
          <FormControl isInvalid={"username" in errors} mb={5}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              placeholder="username"
              {...register("username", {
                required: "This is required",
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
              type={"password"}
              placeholder="password"
              {...register("password", {
                required: "This is required",
              })}
            />
            {errors.password && (
              <FormErrorMessage>
                {JSON.stringify(errors.password.message)}
              </FormErrorMessage>
            )}
          </FormControl>
          <HStack>
            <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
              Submit
            </Button>
            <Button
              colorScheme="teal"
              variant={"outline"}
              onClick={() => navigate("/register")}
            >
              No account? Register
            </Button>
          </HStack>
        </VStack>
      </form>
    </Flex>
  );
}

export default Login;
