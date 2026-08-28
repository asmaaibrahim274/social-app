import React, { useState } from 'react'
import { Button, Input } from '@heroui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import z, { email } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

export default function Register() {

  let navigate = useNavigate();

  let [errMsg, seterrMsg] = useState(null);
  let [loading, setloading] = useState(false);

  let schema = z.object({
    name: z.string().min(2, '! at least 2 chars').max(8, '! max chars is 8'),
    username: z.string().regex(/^[a-z0-9_]{3,30}$/, "Invalid User Name"),
    email: z.email(),
    dateOfBirth: z.string().refine((date) => {
      let userDate = new Date(date);
      let todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      return userDate < todayDate;
    }, 'Invalid Date'),
    gender: z.enum(["male", "female"], 'Gender Required'),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Invalid Pass"),
    rePassword: z.string()
  }).refine((obj) => {
    return obj.password == obj.rePassword;
  }, {
    error: 'pass $ repass not same',
    path: ["rePassword"]
  });
  let { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: ""
    },
    resolver: zodResolver(schema)
  })

  function submitForm(values) {
    // console.log(values);
    setloading(true);
    axios.post(`https://route-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message == 'account created') {
          setloading(false);
          navigate('/login')
        }
      })
      .catch((err) => {
        setloading(false);
        console.log(err.response.data.message);
        seterrMsg(err.response.data.message);
      });
  }

  return <div className='shadow w-[75%] mx-auto p-5 mt-4 rounded-2xl'>
    <h2>Register now!</h2>
    {errMsg ? <h5 className='bg-red-600 rounded-2xl text-center text-white p-1 w-[95%] mt-2'>{errMsg}</h5> : ""}
    <form onSubmit={handleSubmit(submitForm)}>
      {/* name input */}
      <div>
        <Input {...register('name')} name="name" aria-label="Name" className="w-[95%] my-3 rounded-xl" placeholder="Enter your name" />
        {formState.errors.name ? <p className='text-red-600'>{formState.errors.name.message}</p> : ""}
      </div>
      {/* UserName input */}
      <div>
        <Input {...register('username')} name='username' aria-label="username" className="w-[95%] my-3 rounded-xl" placeholder="Enter your UserName" />
        {formState.errors.username ? <p className='text-red-600'>{formState.errors.username.message}</p> : ""}
      </div>
      {/* Email input */}
      <div>
        <Input {...register('email')} name='email' aria-label="email" className="w-[95%] my-3 rounded-xl" placeholder="Enter your Email" />
        {formState.errors.email ? <p className='text-red-600'>{formState.errors.email.message}</p> : ""}
      </div>
      {/* Birth input */}
      <div>
        <Input {...register('dateOfBirth')} type='date' name='dateOfBirth' aria-label="dateOfBirth" className="w-[95%] my-3 rounded-xl" />
        {formState.errors.dateOfBirth ? <p className='text-red-600'>{formState.errors.dateOfBirth.message}</p> : ""}
      </div>
      {/* password input */}
      <div>
        <Input {...register('password')} name='password' aria-label="password" className="w-[95%] my-3 rounded-xl" placeholder="Enter your Password" />
        {formState.errors.password ? <p className='text-red-600'>{formState.errors.password.message}</p> : ""}
      </div>
      {/* RePassword input */}
      <div>
        <Input {...register('rePassword')} name='rePassword' aria-label="rePassword" className="w-[95%] my-3 rounded-xl" placeholder="Enter your RePassword" />
        {formState.errors.rePassword ? <p className='text-red-600'>{formState.errors.rePassword.message}</p> : ""}
      </div>
      {/* Gender input */}
      <div>
        <input {...register('gender')} id='male' type='radio' value='male' name='gender' aria-label="gender" className="my-3 me-2 " />
        <label htmlFor="male">Male</label>
      </div>
      {/* Gender input */}
      <div>
        <input {...register('gender')} id='female' type='radio' value='female' name='gender' aria-label="gender" className="my-3 me-2 " />
        <label htmlFor="female">Fe-Male</label>
      </div>
      {formState.errors.gender ? <p className='text-red-600'>{formState.errors.gender.message}</p> : ""}
      <Button type='submit' className='w-[95%]'>{loading ? <i className='fa fa-spin fa-spinner'></i> : "Register"}</Button>
    </form>
  </div>
}