import mongoose from "mongoose";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  getPutUpdate: Function;
}

const GENDERS = ["Female", "Male"];

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: [true, "name is required!"],
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (value: string) => {
        return RegExp(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ).test(value);
      },
      message: (error: any) => {
        return `Email '${error.value}' invalid!`;
      },
    },
  },
  password: {
    type: String,
    select: false,
    required: [true, "password is required!"],
    validate: {
      validator: (v: string) => {
        return v.length > 4;
      },
      message: "Password needs to have more than 6 caracters!",
    },
  },
  gender: {
    type: String,
    validate: {
      validator: (value: string) => {
        return GENDERS.includes(value);
      },
      message: (error: any) => {
        return `Invalid gender '${
          error.value
        }'. Should be one of [${GENDERS.join(", ")}]`;
      },
    },
  },
});

userSchema.methods.getPutUpdate = function (this: User) {
  const schemaFields = Object.keys(this.schema.obj);
  const unset: any = {};
  const update: any = { _id: this._id };

  schemaFields.forEach((schemaField) => {
    const isSet = !!this.get(schemaField);

    if (isSet) {
      update[schemaField] = this.get(schemaField);
    } else {
      unset[schemaField] = "";
    }
  });

  return {
    $unset: unset,
    ...update,
  };
};

userSchema.post("save", function (this: Partial<User>) {
  this.password = undefined;
});

export default mongoose.model<User>("user", userSchema);
