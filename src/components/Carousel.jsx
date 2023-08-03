import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useState } from "react";

const Carousel = ({ children }) => {
  const max = children.length;
  const [i, setI] = useState(0);

  const next = () => setI((cur) => (cur + 1) % max);
  const prev = () => setI((cur) => (cur - 1 + max) % max);

  return (
    <Flex
      borderColor="white"
      width="100%"
      justifyContent="space-evenly"
      alignItems="center"
      position="relative"
      marginBottom={{ base: 5, sm: 2 }}
      height={80}
    >
      <IconButton
        size="lg"
        icon={<ChevronLeftIcon />}
        height={"50%"}
        onClick={prev}
        isDisabled={max === 1}
      />
      <Box>{children[i]}</Box>
      <IconButton
        size="lg"
        icon={<ChevronRightIcon />}
        height={"50%"}
        onClick={next}
        isDisabled={max === 1}
      />
      <Text
        position="absolute"
        bottom={{ base: -7, sm: -4 }}
        width="100%"
        textAlign="center"
      >
        {i + 1}/{max}
      </Text>
    </Flex>
  );
};

export default Carousel;
