"use client";
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

interface IDeleteResponse {
  id: string,
  username: string,
}

const SignUp = () => {
  const [reqLoading, setReqLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const {auth, clearAuth} = useAuth();

  const { push, back } = useRouter();

  useEffect(() => {
    console.log({pageAuth: auth?.status});
    if (auth && auth.status === "unauthenticated" && username === "") {
      push("/auth/sign-in");
    }
  }, [auth]);

  async function deleteUser() {
    setReqLoading(true);
    try {
      const response = await api.delete<IDeleteResponse>("/user");
      setUsername(response.data.username);
      clearAuth && clearAuth();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 400) {
          push("/auth/sign-in");
        } else {
          setErrorMsg(error.response?.data.error);
        }
      }
    }

    setReqLoading(false);
  }

  return ( 
    <div className="flex flex-col items-center justify-center h-full bg-secondary">
      <Card className="min-w-[22.5rem] w-[22.5rem] flex flex-col">
        <CardHeader>
          <CardTitle className="text-center">{username ? "User deleted" : "Delete user"}</CardTitle>
        </CardHeader>
        {
          username === "" ?
            <>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete your user? All of your channels and messages will be deleted. This operation cannot be reversed.
                </p>
                {
                  errorMsg !== "" && <span className="self-start text-destructive text-sm font-semibold">Error: {errorMsg}</span>
                }                
              </CardContent>
              <CardFooter className="flex flex-row-reverse gap-3">
                <Button className="w-full" variant="destructive" onClick={() => deleteUser()}>
                  {
                    reqLoading ?
                      <PulseLoader size={8} color="#fff"/> :
                      "Delete"
                  }
                </Button>
                <Button className="w-full" onClick={() => back()}>Go back</Button>
              </CardFooter>          
            </> :
            <>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  User {username} has been successfully deleted.
                </p>
              </CardContent>
              <CardFooter className="flex">
                <Button className="w-full" onClick={() => push("/auth/sign-up")}>Go to Sign Up</Button>
              </CardFooter>
            </>
        }
      </Card>
    </div>
  );
}
 
export default SignUp;