import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export default function Header() {
  let navigate = useNavigate();

  return (
    <>
      <Box bg={"teal.300"} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>Logo</Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={"https://avatars.dicebear.com/api/male/username.svg"}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>Username</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem
                    onClick={() => {
                      AuthService.logout();
                      navigate("login");
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
