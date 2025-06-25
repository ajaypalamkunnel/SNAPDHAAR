import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import router from "./routes/router";
dotenv.config();
const app = express();

const PORT = process.env.PORT;

const LOCALORGIN = process.env.LOCALORGIN
const VERCELORGIN = process.env.VERCELORGIN


const allowedOrigins = [LOCALORGIN, VERCELORGIN];


app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

app.use(express.json({limit:"100mb"}))
app.use(express.urlencoded({limit:"100mb",extended:true}))

app.get('/test',(req,res)=>{
    res.send("Hello snapDhaar backend")
})

app.use("/",router)

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}✅`);
        });
    } catch (error) {
        console.error("Failed to connect server ❌", error);
    }
};

startServer();
