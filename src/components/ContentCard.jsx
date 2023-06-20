import { Card, CardBody, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { CustomImage } from "@/lib/chakraComponents";

const ContentCard = ({ id, title, img }) => {
  return (
    <Card
      as={NextLink}
      bg="blackAlpha.600"
      boxShadow={"2xl"}
      rounded={"lg"}
      href={"/contents/" + id}
      width={250}
    >
      <CardBody>
        <CustomImage
          src={img}
          height={168}
          width={300}
          borderRadius="lg"
          loading="lazy"
          alt={"Imagen serie " + title}
        />
        <Heading size="md" mt={5} textAlign="center">
          {title}
        </Heading>
      </CardBody>
    </Card>
  );
};

export default ContentCard;
