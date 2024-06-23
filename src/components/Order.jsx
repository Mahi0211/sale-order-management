import {
  TabList,
  Tab,
  Tabs,
  Button,
  Flex,
  Spacer,
  Modal,
  TabPanels,
  TabPanel,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import ActiveOrders from "./ActiveOrders";
import CompleteOrders from "./CompleteOrders";
import { AddIcon } from "@chakra-ui/icons";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Select } from "@chakra-ui/react";
import { fetchId } from "../api/api";

const Order = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();

  const {
    data: productData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchId,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <Tabs size="md" variant="enclosed">
        <TabList as={Flex} alignItems="center">
          <Tab>Active Sale Orders</Tab>
          <Tab>Complete Sale Orders</Tab>
          <Spacer />
          <Button
            leftIcon={<AddIcon w={4} h={4} />}
            colorScheme="teal"
            variant="solid"
            onClick={onOpen}
          >
            Sale Order
          </Button>
        </TabList>
        <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Sale Order</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Select  mb={4}>
                {productData.map((product) => (
                  <option key={product.id} value={product.id} >
                    {product.name}
                  </option>
                ))}
              </Select>
              <Input ref={initialRef} placeholder="Order name" mb={4} />
              <Input placeholder="Customer name" mb={4} />
              <Input placeholder="Order details" mb={4} />
              {/* Add more form fields as needed */}
            </ModalBody>

            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal">Submit</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <TabPanels>
          <TabPanel>
            <ActiveOrders />
          </TabPanel>
          <TabPanel>
            <CompleteOrders />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Order;
