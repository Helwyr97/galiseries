import { secondsToHHMMSS } from "@/lib/auxFunctions";
import { CustomImage } from "@/lib/chakraComponents";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Card,
  CardBody,
  Heading,
  IconButton,
  Tooltip,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { FaPlay } from "react-icons/fa";

const ContinueContentCard = ({ content, episode, time, onDelete }) => {
  const playerUrl = "/player/" + episode.id + "?time=" + time;
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const imgH = useBreakpointValue({ base: 84, lg: 168 });
  const imgW = useBreakpointValue({ base: 150, lg: 300 });

  const handleOpenPlayer = () => router.push(playerUrl);

  const handleDelete = async () => {
    await supabase
      .from("progress")
      .delete()
      .eq("user_id", user.id)
      .eq("content_id", content.id);
    onDelete(content.id);
  };

  return (
    <Card
      bg="blackAlpha.600"
      boxShadow={"2xl"}
      rounded={"lg"}
      minWidth={{ base: null, lg: 700 }}
      maxWidth={{ base: 200, sm: null }}
    >
      <CardBody>
        <Stack
          justifyContent="space-between"
          gap={{ base: 1, sm: 5 }}
          direction={{ base: "column", lg: "row" }}
          alignItems="center"
        >
          <CustomImage
            src={episode.img ? episode.img : content.img}
            height={imgH}
            width={imgW}
            borderRadius="lg"
            loading="lazy"
            alt={"Imaxen serie " + content.title}
          />
          <Box>
            <Heading noOfLines={2} size={{ base: "md", lg: "xl" }}>
              {content.title}
            </Heading>
            <Text noOfLines={1} size={{ base: "md", lg: "xl" }}>
              {episode.title}
            </Text>
            <Text noOfLines={1} size={{ base: "sm", lg: "md" }}>
              {secondsToHHMMSS(time, true)}
            </Text>
          </Box>

          <Stack
            justifyContent="space-between"
            direction={{ base: "row", lg: "column" }}
          >
            <Tooltip
              hasArrow
              label="Quitar de seguir vendo"
              bg="gray.300"
              color="black"
            >
              <IconButton
                size={{ base: "md", lg: "lg" }}
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={handleDelete}
              />
            </Tooltip>
            <Tooltip hasArrow label="Seguir vendo">
              <IconButton
                size={{ base: "md", lg: "lg" }}
                icon={<FaPlay />}
                colorScheme="blue"
                onClick={handleOpenPlayer}
              />
            </Tooltip>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ContinueContentCard;
