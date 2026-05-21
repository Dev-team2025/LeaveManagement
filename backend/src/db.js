import mongoose from 'mongoose'

export async function connectToDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error('Missing MONGODB_URI')
  }

  mongoose.set('strictQuery', true)
  
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
  }

  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUri, options)
    console.log('Connected to MongoDB successfully.')
  } catch (err) {
    console.error('MongoDB connection error details:', err.message)
    if (err.message.includes('ETIMEOUT') || err.message.includes('querySrv')) {
      console.error('HINT: This looks like a DNS or Network issue. Try using a local MongoDB or check your VPN/Firewall.')
    }
    throw err
  }
}

