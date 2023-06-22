import { ChakraProvider } from "@chakra-ui/react";
import defaultTheme from "../lib/theme";
import MainLayout from "@/layouts/MainLayout";
import { RecoilRoot } from "recoil";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export default function App({ Component, pageProps, router }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <RecoilRoot>
        <ChakraProvider theme={defaultTheme}>
          <MainLayout router={router}>
            <Component {...pageProps} />
          </MainLayout>
        </ChakraProvider>
      </RecoilRoot>
    </SessionContextProvider>
  );
}
