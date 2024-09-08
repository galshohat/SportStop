import { promises as fs } from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

const API_BASE_URL = 'http://localhost:8000'; 
const USERS_FILE_PATH = './dataPersistence.json'; 


function fetchData(path) {
  return new Promise((resolve, reject) => {
    http.get(`${API_BASE_URL}${path}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

     
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(
            new Error(
              `Failed to fetch data from ${path}. Status code: ${res.statusCode}`
            )
          );
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// for non-admin users.
async function fetchAndSaveUsersWithPurchases() {
  try {

    const users = await fetchData('/api/v1/users');


    const filteredUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      street: user.street,
      city: user.city,
      country: user.country,
      stopPoints: user.stopPoints,
      LoginActivity: user.LoginActivity,
      cart: user.cart,
    }));

    for (const user of filteredUsers) {

      const purchases = await fetchData(`/api/v1/orders/${user.id}`);
      user.purchases = purchases.orders;
    }

    await fs.writeFile(USERS_FILE_PATH, JSON.stringify(filteredUsers, null, 2));
    console.log('Users with purchases data saved to dataPersistence.json');
  } catch (error) {
    console.error('Error fetching and saving users with purchases:', error);
  }
}

export async function initializeDataPersistence() {
  await fetchAndSaveUsersWithPurchases();
}

if (path.basename(fileURLToPath(import.meta.url)) === path.basename(process.argv[1])) {
  initializeDataPersistence();
}