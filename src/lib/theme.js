const { extendTheme } = require("@chakra-ui/react");

const config = {
  initialColorMode: "dark",
};

const theme = extendTheme({ config });

export default theme;
