import { CustomImage } from "@/lib/chakraComponents";
import { Card, Flex, Heading, Stack } from "@chakra-ui/react";
import Link from "next/link";

const EpisodeCard = ({ id, img, title }) => {
  return (
    <Card
      as={Link}
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      href={"/player/" + id}
      bgColor="blackAlpha.600"
      padding={{ base: 5, sm: 0 }}
    >
      <Flex width={{ base: "100%", sm: "inherit" }} justifyContent="center">
        <CustomImage
          src={img}
          width={180}
          height={100}
          objectFit="cover"
          borderRadius="lg"
          borderStartRadius="lg"
          loading="lazy"
          alt={"Imagen capitulo " + title}
        />
      </Flex>

      <Stack
        justify="center"
        marginX={{ base: 0, sm: 5 }}
        marginTop={{ base: 2, sm: 0 }}
      >
        <Heading size="lg" textAlign={"center"}>
          {title}
        </Heading>
      </Stack>
    </Card>
  );
};

export default EpisodeCard;
