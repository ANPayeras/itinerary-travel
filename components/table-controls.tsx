import React from 'react'
import { TableControlsProps } from '@/lib/types'
import Trash from './icons/trash'
import Edit from './icons/edit'

const TableControls = ({ onDelete, onEdit }: TableControlsProps) => {
    return (
        <div className='flex flex-col gap-2'>
            <button onClick={onDelete}>
                <Trash className='text-red-500 w-4 h-4 transition-all hover:scale-105' />
            </button>
            <button onClick={onEdit}>
                <Edit className='text-white w-4 h-4 transition-all hover:scale-105' />
            </button>
        </div>
    )
}

export default TableControls