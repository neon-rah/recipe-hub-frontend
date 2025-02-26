"use client";

import {GiChefToque} from "react-icons/gi";
import {useState} from "react";
import ImageUpload from "@/components/ui/image-upload";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Form from "next/form";
import {FORM_RULES} from "@/config/formRules";

export default function RegisterPage(){

    const [image, setImage] = useState<File | null>(null);
    
    const handleSubmit = () => {
        
    }
    
    return(
        <>
            <div className={"bg-amber-50 flex flex-col w-full h-[100vh] justify-center items-center"}>
                <div className={"flex flex-col items-center justify-center "}>
                    <GiChefToque className="text-4xl text-primary " size={50}/>
                    <h2 className="mt-5 mb-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Register to Kaly'Art
                    </h2>

                </div>

                <div className={"flex w-full justify-center  flex-wrap gap-10"}>
                    <Form action={handleSubmit}>
                        <div className={"flex w-full justify-center  flex-wrap gap-10"}>
                            <div className="flex flex-col  items-center  ">
                                <div className="flex w-[350px] flex-col items-center space-y-6">
                                    <ImageUpload onImageSelect={setImage} shape="round"/>
                                    {image && <p className="text-sm text-gray-500">Selected file: {image.name}</p>}
                                    <Input label={"Name"} regex={FORM_RULES.lastName.regex} errorMessage={FORM_RULES.lastName.errorMessage}/>
                                    <Input label={"FirstName"} regex={FORM_RULES.firstName.regex} errorMessage={FORM_RULES.firstName.errorMessage}/>
                                </div>
                            </div>

                            <div className={" w-[350px] flex flex-col gap-4"}>
                                <Input label={"Address"} regex={FORM_RULES.address.regex} errorMessage={FORM_RULES.address.errorMessage}/>
                                <Input label={"Email"} regex={FORM_RULES.email.regex} errorMessage={FORM_RULES.email.errorMessage}/>
                                <Input label={"Password"} type={'password'} regex={FORM_RULES.password.regex} errorMessage={FORM_RULES.password.errorMessage}/>
                                <Input label={"Confirm Password"} type={'password'}/>

                                <div className={"mt-10 flex gap-6 justify-end "}>
                                        <Button className={"bg-gray-500 text-white hover:bg-gray-400"} type={"reset"}>Cancel</Button>
                                        <Button type={"submit"}>Register</Button>
                                </div>

                            </div>

                        </div>


                    </Form>
                </div>


            </div>
        </>
    )
}