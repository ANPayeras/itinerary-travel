import React from 'react'

const Loader = () => {
    return (
        <div className='flex gap-2'>
            <span className='bg-slate-100 w-3 h-3 rounded-full dot-animation' />
            <span className='bg-slate-100 w-3 h-3 rounded-full dot-animation delay-100' />
            <span className='bg-slate-100 w-3 h-3 rounded-full dot-animation delay-200' />
        </div>
    )
}

export default Loader