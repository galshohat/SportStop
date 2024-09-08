import fetch from "node-fetch";
import chalk from "chalk";

const baseUrl = "http://localhost:8000/api/v1";
const testUser = {
  name: "Test User",
  email: "example@gmail.com",
  password: "AAAAAAA1",
  phone: "1234567890",
  street: "123 Test St",
  city: "Test City",
  country: "Test Country",
  profilePicture:
    "data:image/png;base64,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",
};

let userId = null;
let orderId = null;
let orderItemId = null;
let sizeId = null;
let totalTests = 15;
let passedTests = 0;

const logResult = (testNumber, testName, passed, data = null, error = null) => {
  const status = passed ? chalk.green("Completed") : chalk.red("Failed");
  console.log(`${testNumber}. ${testName} - Status: ${status}`);
  if (data) console.log(chalk.cyan("Data:"), data);
  if (error) console.log(chalk.red("Error:"), error);
  
  if (passed) {
    passedTests++;
  }
};

async function runTest(testName, testNumber, testFunction) {
  console.log(`Running Test ${testNumber}: ${testName}`);
  try {
    const data = await testFunction();
    logResult(testNumber, testName, true, data);
  } catch (error) {
    logResult(testNumber, testName, false, null, error.message);
  }
  console.log("\n");
}

async function testCreateInvalidUser() {
  const res = await fetch(`${baseUrl}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...testUser, email: "invalid-email" }),
  });
  if (res.ok) throw new Error("User creation should have failed");
  return res.text();
}

async function testCreateUser() {
  const res = await fetch(`${baseUrl}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testUser),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  userId = data._id;
  return JSON.stringify(data, null, 2);
}

async function testLogin() {
  const res = await fetch(`${baseUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return JSON.stringify(data, null, 2);
}

async function testAddItemToCart() {
  const res = await fetch(`${baseUrl}/users/cart/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: "66d0674a43f8595153eb3a89",
      quantity: 1,
    }),
    credentials: "include",
  });
  const data = await res.json();
  orderItemId = data.orderItem;
  if (!res.ok) throw new Error(data.message);
  return JSON.stringify(data, null, 2);
}

async function testDeleteItemFromCart() {
  const res = await fetch(
    `${baseUrl}/users/cart-items/${userId}/${orderItemId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to delete item from cart");
  return "Item deleted successfully";
}

async function testAddOutOfStockItemToCart() {
  try {
    const res = await fetch(`${baseUrl}/users/cart/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "66d0674a43f8595153eb3a89",
        quantity: 5000,
      }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.status !== 400 || !data.message.includes("stock")) {
      throw new Error(
        data.message || "Unexpected response, stock error not triggered"
      );
    }
    return `Expected out-of-stock error received: ${data.message}`;
  } catch (error) {
    throw new Error(
      `Failed to test adding out-of-stock item: ${error.message}`
    );
  }
}

async function testMakePurchase() {
  const res = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderItems: [
        { product: { id: "66d0674a43f8595153eb3a89" }, quantity: 1 },
      ],
      shippingAddress: "123 Test St",
      city: "Test City",
      country: "Test Country",
      phone: "1234567890",
      user: userId,
      token: "111111111111",
      stars: 0,
      discount: 0,
      couponCode: "",
    }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  orderId = data.order._id;
  return JSON.stringify(data, null, 2);
}

async function testEditAccount() {
  const res = await fetch(`${baseUrl}/users/update/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Updated Test User" }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return JSON.stringify(data, null, 2);
}

async function testChangeCurrency() {
  const res = await fetch(`${baseUrl}/users/change-currency/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currency: "USD" }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return JSON.stringify(data, null, 2);
}

async function testPurchaseCouponWithoutEnoughStars() {
  const res = await fetch(`${baseUrl}/users/${userId}/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      couponCode: "DISCOUNT10",
      discount: 0.1,
      stars: 500,
    }),
    credentials: "include",
  });
  const data = await res.json();
  if (res.ok)
    throw new Error(
      "Coupon purchase should have failed due to insufficient stars"
    );
  return `Error message received: ${data.message}`;
}

async function testCreateNewSize() {
  const res = await fetch(`${baseUrl}/sizes/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "XX Large", value: "XXL" }),
  });
  const data = await res.json();
  sizeId = data._id;
  if (!res.ok) throw new Error(data.message);
  console.log("New size created:", data);
  return JSON.stringify(data, null, 2);
}

async function testCreateDuplicateSize() {
  const res = await fetch(`${baseUrl}/sizes/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "XX Small", value: "XXL" }),
  });
  const data = await res.json();
  if (res.ok) throw new Error("Creating a duplicate size should have failed");
  return `Expected error received: ${data.message}`;
}

async function testDeleteSize() {
  const res = await fetch(`${baseUrl}/sizes/${sizeId}/admin`, {
      method: "DELETE",
      credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  console.log("Size deleted:", data);
  return JSON.stringify(data, null, 2);
}

async function testDeleteUserAccount() {
  await cleanUpOrder();

  const res = await fetch(`${baseUrl}/users/delete-account/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to delete user account");

  console.log("User account deleted successfully.");
  return "User account deleted successfully";
}

async function testSendMessageWithOrderToken() {
  if (!orderId) throw new Error("Order ID is missing from previous tests");

  const res = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: orderId,
      sender: "user",
      text: "This is a test message for the order.",
    }),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to send message");

  console.log("Sent message:", data);
  return JSON.stringify(data, null, 2);
}

async function cleanUpOrder() {
  if (!orderId) return;

  const res = await fetch(`${baseUrl}/orders/${orderId}/admin`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Failed to delete order: ${data.message}`);
}

async function runTests() {
  await runTest(
    "Fail to create user with invalid email/password",
    1,
    testCreateInvalidUser
  );
  await runTest("Create a user", 2, testCreateUser);
  await runTest("Login with created user", 3, testLogin);
  await runTest("Add an item to cart", 4, testAddItemToCart);
  await runTest(
    "Add item to cart with out-of-stock quantity",
    5,
    testAddOutOfStockItemToCart
  );
  await runTest("Delete an item from the cart", 6, testDeleteItemFromCart);
  await runTest("Make a purchase", 7, testMakePurchase);
  await runTest(
    "Attempt to purchase coupon without enough stars",
    8,
    testPurchaseCouponWithoutEnoughStars
  );
  await runTest("Edit account details", 9, testEditAccount);
  await runTest("Change currency", 10, testChangeCurrency);
  await runTest(
    "Sending Order Chat Message",
    11,
    testSendMessageWithOrderToken
  );
  await runTest("Create a new size named 'XX Large'", 12, testCreateNewSize);
  await runTest("Attempt to create a duplicate size named 'XX Large'", 13, testCreateDuplicateSize);
  await runTest("Delete the size named 'XX Large'", 14, testDeleteSize);
  await runTest("Delete the created user", 15, testDeleteUserAccount);

  console.log(
    `Final Status: ${chalk.blue(passedTests)}/${totalTests} tests completed`
  );
  if (passedTests === totalTests) {
    console.log(chalk.green("All tests completed successfully."));
  } else {
    console.log(chalk.red("Some tests failed."));
  }
}

runTests();
