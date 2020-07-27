import mongoose from "mongoose";
import { valueLengthValidator } from "../common/validators";
import restaurantsModel, {
  RestaurantDocument,
} from "../restaurants/restaurants.model";
import usersModel, { UserDocument } from "../users/users.model";

export interface ReviewDocument extends mongoose.Document {
  date: Date;
  rating: Number;
  comments: String;
  restaurant: mongoose.Types.ObjectId | RestaurantDocument;
  user: mongoose.Types.ObjectId | UserDocument;
}

const reviewSchema = new mongoose.Schema<ReviewDocument>({
  date: {
    type: Date,
    required: [true, "Review Date is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required!"],
  },
  comments: {
    type: String,
    required: [true, "Comments is required!"],
    validate: {
      validator: valueLengthValidator(0, 500),
      message: "Comment can't have more than 500 caracters",
    },
  },
  restaurant: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "Restaurant 'ID' is required"],
    ref: restaurantsModel,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "User 'ID' is required"],
    ref: usersModel,
  },
});

export default mongoose.model<ReviewDocument>("review", reviewSchema);
