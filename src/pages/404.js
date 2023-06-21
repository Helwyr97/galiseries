import { CustomImage } from "@/lib/chakraComponents";
import { Flex, Heading, Text } from "@chakra-ui/react";

const NotFound = () => {
  return (
    <Flex alignItems="center" flexDirection="column" gap={5}>
      <Heading>404 Not Found</Heading>
      <Text>Vaia... parece que Galloso non atopou o que buscabas</Text>
      <CustomImage
        src="/galloso.gif"
        width={498}
        height={280}
        alt="Galloso bailando con unas maracas"
        borderRadius="lg"
      />
    </Flex>
  );
};

export default NotFound;
