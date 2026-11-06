import express from "express";
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { authLimiter } from "./middleware/rateLimiter.js";
import diagramRoutes from "./routes/diagramRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";



const app=express();

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.status(200).json({
        message: "Server running healthy"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/diagrams", diagramRoutes);
app.use("/api/diagrams", invitationRoutes);


// Centralized error handler - always register last
app.use(errorHandler);
export default app;