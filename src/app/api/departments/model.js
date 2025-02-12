import { Schema, model, models } from "mongoose";

const SectionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

const DepartmentSchema = new Schema({
    name: {
        type: String,
        required: [true, "El departamento debe tener un nombre"],
    },
    sections: {
        type: [SectionSchema],
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: "El departamento debe tener al menos una sección",
        },
    }
}, {
    timestamps: true
});

export default models.Department || model("Department", DepartmentSchema);
