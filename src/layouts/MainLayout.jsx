import { Box, Container } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";

const MainLayout = ({ children, router }) => {
  return (
    <Box as="main" pb="8">
      <Navbar path={router.asPath} />
      <Container maxW="container.md" pt={16}>
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;
