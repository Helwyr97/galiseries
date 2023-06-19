import EpisodeCard from "@/components/EpisodeCard";
import { CustomImage } from "@/lib/chakraComponents";
import { supabase } from "@/lib/supabase";
import { Box, Heading, Text, Stack, Container, HStack } from "@chakra-ui/react";

const Content = ({ content }) => {
  return (
    <Container maxW="container.lg" p={4}>
      <HStack justify="center">
        <CustomImage
          src={content.img}
          width={537}
          height={300}
          borderRadius="lg"
        />
      </HStack>
      <Heading>{content.title}</Heading>
      <Text>Likes: {content.likes}</Text>
      <Text fontSize={"2xl"}>Episodes:</Text>
      <Stack mt={4}>
        {content.episodes.length === 0 ? (
          <Text>Aun no hay episodios agregados</Text>
        ) : (
          content.episodes.map((e) => (
            <EpisodeCard
              key={"ep" + e.id}
              id={e.id}
              img={e.img}
              title={e.title}
            />
          ))
        )}
      </Stack>
    </Container>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.query;
  const { data } = await supabase
    .from("contents")
    .select(
      "id, title, description, banner, img, episodes (id, title, img, url), likes(content_id)"
    )
    .eq("id", id)
    .limit(1)
    .single();

  return {
    props: {
      content: { ...data, likes: data.likes.length },
    },
  };
};

export default Content;
