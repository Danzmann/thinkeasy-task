import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const customTheme = extendTheme({
  fonts: {
    heading: "Geist Sans, sans-serif",
    body: "Geist Sans, sans-serif",
    mono: "Geist Mono, monospace",
  },
  colors: {
    brand: {
      50: "#f5f7ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1", // Primary color
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
  },
  styles: {
    global: (props: any) => ({
      "html, body": {
        bg: mode("gray.50", "gray.900")(props),
        color: mode("gray.800", "whiteAlpha.900")(props),
      },
      a: {
        color: mode("brand.500", "brand.200")(props),
        _hover: {
          textDecoration: "underline",
        },
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "xl",
      },
      variants: {
        solid: (props: any) => ({
          bg: mode("brand.500", "brand.200")(props),
          _hover: {
            bg: mode("brand.600", "brand.300")(props),
          },
        }),
      },
    },
  },
});

export default customTheme;
