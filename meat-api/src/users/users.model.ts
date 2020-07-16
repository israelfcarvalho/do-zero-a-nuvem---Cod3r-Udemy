import mongoose from 'mongoose';

export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false,
        post: (doc: User) => {console.log()}
    }
})

export default mongoose.model<User>('user', userSchema);