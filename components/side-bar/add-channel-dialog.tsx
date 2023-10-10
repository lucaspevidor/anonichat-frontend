"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { api } from "@/services/api";
import { AxiosError } from "axios";

const formSchema = z.object({
  channelName: z.string()
    .min(4, {message: "Channel name has to be at least 5 characters."})
    .max(20, {message: "Channel name has to be less than 20 characters"})
    .regex(/^[\w\-\s]+$/, {message: "Invalid characters detected"})
})

const AddChannelDialog = ({children}: {children: React.ReactNode}) => {

  const [loadingReq, setLoadingReq] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: "",
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingReq(true);
    api.post(`/room/${values.channelName}`)
      .then(() => setDialogOpen(false))
      .catch(error => {
        if (error instanceof AxiosError && error.response?.data.message) {
          setErrorMsg(error.response?.data.message)
        } else {
          setErrorMsg("Error");
          console.error(error);
        }
      })
      .finally(() => setLoadingReq(false));
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Create channel</DialogTitle>
            </DialogHeader>
            
            <FormField
              control={form.control}
              name="channelName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Channel name</FormLabel>
                  <FormControl>
                    <Input {...field} />                    
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {
              errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>
            }
            <DialogFooter>
              <Button type="submit" className="w-20">
              {
                loadingReq ?
                <PulseLoader color="#fff" size={6} /> :
                "Create"
              }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
 
export default AddChannelDialog;