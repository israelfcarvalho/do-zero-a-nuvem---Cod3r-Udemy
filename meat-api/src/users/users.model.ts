import mongoose from "mongoose";
import {
  emailValidator,
  valueLengthValidator,
  GENDERS,
  validatorGender,
  validatorCPF,
} from "../common/validators";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  cpf: string;
  getPutUpdate: Function;
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: emailValidator,
      message: (props: any) => {
        return `Email '${props.value}' invalid!`;
      },
    },
  },
  password: {
    type: String,
    select: false,
    required: [true, "password is required!"],
    validate: {
      validator: valueLengthValidator(6),
      message: "Password needs to have more than 6 caracters!",
    },
  },
  gender: {
    type: String,
    validate: validatorGender,
    message: (props: any) => {
      return `Invalid gender '${props.value}'. Should be one of [${GENDERS.join(
        ", "
      )}]`;
    },
  },
  cpf: {
    type: String,
    validate: {
      validator: validatorCPF,
      message: (props: any) => {
        return `Cpf '${props.value}' invalid!`;
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
