"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { api } from "@/services/api";
import axios, { AxiosError } from "axios";
import { useModal } from "@/hooks/modal-hook";

const formSchema = z.object({
  userName: z.string()
    .min(1, { message: "Username has to have at least 1 character." })
    .max(20, { message: "Username has to be less than 20 characters" })
    .regex(/^[\w\-\s]+$/, { message: "Invalid characters detected" })
})

const AddMemberDialog = () => {
  const [errorMsg, setErrorMsg] = useState("");

  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "addMember";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
    }
  });

  const loadingReq = form.formState.isSubmitting;

  function onSubmit(values: z.infer<typeof formSchema>) {
    api.put(`/room/add-user/${data.roomId}/${values.userName}`)
      .then(() => handleClose())
      .catch(error => {
        if (axios.isAxiosError(error) && error.response?.data.error) {
          setErrorMsg(error.response?.data.error)
        } else {
          setErrorMsg("Error");
          console.error(error);
        }
      })
  }

  function handleClose() {
    form.reset();
    setErrorMsg("");
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Add member</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
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
              <Button type="submit" className="">
                {
                  loadingReq ?
                    <PulseLoader color="#fff" size={6} /> :
                    "Add member"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddMemberDialog;