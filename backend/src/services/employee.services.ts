import { Employee } from "../models/employee.model";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError.utils";

export const getEmployeeByIdService = async (id: string) => {
    const employee = await Employee.findById(id).populate("company_id").select("-password");
    if (!employee) {
        throw new AppError("Employee profile not found", 404);
    }
    return employee;
};

export const updateEmployeeService = async (id: string, updateData: any) => {
    const updatePayload: Record<string, any> = { ...updateData };

    if (updateData.email) {
        const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: id } });
        if (existingUser) {
            throw new AppError("Email is already in use by another account", 400);
        }
    }

    if (updateData.notifications) {
        delete updatePayload.notifications;
        Object.entries(updateData.notifications).forEach(([key, value]) => {
            updatePayload[`notifications.${key}`] = value;
        });
    }

    const employee = await Employee.findByIdAndUpdate(
        id,
        { $set: updatePayload },
        { new: true, runValidators: true }
    ).populate("company_id").select("-password");

    if (!employee) {
        throw new AppError("Employee profile not found", 404);
    }

    return employee;
};

export const deleteEmployeeService = async (id: string) => {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
        throw new AppError("Employee profile not found", 404);
    }
    return employee;
};

export const getAllEmployeesService = async () => {
    return await Employee.find().populate("company_id").select("-password");
};
