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
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "../api/api";
import { fetchProfile } from "../api/api";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const CompleteOrders = () => {
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

  if (isOrderLoading || isProfileLoading) {
    return <p>Loading...</p>;
  }

  if (isOrderError) {
    return <p>Error: {orderError.message}</p>;
  }

  if (isProfileError) {
    return <p>Error: {profileError.message}</p>;
  }

  // const {
  //   data: productData,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["productid"],
  //   queryFn: async () => {
  //     const response = await axios.get("http://localhost:3032/products");
  //     console.log('API response:', response); // Log the entire API response
  //     const products = response.data.products;
  //     console.log('Fetched products:', products); // Log the fetched products
  //     return products || []; // Return an empty array if products is null or undefined
  //   },
  // });

  // Add this line to log product data

  return (
    <div>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Complete Sale Orders</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Customer Name</Th>
              <Th>Price</Th>
              <Th>Date</Th>
              <Th style={{ display: 'flex', justifyContent: 'center' }}>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderData.map((order) => {
              const customerProfile = profileData.find(
                (profile) => profile.customer === order.customer_id
              );
              const totalPrice = order.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              );
              return (
                <Tr key={order.customer_id}>
                  <Td>{order.customer_id}</Td>
                  <Td>
                    <Avatar size="xs" bg="teal.500" mr={2} />
                    {customerProfile
                      ? customerProfile.customer_profile.name
                      : "Unknown"}
                  </Td>
                  <Td>{totalPrice}</Td>
                  <Td>{new Date(order.last_modified).toLocaleString()}</Td>
                  <Td style={{ display: 'flex', justifyContent: 'center' }}>
                    <a href={`/edit/${order.customer_id}`}>
                      <RemoveRedEyeOutlinedIcon />
                    </a>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompleteOrders;
