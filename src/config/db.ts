import mongoose from "mongoose";
import colors from "colors"

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL!)
        const url =`${connection.connection.host}:${connection.connection.port}`
        console.log(colors.magenta.bold(`MongoDB conectado en: ${url}`));
        
    } catch (error) {
        console.log("----------------------".bgRed.dim)
        console.log(error.message)
        console.log("Error al conectar a MongoDB".red.bold)
        console.log("----------------------".bgRed.dim)
        process.exit(1)
    }
}