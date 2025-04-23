import React from 'react'

const EmptyState = ({ text }: { text: string }) => {
    return (
        <div className='bg-black bg-opacity-40 w-full flex justify-center items-center p-10'>
            <h2>{text}</h2>
        </div>
    )
}

export default EmptyState