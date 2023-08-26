"use client";
import Heading from "@/components/Heading";
import { VideoIcon } from "lucide-react";
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

const VideoPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [videos, setVideos] = useState<any[]>();

  const fetchChats = async () => {
    const res = await axios.get("/api/video");
    setVideos(res.data);
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
      await axios.post("/api/video", values);
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
        title="Video Generation"
        description="Turn Your Prompt Into Video."
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
          {!videos && !isLoading && <Empty label="No Video Generated" />}
          <div className="flex flex-col-reverse gap-y-1">
            {videos &&
              videos.map((video) => (
                <>
                  <div key={video._id} className="mb-16">
                    <video
                      controls
                      className="w-full aspect-video rounded-lg border bg-black mt-4"
                    >
                      <source src={video.response.responseMessage} />
                    </video>
                  </div>
                  <div
                    className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-white border border-black/10"
                    key={video.response._id}
                  >
                    <UserAvatar />
                    {video.question}
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
