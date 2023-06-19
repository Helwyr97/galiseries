import { chakra } from "@chakra-ui/react";
import NextImage from "next/image";

export const CustomImage = chakra(NextImage, {
  shouldForwardProp: (prop) => ["width", "height", "src", "alt"].includes(prop),
});
