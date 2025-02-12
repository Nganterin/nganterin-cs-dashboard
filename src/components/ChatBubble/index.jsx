export const ChatBubble = ({ data }) => {
    if (data.is_cs_chat) {
        return (
            <div className="flex w-full justify-end">
                <div className="flex flex-col w-max max-w-[320px] leading-1.5 p-4 border-zinc-200 bg-zinc-100 rounded-s-xl rounded-b-xl dark:bg-zinc-200">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-black">{data.customer.name}</span>
                        <span className="text-sm font-normal text-zinc-500 dark:text-zinc-700">{data.humanized_created_at}</span>
                    </div>
                    <p className="text-sm font-normal break-words py-2.5 text-zinc-900 dark:text-black">{data.message}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-max max-w-[320px] leading-1.5 p-4 border-zinc-200 bg-zinc-100 rounded-e-xl rounded-es-xl dark:bg-zinc-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">{data.customer.name}</span>
                    <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">{data.humanized_created_at}</span>
                </div>
                <p className="text-sm font-normal break-words py-2.5 text-zinc-900 dark:text-white">{data.message}</p>
            </div>
        )
    }
}