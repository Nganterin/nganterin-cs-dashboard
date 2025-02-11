import { Button, Textarea } from "@heroui/react"
import { ChatBubble } from "../ChatBubble"

const ChatRoom = ({ data }) => {
    return (
        <div className="h-[calc(100vh-81px)] relative px-4 py-3">
            <div className="flex flex-col gap-4">
                {
                    data?.data?.map((item, index) => {
                        return (
                            <ChatBubble key={index} data={item} />
                        )
                    })
                }
            </div>
            <div className="absolute w-full bottom-0 flex flex-row items-center gap-4 mb-3">
                <div className="w-full flex flex-row items-start gap-4 px-8 ">
                    <Textarea className="w-full" />
                    <Button className="" size="lg">Send</Button>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom