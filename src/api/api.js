// import axios from 'axios';

const fetchPosts = async (page) => {
  const response = await fetch(
    `http://localhost:3000/posts?_sort=-id&${
      page ? `_page=${page}&_per_page=5` : ""
    }`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch posts. Status: ${response.status}`);
  }

  const postData = await response.json();
  return postData;
};

const fetchId = async () => {
  const response = await fetch("http://localhost:3032/products");
  const data = await response.json();
  return data;
};

const fetchOrder = async () => {
  const response = await fetch("http://localhost:3033/orders");
  const data = await response.json();
  return data;
};

async function updateOrder(formData) {
  const response = await fetch(`http://localhost:3033/orders/${formData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error('Failed to update order');
  }
  return response.json();
}

const fetchProfile = async () => {
  const response = await fetch("http://localhost:3034/profiles");
  const data = await response.json();
  return data;
};

const addPost = async (post) => {
  const response = await fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  return response.json();
};

// Example fetchId function
// const fetchId = async () => {
//     try {
//       const response = await fetch('/api/products'); // Replace with your API endpoint
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       return data; // Should return an array
//     } catch (error) {
//       throw new Error(`Fetch error: ${error.message}`);
//     }
//   };

export { fetchPosts, addPost, fetchId, fetchOrder, fetchProfile, updateOrder };
