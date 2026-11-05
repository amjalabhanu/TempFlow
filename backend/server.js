import dotenv from 'dotenv';
import app from './src/app.js';
import prisma from "./src/config/database.js";

dotenv.config();

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server running hurrayy! on port ${PORT}`);
});
const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`);

    server.close(async () => {
        await prisma.$disconnect();
        console.log("Database disconnected.");
        process.exit(0);
    });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));