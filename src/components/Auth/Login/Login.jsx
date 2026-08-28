import React, { useContext, useState } from 'react'
import { Button, Input } from '@heroui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import z, { email } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserData';

export default function Login() {

  let {token , settoken} = useContext(UserData);

  let navigate = useNavigate();

  let [errMsg, seterrMsg] = useState(null);
  let [loading, setloading] = useState(false);

  let schema = z.object({
    email: z.email(),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Invalid Pass"),
  });
  let { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema)
  })

  function submitForm(values) {
    setloading(true);
    axios.post(`https://route-posts.routemisr.com/users/signin`, values)
      .then((res) => {
        console.log(res.data.data.token);
        if (res.data.message == 'signed in successfully') {
          console.log();
          
          localStorage.setItem("userToken" , res?.data?.data.token);
          settoken(res.data.data.token);
          setloading(false);
          navigate('/home')
        }
      })
      .catch((err) => {
        setloading(false);
        console.log(err.response.data.message);
        seterrMsg(err.response.data.message);
      });
  }

  return <div className='w-[75%] mx-auto p-5 mt-4 rounded-2xl h-lvh shadow'>
    <h2>Login now!</h2>
    {errMsg ? <h5 className='bg-red-600 rounded-2xl text-center text-white p-1 w-[95%] mt-2'>{errMsg}</h5> : ""}
    <form onSubmit={handleSubmit(submitForm)}>
      {/* Email input */}
      <div>
        <Input {...register('email')} name='email' aria-label="email" className="w-[95%] my-3 rounded-xl" placeholder="Enter your Email" />
        {formState.errors.email ? <p className='text-red-600'>{formState.errors.email.message}</p> : ""}
      </div>
      {/* password input */}
      <div>
        <Input {...register('password')} name='password' aria-label="password" className="w-[95%] my-3 rounded-xl" placeholder="Enter your Password" />
        {formState.errors.password ? <p className='text-red-600'>{formState.errors.password.message}</p> : ""}
      </div>
      <Button type='submit' className='w-[95%]'>{loading ? <i className='fa fa-spin fa-spinner'></i> : "Login"}</Button>
    </form>
  </div>
}