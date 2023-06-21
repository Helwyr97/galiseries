const { extendTheme } = require("@chakra-ui/react");

const styles = {
  global: {
    body: {
      bg: "#202023",
      margin: 0,
      padding: 0,
      maxHeight: "100vh",
    },
  },
};

const config = {
  initialColorMode: "dark",
};

const theme = extendTheme({ styles, config });

export default theme;
