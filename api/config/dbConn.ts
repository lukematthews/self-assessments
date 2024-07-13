import mongoose from "mongoose";

export async function connectDB() {
    try {
        const db = await mongoose.connect(process!.env!.DATABASE_URI!, {});
        console.log(db.connection.collections);
    } catch (err) {
        console.error(err);
    }
}