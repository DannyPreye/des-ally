import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

// Validation Schema
const UserSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Too Short!")
        .max(50, "Too Long!")
        .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string()
        .oneOf(["viewer", "manager", "admin"], "Invalid role")
        .required("Role is required"),
    status: Yup.string()
        .oneOf(["active", "inactive", "pending"], "Invalid status")
        .required("Status is required"),
});

const AddUserModal = ({
    tenantId,
    onUserAdded,
}: {
    tenantId: string;
    onUserAdded: (user: any) => void;
}) => {
    const handleSubmit = (values: any, { setSubmitting, resetForm }: any) => {
        try {
            // Generate unique ID
            const newUser = {
                ...values,
                id: `${tenantId}_user${Date.now()}`,
                createdAt: new Date().toISOString().split("T")[0],
            };

            const usersKey = `${tenantId}Users`;
            const existingUsers = JSON.parse(
                localStorage.getItem(usersKey) || "[]"
            );
            localStorage.setItem(
                usersKey,
                JSON.stringify([...existingUsers, newUser])
            );

            onUserAdded(newUser);

            // Reset form
            resetForm();
            setSubmitting(false);
        } catch (error) {
            console.error("Error adding user", error);
            setSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className='mr-2 h-4 w-4' /> Add User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>

                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        role: "viewer",
                        status: "pending",
                    }}
                    validationSchema={UserSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        errors,
                        touched,
                        isSubmitting,
                        setFieldValue,
                        values,
                    }) => (
                        <Form>
                            <div className='grid gap-4 py-4'>
                                {/* Name Field */}
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label
                                        htmlFor='name'
                                        className='text-right'
                                    >
                                        Name
                                    </Label>
                                    <div className='col-span-3'>
                                        <Field
                                            as={Input}
                                            name='name'
                                            placeholder='Enter user name'
                                        />
                                        {errors.name && touched.name && (
                                            <div className='text-red-500 text-sm mt-1'>
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label
                                        htmlFor='email'
                                        className='text-right'
                                    >
                                        Email
                                    </Label>
                                    <div className='col-span-3'>
                                        <Field
                                            as={Input}
                                            name='email'
                                            type='email'
                                            placeholder='Enter user email'
                                        />
                                        {errors.email && touched.email && (
                                            <div className='text-red-500 text-sm mt-1'>
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Role Field */}
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label
                                        htmlFor='role'
                                        className='text-right'
                                    >
                                        Role
                                    </Label>
                                    <div className='col-span-3'>
                                        <Select
                                            value={values.role}
                                            onValueChange={(value) =>
                                                setFieldValue("role", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select role' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='viewer'>
                                                    Viewer
                                                </SelectItem>
                                                <SelectItem value='manager'>
                                                    Manager
                                                </SelectItem>
                                                <SelectItem value='admin'>
                                                    Admin
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && touched.role && (
                                            <div className='text-red-500 text-sm mt-1'>
                                                {errors.role}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Field */}
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label
                                        htmlFor='status'
                                        className='text-right'
                                    >
                                        Status
                                    </Label>
                                    <div className='col-span-3'>
                                        <Select
                                            value={values.status}
                                            onValueChange={(value) =>
                                                setFieldValue("status", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select status' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='pending'>
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value='active'>
                                                    Active
                                                </SelectItem>
                                                <SelectItem value='inactive'>
                                                    Inactive
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && touched.status && (
                                            <div className='text-red-500 text-sm mt-1'>
                                                {errors.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type='button' variant='secondary'>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type='submit' disabled={isSubmitting}>
                                    Add User
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserModal;
