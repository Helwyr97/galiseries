import EpisodeCard from "@/components/EpisodeCard";
import { CustomImage } from "@/lib/chakraComponents";
import {
  followContent,
  likeContent,
  unfollowContent,
  unlikeContent,
} from "@/lib/supabase";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Heading,
  Text,
  Stack,
  Container,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const Content = ({ content }) => {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [loadingListButton, setLoadingListButton] = useState(false);
  const [loadingLikeButton, setLoadingLikeButton] = useState(false);

  const [followed, setFollowed] = useState(content.followed);
  const [liked, setLiked] = useState(content.liked);

  const [likes, setLikes] = useState(content.likes);

  const handleFollow = () => {
    if (!content || !user) return;

    setLoadingListButton(true);
    if (followed) {
      unfollowContent(
        supabase,
        { contentId: content.id, userId: user.id },
        () => setFollowed(false),
        (err) => console.log(err),
        setLoadingListButton(false)
      );
    } else {
      followContent(
        supabase,
        { contentId: content.id, userId: user.id },
        () => setFollowed(true),
        (err) => console.log(err),
        setLoadingListButton(false)
      );
    }
  };

  const handleLike = () => {
    if (!content || !user) return;

    setLoadingLikeButton(true);
    if (liked) {
      unlikeContent(
        supabase,
        { contentId: content.id, userId: user.id },
        () => {
          setLiked(false);
          setLikes((cur) => cur - 1);
        },
        (err) => console.log(err),
        setLoadingLikeButton(false)
      );
    } else {
      likeContent(
        supabase,
        { contentId: content.id, userId: user.id },
        () => {
          setLiked(true);
          setLikes((cur) => cur + 1);
        },
        (err) => console.log(err),
        setLoadingLikeButton(false)
      );
    }
  };

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
        <Text>Likes: {likes}</Text>
        {user && (
          <HStack my={4}>
            <IconButton
              isLoading={loadingListButton}
              icon={followed ? <CloseIcon /> : <AddIcon />}
              onClick={handleFollow}
              size="lg"
            />
            <IconButton
              isLoadong={loadingLikeButton}
              icon={liked ? <AiFillHeart /> : <AiOutlineHeart />}
              onClick={handleLike}
              size="lg"
            />
          </HStack>
        )}
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

  const content = { ...data, likes: data.likes.length };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: extraInfo, error } = await supabase
      .from("contents")
      .select("liked: likes(count), followed: follows(count)")
      .eq("id", id)
      .eq("followed.user_id", user.id)
      .eq("liked.user_id", user.id)
      .limit(1)
      .single();

    const { liked, followed } = extraInfo;

    content["liked"] = liked[0].count > 0;
    content["followed"] = followed[0].count > 0;
  }

  console.log(content);

  return {
    props: {
      content,
    },
  };
};

export default Content;
