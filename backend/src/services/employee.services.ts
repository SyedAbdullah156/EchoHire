import { Employee } from "../models/employee.model";
import { AppError } from "../utils/AppError.utils";

export const createEmployeeService = async (employeeData: any) => {
    // This might not be needed if they register via auth.services.ts
    // but we can keep it for manual creation if necessary.
    const employee = await Employee.create(employeeData);
    return employee;
};

export const getEmployeeByIdService = async (id: string) => {
    const employee = await Employee.findById(id).populate("company_id").select("-password");
    if (!employee) {
        throw new AppError("Employee profile not found", 404);
    }
    return employee;
};

export const updateEmployeeService = async (id: string, updateData: any) => {
    const updatePayload: Record<string, any> = { ...updateData };

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
