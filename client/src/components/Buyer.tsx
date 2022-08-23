import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GiReceiveMoney } from "react-icons/gi";
import { MdProductionQuantityLimits } from "react-icons/md";
import { Navigate } from "react-router-dom";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import AuthService from "../services/auth.service";
import ProductService from "../services/product.service";
import UserService from "../services/user.service";

const ALLOWED_AMOUNTS = [5, 10, 20, 50, 100];

type PurchaseResponse = {
  purchase: string[];
  change: number[];
  amountSpent: number;
};

export default function Buyer() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [purchaseResponse, setPurchaseResponse] =
    useState<PurchaseResponse | null>(null);
  const [user, setUser] = useState<User>(AuthService.getCurrentUser());
  const [isReloading, setReloading] = useState(true);
  const [productList, setProductList] = useState<Product[]>([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await ProductService.getProducts();
        setProducts(res.data);
      } catch (error) {
        toast({ status: "error", title: "Could not retrieve the products" });
      }
    };
    if (products === null || isReloading) {
      getProducts();
      setReloading(false);
    }
  }, [toast, products, isReloading]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await UserService.getUser(user.id);
        setUser(res.data);
      } catch (error) {
        toast({ status: "error", title: "Could not retrieve the user" });
      }
    };
    if (isReloading) {
      getUser();
      setReloading(false);
    }
  }, [isReloading, toast, user.id]);

  if (user.role === 1) {
    return <Navigate to={"/seller"} />;
  } else if (user.role !== 0) {
    return <Navigate to={"/unknown"} />;
  }

  const removeProduct = (product: Product) => {
    const index = productList.findIndex((item) => item.id === product.id);
    if (index > -1) {
      productList.splice(index, 1);
    }
    setProductList([...productList]);
  };

  const addProduct = (product: Product) => {
    productList.push(product);
    setProductList([...productList]);
  };

  const getTotalForProduct = (id?: number): number => {
    let selectedProducts: Product[] = [];
    if (id) {
      selectedProducts = productList.filter((item) => item.id === id);
    } else {
      selectedProducts = productList;
    }
    const costs = selectedProducts.map((product: Product) => product.cost);
    return costs.length > 0
      ? costs.reduce((partial, value) => partial + value)
      : 0;
  };

  const onCloseModal = () => {
    onClose();
    setPurchaseResponse(null);
    setReloading(true);
    setProductList([]);
  };

  const addDeposit = async (coin: number) => {
    try {
      await UserService.deposit(coin);
      toast({ status: "success", title: "New coin added" });
      setReloading(true);
    } catch (error) {
      toast({ status: "error", title: "Could not add coin" });
    }
  };

  const resetDeposit = async () => {
    try {
      await UserService.resetDeposit();
      toast({ status: "success", title: "Deposit reset" });
      setReloading(true);
    } catch (error) {
      toast({ status: "error", title: "Could not reset your deposit" });
    }
  };

  const buy = async () => {
    const total = getTotalForProduct();
    if (total > user.deposit / 100) {
      toast({ status: "error", title: "You don't have enough money" });
      return;
    }

    try {
      const productIds = productList.map((product) => product.id);
      const response = await UserService.buy(productIds);

      setPurchaseResponse(response.data);
      onOpen();
    } catch (error) {
      toast({ status: "error", title: "Could not add coin" });
    }
  };

  return (
    <Flex p={10} align="center" justifyContent="center">
      <VStack spacing={10}>
        <HStack fontSize={"lg"} position={"relative"} width={"full"}>
          <Button
            leftIcon={<GiReceiveMoney />}
            disabled={user.deposit === 0}
            onClick={resetDeposit}
          >
            Reset
          </Button>
          <Button
            disabled={
              getTotalForProduct() > user.deposit / 100 ||
              productList.length === 0
            }
            position={"absolute"}
            right={0}
            leftIcon={<MdProductionQuantityLimits />}
            onClick={buy}
          >
            Confirm purchase
          </Button>
        </HStack>
        <HStack fontSize={"lg"} width={"full"}>
          <Text>Deposit:</Text>
          <Text pr={10} fontWeight={"semibold"}>
            {user.deposit / 100} €
          </Text>
          <Text>Total:</Text>
          <Text fontWeight={"semibold"}>{getTotalForProduct()} €</Text>
        </HStack>
        <HStack>
          <Text>Add coins: </Text>
          {ALLOWED_AMOUNTS.map((coin) => {
            return (
              <Button key={coin} onClick={() => addDeposit(coin)}>
                {coin} cents
              </Button>
            );
          })}
        </HStack>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th isNumeric>Unit cost</Th>
                <Th isNumeric>Remaining</Th>
                <Th>Select</Th>
                <Th>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products &&
                products.map((product) => {
                  const { productName, cost, amountAvailable } = product;
                  return (
                    <Tr key={product.id}>
                      <Td>{productName}</Td>
                      <Td isNumeric>{cost} €</Td>
                      <Td isNumeric>
                        {amountAvailable -
                          productList.filter((item) => item.id === product.id)
                            .length}
                      </Td>
                      <Td>
                        <HStack>
                          <IconButton
                            disabled={
                              productList.filter(
                                (item: Product) => item.id === product.id,
                              ).length === 0
                            }
                            aria-label={"Remove product"}
                            icon={<MinusIcon />}
                            onClick={() => removeProduct(product)}
                          />
                          <IconButton
                            disabled={
                              productList.filter(
                                (item: Product) => item.id === product.id,
                              ).length === product.amountAvailable
                            }
                            aria-label={"Add product"}
                            icon={<AddIcon />}
                            onClick={() => addProduct(product)}
                          />
                        </HStack>
                      </Td>
                      <Td>
                        {
                          productList.filter(
                            (item: Product) => item.id === product.id,
                          ).length
                        }
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Purchase summary</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              {purchaseResponse && (
                <>
                  <Text>Product(s) purchased: {purchaseResponse.purchase}</Text>
                  <Text>
                    Change in coins: {purchaseResponse.change.join(" cents, ")}{" "}
                    cents
                  </Text>
                  <Text>Amount spent: {purchaseResponse.amountSpent} €</Text>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
