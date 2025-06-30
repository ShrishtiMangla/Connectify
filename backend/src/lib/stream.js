import {StreamChat} from 'stream-chat';
import "dotenv/config";


const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUser(userData);//upsert - if user exists, update it, otherwise create a new user
        return userData
    }catch (error) {
        console.error("Error upserting stream user: ",error);
    }
};

//do it later

export const generateStreamToken = (userId) => {};