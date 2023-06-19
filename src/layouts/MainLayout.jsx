import { Box, Container } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";

const MainLayout = ({ children, router }) => {
  return (
    <Box as="main">
      <Navbar path={router.asPath} />
      <Box paddingX={10} pt={16}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
