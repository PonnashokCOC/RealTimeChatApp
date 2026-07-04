import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import {useAuthStore} from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    message: [],
    users: [],
    selectedUsers: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users")
            set({users: res.data})
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({isUserLoading: false});
        }
    },

    getMessages: async (userId) => {
        set({isMessageLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({message: res.data})
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({isMessageLoading: false});
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUsers, message} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUsers._id}`, messageData)
            set({message: [...message, res.data]})
        } catch (err) {
            toast.error(err.response.data.message)
        }
    },

    subscribeToMessages: () => {
        const {selectedUsers} = get()
        if(!selectedUsers) return;

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            if(newMessage.sender.id !== selectedUsers._id) return
            set({
                message: [...get().message, newMessage]
            });
        });
    },

    unSubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUsers) => set({selectedUsers})
}))