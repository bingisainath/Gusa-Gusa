import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import moment from "moment";

const MessagesSection = ({ messages, user, currentMessage }) => {
  return (
    <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
      {/* All messages */}
      <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
              user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"
            }`}
          >
            <div className="w-full relative">
              {msg?.imageUrl && (
                <LazyLoadImage
                  src={msg?.imageUrl}
                  alt="Message Image"
                  effect="blur"
                  className="w-full h-full object-scale-down"
                />
              )}
              {msg?.videoUrl && (
                <video
                  src={msg.videoUrl}
                  className="w-full h-full object-scale-down"
                  controls
                />
              )}
            </div>
            <p className="px-2">{msg.text}</p>
            <p className="text-xs ml-auto w-fit">
              {moment(msg.createdAt).format("hh:mm")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MessagesSection;
