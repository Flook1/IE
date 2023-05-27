import { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
    email: string,
    password: string
}

const signin:NextPage = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();


    return (


    )
};