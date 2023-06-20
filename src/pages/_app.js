import { ChakraProvider } from "@chakra-ui/react";
import defaultTheme from "../lib/theme";
import MainLayout from "@/layouts/MainLayout";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps, router }) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={defaultTheme}>
        <MainLayout router={router}>
          <Component {...pageProps} />
        </MainLayout>
      </ChakraProvider>
    </RecoilRoot>
  );
}
