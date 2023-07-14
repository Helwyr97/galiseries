import Carousel from "@/components/Carousel";
import ContentCard from "@/components/ContentCard";
import ContinueContentCard from "@/components/ContinueContentCard";
import useDebounce from "@/lib/useDebounce";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function Home({ contents, continueWatchingOrig }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [continueWatching, setContinueWatching] =
    useState(continueWatchingOrig);

  const user = useUser();

  // const mostLiked = contents.sort((a, b) => b.likes - a.likes).slice(0, 5);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleReset = () => {
    if (search === "") return;
    setSearch("");
  };

  console.log(continueWatching);

  return (
    <>
      <Flex mt={5} align={"center"} justify={"center"} direction={"column"}>
        {user && continueWatching.length > 0 && (
          <>
            <Heading mb={1}>Seguir vendo</Heading>
            <Carousel>
              {continueWatching.map((p) => (
                <ContinueContentCard
                  key={"ep" + p.episode.id}
                  content={p.content}
                  episode={p.episode}
                  time={p.time}
                  onDelete={(id) =>
                    setContinueWatching((cur) =>
                      cur.filter((c) => c.content.id !== id)
                    )
                  }
                />
              ))}
            </Carousel>
          </>
        )}
        <InputGroup size={"md"} width={["xs", "md", "lg"]} mt={5}>
          <InputLeftAddon children={<SearchIcon />} />
          <Input
            type="text"
            placeholder="Titulo"
            value={search}
            onChange={handleSearchChange}
          />
          <InputRightElement>
            <IconButton icon={<CloseIcon />} onClick={handleReset} />
          </InputRightElement>
        </InputGroup>
        <Wrap p={5} spacing={8} align="center" justify="center">
          {contents
            .filter((c) =>
              c.title.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
            .map((c) => (
              <ContentCard key={c.id} id={c.id} title={c.title} img={c.img} />
            ))}
        </Wrap>
      </Flex>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const supabase = createPagesServerClient(ctx);
  const { data: contents } = await supabase
    .from("contents")
    .select("id, title, img, likes: likes(count)")
    .order("title");

  const res = contents.map((c) => ({ ...c, likes: c.likes[0].count }));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let continueWatching = [];

  if (user) {
    const { data } = await supabase
      .from("progress")
      .select(
        "time, content: content_id(id, title, img), episode: last_watched(id, title, img)"
      )
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false });
    continueWatching = data;
  }

  return {
    props: {
      contents: res,
      continueWatchingOrig: continueWatching,
    },
  };
}
