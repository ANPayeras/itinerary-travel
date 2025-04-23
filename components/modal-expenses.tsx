import React, { ReactNode, useRef } from 'react'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { ModalProps } from '@/lib/types'

const ModalExpenses = ({ open, closeModal, onSubmit, modalData }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null)
    useOutsideClick(modalRef, closeModal)

    const type: { [key: string]: ReactNode } = {
        person: <>
            <p className='flex gap-2 justify-between'>
                <label htmlFor="name" className='text-slate-900'>Nombre:</label>
                <input
                    defaultValue={modalData?.name}
                    className='p-1 rounded-sm'
                    type="text"
                    id="name"
                    name="name"
                    required />
            </p>
            <p className='flex gap-2 justify-between'>
                <label htmlFor="amount" className='text-slate-900'>Monto:</label>
                <input
                    defaultValue={modalData?.amount}
                    className='p-1 rounded-sm'
                    type="number"
                    id="amount"
                    name="amount"
                    step=".01"
                    required />
            </p>
        </>,
        expense: <>
            <p className='flex gap-2 justify-between'>
                <label htmlFor="detail" className='text-slate-900'>Detalle:</label>
                <input
                    defaultValue={modalData?.detail}
                    className='p-1 rounded-sm'
                    type="text"
                    id="detail"
                    name="detail"
                    required />
            </p>
            <p className='flex gap-2 justify-between'>
                <label htmlFor="amount" className='text-slate-900'>Monto:</label>
                <input
                    defaultValue={modalData?.amount}
                    className='p-1 rounded-sm'
                    type="number"
                    id="amount"
                    name="amount"
                    step=".01"
                    required />
            </p>
        </>
    }

    return (
        <>
            {
                open ?
                    <div className="bg-slate-950 top-0 left-0 bg-opacity-40 fixed w-full h-full flex justify-center items-center">
                        <div ref={modalRef} className="w-[95%] md:w-[400px] bg-slate-200 rounded-sm shadow-md relative p-10 box-border md:box-content items-center flex">
                            <span
                                onClick={closeModal}
                                className="absolute text-lg top-0 right-3 hover:scale-105 transition-all cursor-pointer text-slate-900">
                                &times;
                            </span>
                            <form className='flex flex-col gap-5 w-full'>
                                {type[modalData?.type!]}
                                <p className='flex justify-center items-center'>
                                    <button
                                        className='cursor-pointer px-2 py-1 border rounded-sm hover:scale-105 transition-all text-slate-900'
                                        type="submit"
                                        formAction={(formData) => onSubmit(formData, modalData?.id)}
                                    >
                                        Aceptar
                                    </button>
                                </p>
                            </form>
                        </div>
                    </div> : <></>
            }
        </>
    )
}

export default ModalExpenses