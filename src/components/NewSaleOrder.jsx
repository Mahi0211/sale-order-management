import { useQuery } from 'react-query';
import { fetchId } from "../api/api"; // Assuming correct path to fetchId function
import { Select } from "@chakra-ui/react";

const NewSaleOrder = () => {
  const {
    data: orderIdData,
    isError: isOrderIdError,
    isLoading: isOrderIdLoading,
    error: orderIdError,
  } = useQuery("ids", fetchId); // Pass queryKey as string and fetchId function

  return (
    <div>
      {isOrderIdLoading && <p>Loading tags...</p>}
      {isOrderIdError && <p>Error: {orderIdError?.message}</p>}
      {!isOrderIdLoading && !isOrderIdError && (
        <Select placeholder="Select option">
          {orderIdData.map((order) => (
            <option key={order.id} value={order.id}>
              {order.id}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default NewSaleOrder;
