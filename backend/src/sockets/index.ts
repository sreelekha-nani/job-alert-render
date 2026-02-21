import { Server, Socket } from 'socket.io';
import { verifyToken, TokenPayload } from '../utils/jwt';
import config from '../config';

let io: Server;

export const initSocket = (server: Server) => {
    io = server;

    // Middleware to authenticate socket connections
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: Token not provided'));
        }

        const payload = verifyToken<TokenPayload>(token, config.jwt.accessSecret);
        if (!payload) {
            return next(new Error('Authentication error: Invalid token'));
        }
        
        (socket as any).user = payload;
        next();
    });

    io.on('connection', (socket: Socket) => {
        console.log(`⚡ User connected: ${socket.id}`);
        
        // Join a room specific to the user
        const user = (socket as any).user;
        if (user && user.userId) {
            socket.join(user.userId);
            console.log(`User ${user.email} joined room ${user.userId}`);
        }

        socket.on('disconnect', () => {
            console.log(`🔥 User disconnected: ${socket.id}`);
        });
    });
};

// Emitter function to send events to specific users
export const emitToUser = (userId: string, event: string, data: any) => {
    if (io) {
        io.to(userId).emit(event, data);
    }
};
