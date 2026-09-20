import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // fail after 10s if can't reach Atlas
            socketTimeoutMS: 45000,          // close idle sockets after 45s
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        return conn
    } catch (error) {
        // Used to process.exit(1), which took the whole API down (including
        // the code-only demo login) whenever Atlas was unreachable. Now we
        // degrade gracefully instead: DB-backed features (register, profile)
        // are unavailable, everything else keeps working.
        console.error(`MongoDB connection failed: ${error.message}`)
        console.error(
            "→ Checklist: (1) your IP is whitelisted in Atlas → Network Access; " +
            "(2) the MONGO_URI password is correct — replace <db_password> with your real password; " +
            "(3) special characters in the password are URL-encoded (e.g. @ → %40)."
        )
        console.error("Server continuing WITHOUT a database — demo login still works.")
        return null
    }
}

export default connectDB
