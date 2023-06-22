import EpisodeCard from "@/components/EpisodeCard";
import { CustomImage } from "@/lib/chakraComponents";
import { Heading, Text, Stack, Container, HStack } from "@chakra-ui/react";
import {
  createPagesServerClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Head from "next/head";

const Content = ({ content }) => {
  return (
    <>
      <Head>
        <title>{content.title}</title>
      </Head>
      <Container maxW="container.lg" p={4}>
        <HStack justify="center">
          <CustomImage
            src={content.img}
            width={537}
            height={300}
            borderRadius="lg"
            alt={"Imagen serie " + content.title}
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
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const supabase = createPagesServerClient(ctx);
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
