import { ChakraProvider } from "@chakra-ui/react";
import defaultTheme from "../lib/theme";
import MainLayout from "@/layouts/MainLayout";

export default function App({ Component, pageProps, router }) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <MainLayout router={router}>
        <Component {...pageProps} />
      </MainLayout>
    </ChakraProvider>
  );
}
