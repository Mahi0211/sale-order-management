import { useState } from "react";
import {
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchOrder, fetchProfile, updateOrder } from "../api/api";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

const ActiveOrders = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const {
    data: orderData,
    isError: isOrderError,
    isLoading: isOrderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrder,
  });

  const {
    data: profileData,
    isError: isProfileError,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfile,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateOrder,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
        exact: true,
      });
    },
  });

  const watchedValues = watch();

  const onSubmit = async (formData) => {
    await mutate(formData); // Call the mutate function with formData to update the order
    reset(formData); // Reset the form after submission
  };

  const updateFormValue = (name, value) => {
    setValue(name, value); // Set value in React Hook Form
  };

  const openModal = (order, readOnly) => {
    setSelectedOrder(order);
    setIsReadOnly(readOnly);
    reset(order); // Prefill the form with order details
    onOpen();
  };

  if (isOrderLoading || isProfileLoading) {
    return <p>Loading...</p>;
  }

  if (isOrderError) {
    return <p>Error: {orderError.message}</p>;
  }

  if (isProfileError) {
    return <p>Error: {profileError.message}</p>;
  }

  return (
    <div>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Active Orders</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Customer Name</Th>
              <Th>Total Price</Th>
              <Th>Invoice Date</Th>
              <Th>Edit/View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderData.map((order) => {
              const customerProfile = profileData.find(
                (profile) => profile.customer_profile.id === order.customer_id
              );
              const totalPrice = order.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              );
              return (
                <Tr key={order.id}>
                  <Td>{order.customer_id}</Td>
                  <Td>
                    <Avatar size="xs" bg="teal.500" mr={2} />
                    {customerProfile
                      ? customerProfile.customer_profile.name
                      : "Unknown"}
                  </Td>
                  <Td>{totalPrice}</Td>
                  <Td>{new Date(order.invoice_date).toLocaleString()}</Td>
                  <Td style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={() => openModal(order, false)}>
                      <MoreHorizOutlinedIcon />
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                  <FormLabel>Customer ID</FormLabel>
                  <Input
                    {...register("customer_id")}
                    readOnly={isReadOnly}
                    onChange={(e) => updateFormValue("customer_id", e.target.value)}
                  />
                </FormControl>
                {watch("items") && watch("items").map((item, index) => (
          <div key={index}>
            <FormControl>
              <FormLabel>Item SKU ID</FormLabel>
              <Input
                {...register(`items[${index}].sku_id`)}
                defaultValue={item.sku_id}
                readOnly={isReadOnly}
                onChange={(e) => updateFormValue(`items[${index}].sku_id`, e.target.value)}
              />
                    </FormControl>
                    <div style={{ display: "flex" }}>
                      <FormControl>
                        <FormLabel>Price</FormLabel>
                        <Input
                          {...register(`items[${index}].price`)}
                          defaultValue={item.price}
                          isReadOnly={isReadOnly}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          {...register(`items[${index}].quantity`)}
                          defaultValue={item.quantity}
                          isReadOnly={isReadOnly}
                        />
                      </FormControl>
                    </div>
                  </div>
                ))}
                <FormControl>
                  <FormLabel>Paid</FormLabel>
                  <Select
                    {...register("paid")}
                    defaultValue={selectedOrder.paid}
                    isReadOnly={isReadOnly}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Invoice Number</FormLabel>
                  <Input
                    {...register("invoice_no")}
                    defaultValue={selectedOrder.invoice_no}
                    isReadOnly={isReadOnly}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Invoice Date</FormLabel>
                  <Input
                    {...register("invoice_date")}
                    defaultValue={selectedOrder.invoice_date}
                    isReadOnly={isReadOnly}
                  />
                </FormControl>
                {!isReadOnly && (
                  <Button type="submit" mt={4}>
                    Save
                  </Button>
                )}
              </form>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ActiveOrders;

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { fetchPosts, fetchTags, addPost } from "../api/api";
// // import NewSaleOrder from "./NewSaleOrder";

// const ActiveOrders = () => {
//   const {
//     data: postData,
//     isError: isPostsError,
//     isLoading: isPostsLoading,
//     error: postsError,
//   } = useQuery({
//     queryKey: ["posts"],
//     queryFn: fetchPosts,
//   });

//   const {
//     data: tagData,
//     isError: isTagsError,
//     isLoading: isTagsLoading,
//     error: tagsError,
//   } = useQuery({
//     queryKey: ["tags"],
//     queryFn: fetchTags,
//   });

//   const queryClient = useQueryClient();

//   const {
//     mutate,
//     isPending,
//     isError: isPostError,
//     // error: postError,
//     reset,
//   } = useMutation({
//     mutationFn: addPost,
//     onMutate: () => {
//       return { id: 1 };
//     },
//     onSuccess: (data, variables, context) => {
//       queryClient.invalidateQueries({
//         queryKey: ["posts"],
//         exact: true,
//       });
//     },
//   });

//   const handleSubmit = (e) => {
//     event.preventDefault();
//     const formData = new FormData(e.target);
//     const title = formData.get("title");
//     const tags = Array.from(formData.keys()).filter(
//       (key) => formData.get(key) === "on"
//     );
//     if (!title || !tags) return;
//     mutate({ id: postData.length + 1, title, tags });
//     e.target.reset();
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Enter your post..." name="title" />
//         <div>
//           {isTagsLoading && <p>Loading tags...</p>}
//           {isTagsError && <p>{tagsError?.message}</p>}

//           {tagData &&
//             tagData.map((tag) => (
//               <div key={tag}>
//                 <input type="checkbox" name={tag} id={tag} />
//                 <label htmlFor={tag}>{tag}</label>
//               </div>
//             ))}
//         </div>
//         <button type="submit">Post</button>
//       </form>
//       {/* <NewSaleOrder /> */}
//       {isPostsLoading && isPending && <p>Loading posts...</p>}
//       {isPostsError && <p>{postsError?.message}</p>}
//       {isPostError && <p onClick={() => reset}>Unable to post</p>}

//       {postData &&
//         postData.map((post) => (
//           <div key={post.id}>
//             <div>{post.title}</div>
//             {post.tags && post.tags.map((tag) => <span key={tag}>{tag}</span>)}
//           </div>
//         ))}
//     </div>
//   );
// };

// export default ActiveOrders;
