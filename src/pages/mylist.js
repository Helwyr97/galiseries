import ContentCard from "@/components/ContentCard";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const { Box, Heading, Wrap, Text } = require("@chakra-ui/react");

const MyList = ({ list }) => {
  console.log(list);
  return (
    <Box mt={5}>
      <Heading textAlign="center">Miña lista</Heading>
      <Wrap p={5} spacing={8} align="center" justify="center">
        {list.map((c) => (
          <ContentCard key={c.id} id={c.id} title={c.title} img={c.img} />
        ))}
      </Wrap>
      {list.length === 0 && (
        <Text textAlign="center">Ainda non engadiu ningún contido</Text>
      )}
    </Box>
  );
};

export const getServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const { data } = await supabase
    .from("follows")
    .select("content: content_id (id, title, img)")
    .eq("user_id", user.id);

  const list = data.map((e) => e.content);

  return {
    props: { list },
  };
};
export default MyList;
