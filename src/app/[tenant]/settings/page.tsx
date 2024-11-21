"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { getTenantPreferences, hexToHSL } from "@/lib/helpers/functions";

export default function TenantSettingsPage() {
    const tenantId = useParams().tenant;
    const [tenantData, setTenantData] = useState<
        | {
              name: string;
              logo: string;
              theme: string;
              primaryColor: string;
              secondaryColor: string;
          }
        | undefined
    >();

    useEffect(() => {
        setTenantData(getTenantPreferences(tenantId as string));
    }, [tenantId]);

    console.log("tenantData()()()()", tenantData);

    const validationSchema = Yup.object().shape({
        organizationName: Yup.string()
            .required("Organization Name is required")
            .min(2, "Organization Name must be at least 2 characters")
            .max(50, "Organization Name must be at most 50 characters"),
        themeMode: Yup.string()
            .oneOf(["light", "dark"], "Invalid theme mode")
            .required("Theme Mode is required"),
        primaryColor: Yup.string().required("Primary Color is required"),
        secondaryColor: Yup.string().required("Secondary Color is required"),
    });

    const formik = useFormik({
        initialValues: {
            organizationName: tenantData?.name || "",
            themeMode: tenantData?.theme || "light",
            primaryColor: tenantData?.primaryColor
                ? `hsl(${tenantData.primaryColor})`
                : "#000000",
            secondaryColor: tenantData?.secondaryColor
                ? `hsl(${tenantData.secondaryColor})`
                : "#FFFFFF",
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const primaryColorHSL = hexToHSL(values.primaryColor);
            const secondaryColorHSL = hexToHSL(values.secondaryColor);

            console.log(primaryColorHSL, secondaryColorHSL);

            const submissionValues = {
                name: values.organizationName,
                theme: values.themeMode,
                primaryColor: primaryColorHSL,
                secondaryColor: secondaryColorHSL,
                logo: tenantData?.logo || "",
            };

            const storageTenantData = JSON.parse(
                localStorage.getItem("tenants") || "{}"
            );

            if (storageTenantData) {
                storageTenantData[tenantId as string] = submissionValues;
                localStorage.setItem(
                    "tenants",
                    JSON.stringify(storageTenantData)
                );

                // reload the page to implement the changes
                window.location.reload();
            }
        },
    });

    console.log(formik.values);

    return (
        <div className='container mx-auto p-4'>
            <form onSubmit={formik.handleSubmit}>
                <Tabs defaultValue='general'>
                    <TabsList className='grid w-full grid-cols-3'>
                        <TabsTrigger value='general'>General</TabsTrigger>
                        <TabsTrigger value='appearance'>Appearance</TabsTrigger>
                    </TabsList>

                    <TabsContent value='general'>
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div>
                                    <Label>Organization Name</Label>
                                    <Input
                                        name='organizationName'
                                        value={formik.values.organizationName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder='Enter organization name'
                                    />
                                    {formik.touched.organizationName &&
                                        formik.errors.organizationName && (
                                            <p className='text-red-500 text-sm mt-1'>
                                                {formik.errors.organizationName}
                                            </p>
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='appearance'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance Settings</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div>
                                    <Label>Theme Mode</Label>
                                    <Select
                                        name='themeMode'
                                        value={formik.values.themeMode}
                                        onValueChange={(value) =>
                                            formik.setFieldValue(
                                                "themeMode",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select Theme' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["light", "dark"].map(
                                                (themeOption) => (
                                                    <SelectItem
                                                        key={themeOption}
                                                        value={themeOption}
                                                    >
                                                        {themeOption}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {formik.touched.themeMode &&
                                        formik.errors.themeMode && (
                                            <p className='text-red-500 text-sm mt-1'>
                                                {formik.errors.themeMode}
                                            </p>
                                        )}
                                </div>
                                <div>
                                    <Label>Primary Color</Label>
                                    <Input
                                        type='color'
                                        name='primaryColor'
                                        value={formik.values.primaryColor}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.primaryColor &&
                                        formik.errors.primaryColor && (
                                            <p className='text-red-500 text-sm mt-1'>
                                                {formik.errors.primaryColor}
                                            </p>
                                        )}
                                </div>
                                <div>
                                    <Label>Secondary Color</Label>
                                    <Input
                                        type='color'
                                        name='secondaryColor'
                                        value={formik.values.secondaryColor}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.secondaryColor &&
                                        formik.errors.secondaryColor && (
                                            <p className='text-red-500 text-sm mt-1'>
                                                {formik.errors.secondaryColor}
                                            </p>
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <CardFooter className='mt-4 justify-end'>
                        <Button
                            type='submit'
                            disabled={formik.isSubmitting || !formik.isValid}
                        >
                            {formik.isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Tabs>
            </form>
        </div>
    );
}
