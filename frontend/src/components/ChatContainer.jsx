import React, {useEffect, useRef} from 'react';
import {useChatStore} from "../store/useChatStore.js";
import MessageInput from "./MessageInput.jsx";
import ChatHeader from "./ChatHeader.jsx";
import MessageSkeleton from "./skeleton/MessageSkeleton.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import {formatMessageTime} from "../lib/utils.js";

const ChatContainer = () => {
    const {message, getMessages, isMessagesLoading, selectedUsers, subscribeToMessages, unSubscribeFromMessages} = useChatStore()
    const {authUser} = useAuthStore()
    const messageEndRef = useRef(null);
    useEffect(() => {
        getMessages(selectedUsers._id);
        subscribeToMessages();

        return () => unSubscribeFromMessages();
    }, [selectedUsers._id, getMessages]);

    useEffect(() => {
        if (messageEndRef.current && message)
            messageEndRef.current.scrollIntoView({behavior: "smooth"});
    }, [message])
    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader/>
                <MessageSkeleton/>
                <MessageInput/>
            </div>
        )
    }
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {message.map((messages) => (
                    <div key={messages._id}
                         className={`chat ${messages.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                         ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={messages.senderId === authUser._id ? authUser.profilePic || "/avatar.png" :
                                        selectedUsers.profilePic || "/avatar.png"}
                                    alt="profilePic"/>
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(messages.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble">
                            {messages.image && (
                                <img
                                src={messages.image} alt="Attachement"
                                className="sm:max-w-[200px] rounded-md mb-2"/>
                            )}
                            {messages.text && <p>{messages.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput/>
        </div>
    );
};

export default ChatContainer;