import { connect, set } from 'mongoose';


export const connectToDB = async () => {
  try {
    set('strictQuery', false);
    const db = await connect('mongodb://localhost:27017/ChatDB' as string);
    console.log('MongoDB connected to', db.connection.name);
    // Emit an event when the connection is successful
  } catch (error) {
    console.error(error);
    // Emit an event when there's an error
  }
};