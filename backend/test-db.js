import prisma from "./src/config/database.js";

async function testConnection() {
    try {
        await prisma.$connect();

        const result = await prisma.$queryRaw`SELECT 1`;

        console.log("PostgreSQL connected successfully!");
        console.log(result);
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();