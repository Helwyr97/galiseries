import {
  Box,
  Flex,
  Stack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Button,
  Collapse,
  Heading,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRecoilState, useRecoilValue } from "recoil";
import { showNavbarState, userRoleState } from "@/state/states";
import { FaUserAlt } from "react-icons/fa";
import { logout } from "@/lib/supabase";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { isAdminSelector } from "@/state/selectors";
import { useRouter } from "next/router";

const LinkItem = ({ href, path, text }) => {
  const active = path === href;

  return (
    <Link
      as={NextLink}
      href={href}
      p={2}
      borderRadius="xl"
      textDecoration={active ? "underline" : "none"}
      display={"block"}
    >
      {text}
    </Link>
  );
};

const userPages = [{ label: "Mi Lista", to: "/mylist" }];

const adminPages = [{ label: "Dashboard", to: "/dashboard" }];

const Navbar = ({ path }) => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  const showNavbar = useRecoilValue(showNavbarState);

  const supabaseUser = useUser();

  const [role, setRole] = useRecoilState(userRoleState);
  const isAdmin = useRecoilValue(isAdminSelector);

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    if (path === "/mylist") router.push("/");
    if (path === "/contents") router.reload();
  };

  const toLinkItem = (p) => (
    <LinkItem key={"link_" + p.label} href={p.to} text={p.label} path={path} />
  );

  useEffect(() => {
    const getUserInfo = async (user) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role: role_id ( name )")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (error) return supabase.auth.signOut();

      setRole(data.role.name);
    };

    if (supabaseUser && !role) getUserInfo(supabaseUser);
    if (!supabaseUser && role) setRole(null);
  }, [supabaseUser, role]);

  if (!showNavbar) return null;

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      css={{ backdropFilter: "blur(20px)" }}
      zIndex={1}
      borderBottom={"1px solid white"}
    >
      <Flex
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 5 }}
        borderBottom={1}
        borderStyle={"solid"}
        align={"center"}
      >
        <Flex
          mr={2}
          display={supabaseUser ? { base: "flex", md: "none" } : "none"}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={"start"}>
          {/* <Image
            h={"30px"}
            src={process.env.REACT_APP_ICON}
            my={"auto"}
            mr={1}
          /> */}
          <Heading
            as={NextLink}
            href="/"
            textAlign={{ base: "center", md: "left" }}
            fontWeight={"bold"}
            color={"white"}
            my={"auto"}
          >
            {process.env.NEXT_PUBLIC_APP_NAME}
          </Heading>
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <Stack direction={"row"} spacing={4}>
              {supabaseUser && userPages.map(toLinkItem)}
              {isAdmin && adminPages.map(toLinkItem)}
            </Stack>
          </Flex>
        </Flex>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={2}
        >
          {!supabaseUser ? (
            <>
              <Button
                as={NextLink}
                variant={"link"}
                fontSize={"sm"}
                fontWeight={600}
                href="/signin"
              >
                Sign In
              </Button>
              <Button
                as={NextLink}
                display={{ base: "none", md: "inline-flex" }}
                href="/signup"
                bg={"blue.400"}
                fontSize={"sm"}
                fontWeight={600}
                _hover={{
                  bg: "blue.300",
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaUserAlt />}
                transition="all 0.2s"
              />
              <MenuList backgroundColor={"bgColor"}>
                <MenuItem onClick={handleLogOut} backgroundColor={"bgColor"}>
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack p={4} display={{ md: "none" }} direction={"column"}>
          {supabaseUser && userPages.map(toLinkItem)}
          {isAdmin && adminPages.map(toLinkItem)}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Navbar;
