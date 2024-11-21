"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "../actions/login";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const { toast } = useToast();
    const router = useRouter();
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            try {
                const res = await login(values);
                if (res) {
                    toast({
                        title: "Login Successful",
                        variant: "default",
                    });
                    router.push(`${res}/dashboard`);
                }

                console.log(res);
            } catch (error: any) {
                toast({
                    title: "Login Failed",
                    variant: "destructive",
                    description: error.message,
                });
            }
        },
        validationSchema: validationSchema,
    });

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <Card className='w-[350px]'>
                <CardHeader>
                    <CardTitle>Login to Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={formik.handleSubmit} className='space-y-4'>
                        <Input
                            type='email'
                            placeholder='Email'
                            {...formik.getFieldProps("email")}
                        />
                        <Input
                            type='password'
                            {...formik.getFieldProps("password")}
                        />
                        <Button type='submit' className='w-full  '>
                            {formik.isSubmitting ? "Loading..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
