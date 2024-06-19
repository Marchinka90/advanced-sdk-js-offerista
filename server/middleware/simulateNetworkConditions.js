module.exports = ((req, res, next) => {
  // Simulate a random network failure with a 30% chance
  const randomFail = Math.random() < 0.3;

  // Simulate a rate limit exceeded error with a 10% chance
  const rateLimit = Math.random() < 0.1;

   // If randomFail is true, return a 500 status code with an error message
  if (randomFail) {
      return res.status(500).json({ error: 'Simulated network failure' });
  }

  // If rateLimit is true, return a 429 status code with an error message
  if (rateLimit) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
  } 
  
  // If neither randomFail nor rateLimit is true, proceed to the next middleware
  next();
});