"use client";
import Heading from "@/components/Heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import UserAvatar from "@/components/UserAvatar";

const MusicPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [musics, setMusics] = useState<any[]>([]);

  const fetchChats = async () => {
    const res = await axios.get("/api/music");
    setMusics(res.data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/music", values);
      fetchChats();
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Turn Your Prompt Into Music."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        type="text"
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Enter Your Prompt"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {!musics && !isLoading && <Empty label="No Music Generated" />}
          <div className="flex flex-col-reverse gap-y-1">
            {musics &&
              musics.map((music) => (
                <>
                  <div key={music._id} className="mb-16">
                    <audio controls className="w-full mt-4">
                      <source src={music.response.responseMessage} />
                    </audio>
                  </div>
                  <div
                    className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-white border border-black/10"
                    key={music.response._id}
                  >
                    <UserAvatar />
                    {music.question}
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
