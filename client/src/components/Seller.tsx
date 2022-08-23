import { DeleteIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
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
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Product } from "../models/product.model";
import AuthService from "../services/auth.service";
import ProductService from "../services/product.service";
import ProductForm from "./ProductForm";

export default function Seller() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [reloading, setReloading] = useState(true);
  const [isOpenNewProduct, setOpenNewProduct] = useState(false);
  const [isOpenEditProduct, setOpenEditProduct] = useState(false);
  const user = AuthService.getCurrentUser();
  const toast = useToast();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await ProductService.getProducts();
        setProducts(res.data);
      } catch (error) {
        toast({ status: "error", title: "Could not retrieve the products" });
      }
    };
    if (reloading) {
      getProducts();
      setReloading(false);
    }
  }, [toast, reloading]);

  if (user.role === 0) {
    return <Navigate to={"/buyer"} />;
  } else if (user.role !== 1) {
    return <Navigate to={"/unknown"} />;
  }

  const onCloseNewModal = () => {
    setOpenNewProduct(false);
    setReloading(true);
  };

  const onCloseEditModal = () => {
    setOpenEditProduct(false);
    setProduct(null);
    setReloading(true);
  };

  const deleteProduct = async (id: number) => {
    try {
      await ProductService.deleteProduct(id);
      toast({ status: "success", title: "Product deleted" });
      setReloading(true);
    } catch (error) {
      const response = (error as AxiosError).response;
      if (response) {
        toast({ status: "error", title: JSON.stringify(response.data) });
      } else {
        toast({ status: "error", title: "Failed to delete the product" });
      }
    }
  };

  return (
    <Flex p={10} align="center" justifyContent="center">
      <VStack>
        <HStack spacing={5}>
          <Heading size={"lg"}>Your products</Heading>
          <IconButton
            onClick={() => setOpenNewProduct(true)}
            icon={<PlusSquareIcon />}
            aria-label={"Add new product"}
          />
        </HStack>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th isNumeric>Cost</Th>
                <Th isNumeric>Amount</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => {
                const { productName, cost, amountAvailable } = product;
                return (
                  <Tr key={product.id}>
                    <Td>{productName}</Td>
                    <Td isNumeric>{cost} €</Td>
                    <Td isNumeric>{amountAvailable}</Td>
                    <Td>
                      <HStack>
                        <IconButton
                          aria-label={"Edit product"}
                          icon={<EditIcon />}
                          onClick={() => {
                            setProduct(product);
                            setOpenEditProduct(true);
                          }}
                        />
                        <IconButton
                          aria-label={"Edit product"}
                          icon={<DeleteIcon />}
                          onClick={() => deleteProduct(product.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
      <Modal isOpen={isOpenNewProduct} onClose={onCloseNewModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add new product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductForm
              isNew={true}
              onClose={onCloseNewModal}
              sellerId={user.id}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenEditProduct} onClose={onCloseEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editproduct</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductForm
              isNew={false}
              onClose={onCloseEditModal}
              sellerId={user.id}
              productId={product ? product.id : undefined}
              defaultValues={product || undefined}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
