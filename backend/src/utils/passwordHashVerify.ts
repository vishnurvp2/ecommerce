import bcrypt from "bcryptjs";

// 12 rounds is the recommended baseline for modern hardware
const SALT_ROUNDS = 12;

// Function to securely hash a password during user signup
async function hashPassword(plainTextPassword: string) {
  try {
    // Generates salt and hashes the password in a single step
    const hashedPassword = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

// Function to verify a password during login
async function verifyPassword(
  plainTextPassword: string,
  hashedPasswordFromDb: string,
) {
  try {
    // Compares the input against the stored hash and returns a boolean
    const isMatch = await bcrypt.compare(
      plainTextPassword,
      hashedPasswordFromDb,
    );
    return isMatch;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

export { hashPassword, verifyPassword };
