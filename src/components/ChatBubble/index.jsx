export const ChatBubble = ({ data }) => {
    if (data.is_cs_chat) {
        return (
            <div className="flex w-full justify-end">
                <div className="flex flex-col w-max max-w-[320px] leading-1.5 p-4 border-slate-200 bg-slate-100 rounded-s-xl rounded-b-xl dark:bg-slate-200">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-900">You</span>
                        <span className="text-sm font-normal text-slate-500 dark:text-slate-700">{data.humanized_created_at}</span>
                    </div>
                    <p className="text-sm font-normal break-words py-2.5 text-slate-900 dark:text-slate-900">{data.message}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col w-max max-w-[320px] leading-1.5 p-4 border-slate-200 bg-slate-100 rounded-e-xl rounded-es-xl dark:bg-slate-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{data.customer.name}</span>
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">{data.humanized_created_at}</span>
                </div>
                <p className="text-sm font-normal break-words py-2.5 text-slate-900 dark:text-white">{data.message}</p>
            </div>
        )
    }
}