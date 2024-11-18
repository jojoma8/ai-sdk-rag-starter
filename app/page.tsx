"use client";

import { useChat } from "ai/react";
import { Button } from "components/ui/button";
import ChatWindow from "components/ui/chatwindow";
import { Input } from "components/ui/input";
import UploadForm from "components/ui/uploadform";
import { useState } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });

  console.log("test");
  // const [uploadSuccess, setUploadSuccess] = useState(false);

  // const handleUploadSuccess = () => {
  //   setUploadSuccess(true);
  // };

  return (
    <div className="flex flex-col w-full max-w-md py-5 mx-auto">
      <h1 className="text-center mb-4 pb-4 font-semibold text-2xl bottom-0 border-b border-gray-200 w-full">
        BSP Chat Bot
      </h1>
      {/* <UploadForm /> */}
      <div className="flex-grow overflow-hidden">
        <ChatWindow messages={messages} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md p-4 bg-white border-t border-gray-200"
      >
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="flex-1"
          />
          <Button type="submit" variant="default">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
