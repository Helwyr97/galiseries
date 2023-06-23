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
  Text,
} from "@chakra-ui/react";
import { signUp } from "@/lib/supabase";
import Error from "@/components/Error";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import Success from "@/components/Success";

const Register = () => {
  const router = useRouter();

  const supabase = useSupabaseClient();

  const [loading, setLoading] = useState(false);

  const [backendErrors, setBackendErrors] = useState(null);

  const [success, setSuccess] = useState(null);

  const handleValidation = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email";
    }

    if (!values.password) {
      errors.password = "Required";
    } else {
      if (!values.password2 || values.password !== values.password2) {
        errors.password2 = "Os contrasinais non coinciden";
      }
    }

    return errors;
  };

  const handleSubmit = (values, { resetForm }) => {
    const { email, password } = values;
    setLoading(true);
    signUp(
      supabase,
      { email, password },
      () => {
        setSuccess(true);
        resetForm();
      },
      (error) => setBackendErrors(error.error_description || error.message),
      () => setLoading(false)
    );
  };

  return (
    <>
      <Head>
        <title>Rexistrarse</title>
      </Head>
      <Flex align="center" justify="center" mt={5} direction="column">
        <Heading>Rexistro</Heading>
        <Box rounded={"lg"} boxShadow={"lg"} p={5} width={300}>
          <Formik
            initialValues={{ email: "", password: "", password2: "" }}
            validate={handleValidation}
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
                  <FormLabel>Contrasinal</FormLabel>
                  <Input
                    as={Field}
                    type="password"
                    name="password"
                    borderColor={errors.password ? "tomato" : null}
                  />
                </FormControl>
                <FormControl id="password2">
                  <FormLabel>Repita o contrasinal</FormLabel>
                  <Input
                    as={Field}
                    type="password"
                    name="password2"
                    borderColor={errors.password2 ? "tomato" : null}
                  />
                  {errors.password2 && (
                    <Text color={"tomato"}>{errors.password2}</Text>
                  )}
                </FormControl>
                <Button
                  isLoading={loading}
                  type="submit"
                  bg={"blue.400"}
                  _hover={{ backgroundColor: "blue.300" }}
                  textColor="white"
                >
                  Rexistrarse
                </Button>
                <Link
                  as={NextLink}
                  href="/signin"
                  textAlign="center"
                  textDecoration={"underline"}
                >
                  Xa tes conta? Entra
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
          {success && (
            <Success
              description="Email para confirmar enviado"
              onClose={() => setSuccess(null)}
            />
          )}
        </Box>
      </Flex>
    </>
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

export default Register;
