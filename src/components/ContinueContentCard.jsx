import { secondsToHHMMSS } from "@/lib/auxFunctions";
import { CustomImage } from "@/lib/chakraComponents";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Card,
  CardBody,
  Heading,
  HStack,
  VStack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { FaPlay } from "react-icons/fa";

const ContinueContentCard = ({ content, episode, time, onDelete }) => {
  const playerUrl = "/player/" + episode.id + "?time=" + time;
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

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
    <Card bg="blackAlpha.600" boxShadow={"2xl"} rounded={"lg"}>
      <CardBody>
        <HStack justifyContent="space-between" gap={5}>
          <CustomImage
            src={episode.img ? episode.img : content.img}
            height={84}
            width={150}
            borderRadius="lg"
            loading="lazy"
            alt={"Imaxen serie " + content.title}
          />
          <Box>
            <Heading noOfLines={2} size="xl">
              {content.title}
            </Heading>
            <Text noOfLines={1}>{episode.title}</Text>
          </Box>

          <Heading size="sm">{secondsToHHMMSS(time, true)}</Heading>

          <Tooltip
            hasArrow
            label="Quitar de seguir vendo"
            bg="gray.300"
            color="black"
          >
            <IconButton
              size="lg"
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={handleDelete}
            />
          </Tooltip>
          <Tooltip hasArrow label="Seguir vendo">
            <IconButton
              size="lg"
              icon={<FaPlay />}
              colorScheme="blue"
              onClick={handleOpenPlayer}
            />
          </Tooltip>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default ContinueContentCard;
