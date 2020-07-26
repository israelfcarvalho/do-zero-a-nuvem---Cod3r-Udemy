import mongoose from "mongoose";

export interface MenuItem extends mongoose.Document {
  name: string;
  price: number;
}

export interface RestaurantDocument extends mongoose.Document {
  name: string;
  menu: Array<MenuItem>;
}

const menuSchema = new mongoose.Schema<MenuItem>({
  name: {
    type: String,
    required: [true, "Menu name is requeired!"],
  },
  price: {
    type: Number,
    required: [true, "Menu price is required!"],
  },
});

const restaurantSchema = new mongoose.Schema<RestaurantDocument>({
  name: {
    type: String,
    required: [true, "Restaurant name is required!!"],
  },
  menu: {
    type: [menuSchema],
    select: false,
    default: [],
  },
});

export default mongoose.model<RestaurantDocument>(
  "restaurant",
  restaurantSchema
);
