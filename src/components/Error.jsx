import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  CloseButton,
} from "@chakra-ui/react";

const Error = ({ description, onClose }) => {
  return (
    <Alert status="error" mb={5} rounded={"lg"}>
      <AlertIcon />
      <Box w="full">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Box>
      {onClose && (
        <CloseButton
          alignSelf={"flex-start"}
          position="relative"
          right={-1}
          top={-1}
          onClick={onClose}
        />
      )}
    </Alert>
  );
};

export default Error;
