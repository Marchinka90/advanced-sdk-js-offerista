/**
 * Stores data in the browser's localStorage with a specified expiry time.
 * @param {string} key - The key under which the data will be stored.
 * @param {any} data - The data object or value to be cached.
 * @param {number} ttl - Time-to-live for the cache in milliseconds.
 */
export const setCache = (key, data, ttl) => {
  // Get the current timestamp in milliseconds
  const now = Date.now();

  // Create an object with the data and its expiry timestamp
  const item = {
    data,
    expiry: now + ttl
  };

  // Store the item in localStorage after converting it to a JSON string
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Retrieves cached data from localStorage if it's not expired.
 * @param {string} key - The key used to retrieve the cached data.
 * @returns {any} The cached data if valid and not expired, otherwise null.
 */
export const getCache = (key) => {
  // Retrieve the cached item as a JSON string from localStorage
  const itemStr = localStorage.getItem(key);

  // If no item found for the key, return null
  if (!itemStr) {
    return null;
  }

  // Parse the JSON string into an object
  const item = JSON.parse(itemStr);

  // Get the current timestamp in milliseconds
  const now = Date.now();

  // Check if the cached item is expired
  if (now > item.expiry) {
    // Remove the expired item from localStorage
    localStorage.removeItem(key);
    // Return null indicating expired cache
    return null;
  }
  // Return the valid cached data
  return item.data;
};
