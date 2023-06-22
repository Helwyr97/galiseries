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

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleReset = () => {
    if (search === "") return;
    setSearch("");
  };

  return (
    <>
      <Flex mt={5} align={"center"} justify={"center"}>
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
      </Flex>
      <Wrap p={5} spacing={8} align="center" justify="center">
        {contents
          .filter((c) =>
            c.title.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
          .map((c) => (
            <ContentCard key={c.id} id={c.id} title={c.title} img={c.img} />
          ))}
      </Wrap>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const supabase = createPagesServerClient(ctx);
  let { data } = await supabase
    .from("contents")
    .select("id, title, img")
    .order("title");

  return {
    props: {
      contents: data,
    },
  };
}
