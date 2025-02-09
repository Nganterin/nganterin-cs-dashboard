import { Button } from "@heroui/react"
import { Input } from "../ui/input"

const ChatRoom = ({ data }) => {
    return (
        <div className="h-[calc(100vh-53px)] bg-amber-300">
            <div>
                {
                    data?.messages?.map((message, index) => (
                        <div key={index}>
                            <p>{message.sender_name}</p>
                            <p>{message.message}</p>
                            <p>{message.created_at}</p>
                        </div>
                    ))
                }
            </div>
            <div className="sticky bottom-0 flex flex-row items-center gap-4">
                <Input />
                <Button>Send</Button>
            </div>
        </div>
    )
}

export default ChatRoom