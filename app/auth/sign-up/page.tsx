"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { useAuth } from "@/hooks/auth-hook";
import { api } from "@/services/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// const formSchema = z.object({
//   username: z.string().min(4, {
//     message: "Username must be at least 4 characters."
//   }).max(8, {
//     message: "Username must be at most 8 characters."
//   }),
//   password: z.string().min(5, {
//     message: "Password must be at least 5 characters."
//   })
// })

const formSchema = z.object({
  username: z.string().min(1, {message: "Please inform your username."}),
  password: z.string().min(1, {message: "Please inform your password."}),
  confPassword: z.string().min(1, {message: "Please confirm your password."})
}).superRefine(({confPassword, password}, ctx) => {
  if (confPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords do not match.",
      path: ["confPassword"]
    })
  }
})

interface IUserResponse {
  id: string,
  username: string,
}

interface ISessionResponse {
  token: string,
  user: {
    id: string,
    username: string,
  }
}

const SignUp = () => {
  const [reqLoading, setReqLoading] = useState(false);
  const {auth, setAuth} = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const { push } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues: {
      username: "",
      password:"",
      confPassword: "",
    }
  })

  useEffect(() => {
    if (auth && auth.status === "authenticated")
      push("/");
  }, [auth]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setReqLoading(true);
    setErrorMsg("");
    try {
      const userResponse = await api.post<IUserResponse>("/user", {
        username: values.username,
        password: values.password
      });

      console.log({userResponse});

      const sessionResponse = await api.post<ISessionResponse>("/session", {
        username: values.username,
        password: values.password
      })

      setAuth && setAuth({
        jwt: sessionResponse.data.token,
        status:"authenticated",
        username: sessionResponse.data.user.username
      })
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.error) {
        setErrorMsg(error.response.data.error)
      }
      else console.error(error);
    }
    setReqLoading(false);
  }

  function signInClicked() {
    console.log("Clicked");
    push("/auth/sign-in");
  }

  return ( 
    <div className="flex flex-col items-center justify-center h-full bg-secondary">
      <Card className="min-w-[22.5rem] min-h-[29rem]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <CardHeader>
              <CardTitle className="text-center">Sign up</CardTitle>
              <CardDescription className="text-center">to AnonChat</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confPassword"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              {
                errorMsg !== "" && <span className="self-start text-destructive text-sm font-semibold">Error: {errorMsg}</span>
              }                
              <Button type="submit" className="w-full">
                {
                  reqLoading ?
                    <PulseLoader size={8} color="#fff"/> :
                    "Sign Up"
                }
              </Button>
              <Button variant="secondary" className="w-full" type="button" onClick={() => signInClicked()}>Sign In</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
 
export default SignUp;