"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const chatUsers_1 = require("./users/chatUsers");
dotenv_1.default.config();
// Setup server
const app = (0, express_1.default)(); //Setup Express
const server = require("http").createServer(app);
const io = new socket_io_1.Server(server);
// Configure server
app.use(express_1.default.json()); //Body parser
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
// Connecte to database with STRING_URI
const db = `${process.env.MONGO_URI}`;
mongoose_1.default
    .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
})
    .then(() => console.log("[S:01] Database Connected"))
    .catch((err) => console.log(err));
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static("../../client/build"));
}
// Endpoint for testing server
app.get("/test/server", (req, res) => {
    res.json({ status: "server is working..." });
});
// passport setup
require("./passport");
app.use((0, cookie_session_1.default)({ name: "memorya-session", keys: [`${process.env.SESSION_SECRET}`], maxAge: 10 * 60 * 1000 }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/auth", require("./routes/api/auth")); // Route for authentication using social media
app.use("/api/items", require("./routes/api/items")); // Route for CRUD an Item
app.use("/api/records", require("./routes/api/record")); // Route for CRUD a Record
app.use("/api/userz", require("./routes/api/userz")); // Route for CRUD a Userz
// app.use("/api/users", require("./routes/api/users")); // Route for login, signup, and userData
// app.use("/room", require("./routes/api/room")); //Route for Creating forum and handling messages
app.use("/api/bug", require("./routes/api/bug")); // Route for CRUD a bug
app.use("/api/report", require("./routes/api/report")); // Route for CRUD a report
app.use("/api/comment", require("./routes/api/comment")); // Route for CRUD a comment
app.use("/api/user-archive", require("./routes/api/userArchive")); // Route for CRUD a user-archive
app.use("/api/featured-memory", require("./routes/api/featuredMemory")); // Route for CRUD a featured-memory
app.use("/api/compiled-memory", require("./routes/api/compiledMemory")); // Route for CRUD a compiled-memory
app.use("/api/user-access", require("./routes/api/userAccess")); // Route for CRUD a user-access
// handle socket connection
io.on("connection", (socket) => {
    // handle the newly joined client by sending previous messages and greating & notifying everyone that new client has joined
    socket.on("join-chat", ({ username, roomName, messages }) => {
        console.log(">>>>>"); // Config: white seperator
        console.log("|Chat-Join|", "RoomName:", roomName, "username", username);
        (0, chatUsers_1.addUser_chat)({ userID: socket.id, username, roomName }); // adding user to the array of active user
        socket.join(roomName); // Client joining a specific room
        // console.log(messages);
        // Emitting chat history to newly joined client
        socket.emit("serverInitialMessages", messages);
        const date = new Date();
        // Emitting greating message to newly joined client
        socket.emit("serverMessage", {
            username: "BanBot",
            message: `You joined the chat ${roomName}!`,
            date,
        });
        // Emitting notify message to everyone on the room that there's a new client that joined
        socket.broadcast.to(roomName).emit("serverMessage", {
            username: "BanBot",
            message: `${username} joined the chat!`,
            date,
        });
        // Emitting current active users in the room
        io.to(roomName).emit("activeUsers", {
            users: (0, chatUsers_1.getUsersInRoom_chat)(roomName),
        });
        console.log("|Chat-Joined|", "videoRooms:", (0, chatUsers_1.getUsersInRoom_chat)(roomName)); // Config: updated videoRoom array after user joined video call
        console.log(""); // Config: white seperator
    });
    // Handle sent message from client then emitting the message to everyone in the room
    socket.on("clientSendMessage", ({ username, message, date }) => {
        const user = (0, chatUsers_1.getUser_chat)(socket.id);
        if (user)
            io.to(user.roomName).emit("serverMessage", {
                username,
                message,
                date,
            });
    });
    // Handle the disconnected client || Handle client leaving the room
    socket.on("disconnect", () => {
        console.log(">>>>>"); // Config: white seperator
        console.log("|Chat leaved|", socket.id); // Config: user leaving video call
        // checking if the user exist
        const user = (0, chatUsers_1.getUser_chat)(socket.id);
        if (user) {
            // Emitting notify message to everyone on the room that the client left the room
            const date = new Date(); // Current date
            socket.broadcast.to(user.roomName).emit("serverMessage", {
                username: "BanBot",
                message: `${user.username} left the chat!`,
                date,
            });
            (0, chatUsers_1.removeUser_chat)(user.userID); // removing the user from the chatRoom array
            // Emitting current active users in the room
            io.to(user.roomName).emit("activeUsers", {
                users: (0, chatUsers_1.getUsersInRoom_chat)(user.roomName),
            });
            console.log(""); // Config: white seperator
        }
    });
});
// Get the index file of the client-side build
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "..", "..", "client", "build", "index.html"));
});
// Deploying server to available port
const PORT = process.env.PORT || 443;
server.listen(PORT, () => console.log(`[S:00] server started at port ${PORT}`));
