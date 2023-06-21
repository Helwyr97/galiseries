import {
  Box,
  Flex,
  Text,
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
  VStack,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRecoilValue } from "recoil";
import { showNavbarState } from "@/state/states";
import { FaUserAlt } from "react-icons/fa";

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
  const { isOpen, onToggle } = useDisclosure();
  const showNavbar = useRecoilValue(showNavbarState);

  const user = false;
  const isAdmin = false;

  const handleLogOut = () => {
    // signOut(() => setUser(null));
  };

  const toLinkItem = (p) => (
    <LinkItem key={"link_" + p.label} href={p.to} text={p.label} path={path} />
  );

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
        <Flex mr={2} display={user ? { base: "flex", md: "none" } : "none"}>
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
              {user && userPages.map(toLinkItem)}
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
          {!user ? (
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
          {user && userPages.map(toLinkItem)}
          {isAdmin && adminPages.map(toLinkItem)}
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Navbar;
