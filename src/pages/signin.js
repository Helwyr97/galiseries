import { Field, Form, Formik } from "formik";
import NextLink from "next/link";
import { useState } from "react";
import {
  Box,
  Heading,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
} from "@chakra-ui/react";
import { login } from "@/lib/supabase";
import { useSetRecoilState } from "recoil";
import { userRoleState } from "@/state/states";
import Error from "@/components/Error";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const Login = () => {
  const router = useRouter();

  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(false);

  const setRole = useSetRecoilState(userRoleState);
  const [backendErrors, setBackendErrors] = useState(null);

  const handleValidate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Required";
    if (!values.password) errors.password = "Required";
    return errors;
  };
  const handleSubmit = (values) => {
    const { email, password } = values;
    setLoading(true);
    login(
      supabase,
      { email, password },
      () => {
        router.push("/");
      },
      (error) => setBackendErrors(error.error_description || error.message),
      () => setLoading(false)
    );
  };

  return (
    <Flex align="center" justify="center" mt={5} direction="column">
      <Heading>Login</Heading>
      <Box rounded={"lg"} boxShadow={"lg"} p={5} width={300}>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={handleValidate}
          onSubmit={handleSubmit}
        >
          {({ errors }) => (
            <Stack spacing={4} as={Form} mb={5}>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  as={Field}
                  type="text"
                  name="email"
                  borderColor={errors.email ? "tomato" : null}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  as={Field}
                  type="password"
                  name="password"
                  borderColor={errors.password ? "tomato" : null}
                />
              </FormControl>
              <Button
                isLoading={loading}
                type="submit"
                bg={"blue.400"}
                _hover={{ backgroundColor: "blue.300" }}
                textColor="white"
              >
                Sign In
              </Button>
              <Link as={NextLink} href="/signup" textAlign="center">
                No tienes cuenta? Registrate
              </Link>
            </Stack>
          )}
        </Formik>
        {backendErrors && (
          <Error
            description={backendErrors}
            onClose={() => setBackendErrors(null)}
          />
        )}
      </Box>
    </Flex>
  );
};

export const getServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Login;
