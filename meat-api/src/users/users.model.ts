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
        select: false
    }
})

userSchema.post('save', function(this: Partial<User>, user: User){
    this.password = undefined;
})

export default mongoose.model<User>('user', userSchema);