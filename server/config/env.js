/**
 * Environment variable validation.
 * Ensures all required variables are present before starting the server.
 */

const validateEnv = () => {
  const requiredEnv = ["GROQ_API_KEY", "JWT_SECRET", "MONGO_URI"];
  const missingEnv = requiredEnv.filter(key => !process.env[key]);

  if (missingEnv.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingEnv.forEach(key => console.error(`   - ${key}`));
    console.error("\nPlease check your .env file and try again.");
    process.exit(1);
  }
};

module.exports = validateEnv;
