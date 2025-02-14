import Image from 'next/image'
import React from 'react'

const UnselectedRoom = () => {
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div>
                <Image src={`/images/chats.png`} width={300} height={300} alt='chats' />
                <p className='text-center text-2xl font-poppins'>
                    Temenin Web
                </p>
                <p className='text-opacity-80'>
                    Nganterin customer service dashboard 
                </p>
            </div>
        </div>
    )
}

export default UnselectedRoom