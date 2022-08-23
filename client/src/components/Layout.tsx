import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export const Layout = () => (
  <Box height={"100vh"}>
    <Header />
    <main>
      <Outlet />
    </main>
  </Box>
);
