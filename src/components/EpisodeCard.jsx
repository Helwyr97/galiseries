import { CustomImage } from "@/lib/chakraComponents";
import { Card, Heading, Stack } from "@chakra-ui/react";
import Link from "next/link";

const EpisodeCard = ({ id, img, title }) => {
  return (
    <Card
      as={Link}
      direction="row"
      overflow="hidden"
      variant="outline"
      href={"/player/" + id}
      bgColor="blackAlpha.600"
    >
      <CustomImage
        src={img}
        width={180}
        height={100}
        objectFit="cover"
        borderRadius="lg"
        borderStartRadius="lg"
        loading="lazy"
      />
      <Stack justify="center" marginLeft={5}>
        <Heading size="lg">{title}</Heading>
      </Stack>
    </Card>
  );
};

export default EpisodeCard;
