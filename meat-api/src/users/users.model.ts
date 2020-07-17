import mongoose from 'mongoose';

export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    getPutUpdate: Function
}

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: true,
        validate: {
            validator: (v: string) => {return v.length > 4},
            message: 'Password needs to have more than 6 caracters!'
        },
    },
})

userSchema.methods.getPutUpdate = function(this: User){
    const schemaFields = Object.keys(this.schema.obj);
    const unset: any = {};
    const update: any = {_id: this._id} 

    schemaFields.forEach(schemaField => {
        const isSet = !!this.get(schemaField);
        
        if(isSet){
            update[schemaField] = this.get(schemaField);
        } else {
            unset[schemaField] = '';
        }
    })

    return {
        $unset: unset,
        ...update
    }
}

userSchema.post('save', function(this: Partial<User>, user: User){
    this.password = undefined;
});

export default mongoose.model<User>('user', userSchema);