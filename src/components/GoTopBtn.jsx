import { goTop } from "@/lib/auxFunctions";
import { ChevronUpIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

const GoTopBtn = () => (
  <IconButton
    icon={<ChevronUpIcon />}
    position="fixed"
    bottom={1}
    right={1}
    size="lg"
    onClick={goTop}
  />
);

export default GoTopBtn;
