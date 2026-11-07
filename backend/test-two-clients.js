import { io } from "socket.io-client";

const tokenA = process.env.TOKEN_A; // Owner
const tokenB = process.env.TOKEN_B; // Collaborator
const diagramId = process.env.DIAGRAM_ID;

if (!tokenA || !tokenB || !diagramId) {
    console.error("Missing TOKEN_A, TOKEN_B or DIAGRAM_ID");
    process.exit(1);
}

const userA = io("http://localhost:5000", {
    extraHeaders: { Cookie: `token=${tokenA}` }
});

const userB = io("http://localhost:5000", {
    extraHeaders: { Cookie: `token=${tokenB}` }
});

userA.on("diagram:user-joined", (data) => {
    console.log("OWNER RECEIVED JOIN:", data);

    userB.emit("diagram:leave", { diagramId }, (response) => {
        console.log("COLLABORATOR LEAVE:", response);
    });
});

userA.on("diagram:user-left", (data) => {
    console.log("OWNER RECEIVED LEAVE:", data);

    console.log("PRESENCE TEST PASSED");
    userA.disconnect();
    userB.disconnect();
});

userA.on("connect", () => {
    console.log("OWNER CONNECTED");

    userA.emit("diagram:join", { diagramId }, (response) => {
        console.log("OWNER JOIN:", response);

        if (!response.success) {
            userA.disconnect();
            userB.disconnect();
        }
    });
});

userB.on("connect", () => {
    console.log("COLLABORATOR CONNECTED");

    userB.emit("diagram:join", { diagramId }, (response) => {
        console.log("COLLABORATOR JOIN:", response);
    });

});

userA.on("connect_error", (err) => console.log("OWNER ERROR:", err.message));
userB.on("connect_error", (err) => console.log("COLLABORATOR ERROR:", err.message));

userA.on("presence:update", (data) => {
    console.log("OWNER PRESENCE UPDATE:", data);
});
userB.on("presence:update", (data) => {
    console.log("COLLABORATOR PRESENCE UPDATE:", data);
});