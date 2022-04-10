import path from "path";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import passport from "passport";

import { addUser_chat, getUser_chat, removeUser_chat, getUsersInRoom_chat } from "./users/chatUsers";

dotenv.config();

// Setup server
const app = express(); //Setup Express
const server = require("http").createServer(app);
const io = new Server(server);

// Configure server
app.use(express.json()); //Body parser
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

// Connecte to database with STRING_URI
const db = `${process.env.MONGO_URI}`;
mongoose
	.connect(db, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	})
	.then(() => console.log("[S:01] Database Connected"))
	.catch((err: any) => console.log(err));

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static("../../client/build"));
// }

// Temporarily remove the checking for prod env
app.use(express.static("../../client/build"));

// Endpoint for testing server
app.get("/test/server", (req, res) => {
	res.json({ status: "server is working..." });
});

// passport setup
require("./passport");
app.use(cookieSession({ name: "memorya-session", keys: [`${process.env.SESSION_SECRET}`], maxAge: 10 * 60 * 1000 }));
app.use(passport.initialize());
app.use(passport.session());

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
io.on("connection", (socket: any) => {
	// handle the newly joined client by sending previous messages and greating & notifying everyone that new client has joined
	socket.on("join-chat", ({ username, roomName, messages }: any) => {
		console.log(">>>>>"); // Config: white seperator
		console.log("|Chat-Join|", "RoomName:", roomName, "username", username);

		addUser_chat({ userID: socket.id, username, roomName }); // adding user to the array of active user
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
			users: getUsersInRoom_chat(roomName),
		});

		console.log("|Chat-Joined|", "videoRooms:", getUsersInRoom_chat(roomName)); // Config: updated videoRoom array after user joined video call
		console.log(""); // Config: white seperator
	});

	// Handle sent message from client then emitting the message to everyone in the room
	socket.on("clientSendMessage", ({ username, message, date }: any) => {
		const user = getUser_chat(socket.id);
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
		const user = getUser_chat(socket.id);
		if (user) {
			// Emitting notify message to everyone on the room that the client left the room
			const date = new Date(); // Current date
			socket.broadcast.to(user.roomName).emit("serverMessage", {
				username: "BanBot",
				message: `${user.username} left the chat!`,
				date,
			});

			removeUser_chat(user.userID); // removing the user from the chatRoom array

			// Emitting current active users in the room
			io.to(user.roomName).emit("activeUsers", {
				users: getUsersInRoom_chat(user.roomName),
			});
			console.log(""); // Config: white seperator
		}
	});
});

// Get the index file of the client-side build
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "..", "..", "client", "build", "index.html"));
});

// Deploying server to available port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`[S:00] server started at port ${PORT}`));
