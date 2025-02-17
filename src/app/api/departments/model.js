import { Schema, model, models } from "mongoose";

const SectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const DepartmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El departamento debe tener un nombre"],
    },
    sections: {
      type: [SectionSchema],
      name: { type: String, required: true },
      required: false, // Ya no es obligatorio
      default: [], // Valor por defecto: un array vacío
    },
  },
  {
    timestamps: true,
  }
);

export default models.Department || model("Department", DepartmentSchema);
