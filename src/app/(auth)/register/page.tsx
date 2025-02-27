"use client";

import { GiChefToque } from "react-icons/gi";
import { useState } from "react";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FORM_RULES } from "@/config/formRules";
import useAuth from "@/hooks/useAuth";
import {useRouter} from "next/navigation";

export default function RegisterPage() {
    const { register } = useAuth();
    const [image, setImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors(null);

        const formData = new FormData(event.currentTarget);
        if (image) formData.append("profileImage", image);

        try {
            await register(formData);
            router.push("/home");
        } catch (errorMessage) {
            setErrors(errorMessage as string);
        }
    };

    return (
        <div className="bg-amber-50 flex flex-col w-full h-[100vh] justify-center items-center">
            <div className="flex flex-col items-center justify-center">
                <GiChefToque className="text-4xl text-primary " size={50}/>
                <h2 className="mt-5 mb-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    Register to Kaly'Art
                </h2>
            </div>

            {errors && <p className="text-red-500">{errors}</p>}

            <form onSubmit={handleSubmit} className="flex w-full justify-center flex-wrap gap-10">
                <div className="flex w-[350px] flex-col items-center space-y-6">
                    <ImageUpload onImageSelect={setImage} shape="round"/>
                    {image && <p className="text-sm text-gray-500">Selected file: {image.name}</p>}
                    <Input label="Last Name" regex={FORM_RULES.lastName.regex}
                           errorMessage={FORM_RULES.lastName.errorMessage} name="lastName"/>
                    <Input label="First Name" regex={FORM_RULES.firstName.regex}
                           errorMessage={FORM_RULES.firstName.errorMessage} name="firstName"/>
                </div>

                <div className="w-[350px] flex flex-col gap-4">
                    <Input label="Address" regex={FORM_RULES.address.regex}
                           errorMessage={FORM_RULES.address.errorMessage} name="address"/>
                    <Input label="Email" regex={FORM_RULES.email.regex} errorMessage={FORM_RULES.email.errorMessage}
                           name="email"/>
                    <Input label="Password" type="password" regex={FORM_RULES.password.regex}
                           errorMessage={FORM_RULES.password.errorMessage} name="password"/>
                    <Input label="Confirm Password" type="password" name="confirmPassword"/>

                    <div className="mt-10 flex gap-6 justify-end">
                        <Button className="bg-gray-500 text-white hover:bg-gray-400" type="reset">
                            Cancel
                        </Button>
                        <Button type="submit">Register</Button>
                    </div>
                </div>
            </form>

        </div>
    );
}
