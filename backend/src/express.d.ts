
declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
            password?: string;
            name?: string | null;
            googleId?: string | null;
            createdAt: Date;
            updatedAt: Date;
        }

        interface Request {
            user?: User;
        }
    }
}
