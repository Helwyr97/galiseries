import ContentCard from "@/components/ContentCard";
import useDebounce from "@/lib/useDebounce";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Wrap,
} from "@chakra-ui/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export default function Home({ contents }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // const mostLiked = contents.sort((a, b) => b.likes - a.likes).slice(0, 5);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleReset = () => {
    if (search === "") return;
    setSearch("");
  };

  return (
    <>
      <Flex mt={5} align={"center"} justify={"center"} direction={"column"}>
        <InputGroup size={"md"} width={["xs", "md", "lg"]}>
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

  return {
    props: {
      contents: res,
    },
  };
}
