export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize Node.js instrumentations
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Initialize Edge runtime instrumentations
  }
}
