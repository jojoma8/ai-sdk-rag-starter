"use client";

import { useChat } from "ai/react";
import UploadForm from "components/ui/uploadform";
import { useState } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });

  // const [uploadSuccess, setUploadSuccess] = useState(false);

  // const handleUploadSuccess = () => {
  //   setUploadSuccess(true);
  // };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      <UploadForm />
      {/* {uploadSuccess && ( */}
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              <p>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">
                    {"calling tool: " + m?.toolInvocations?.[0].toolName}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* )} */}
      {/* {uploadSuccess && ( */}
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Ask a question about the PDF..."
          onChange={handleInputChange}
        />
      </form>
      {/* )} */}
    </div>
  );
}
