import React, { useRef } from 'react'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { ModalProps } from '@/lib/types'
import { parseDate } from '@/lib/utils'

const Modal = ({ open, closeModal, onSubmit, itinerary }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null)
    useOutsideClick(modalRef, closeModal)
    return (
        <>
            {
                open ?
                    <div className="bg-slate-950 top-0 left-0 bg-opacity-40 fixed w-full h-full flex justify-center items-center">
                        <div ref={modalRef} className="w-[95%] md:w-[400px] h-[300px] bg-slate-200 rounded-sm shadow-md relative p-10 box-border md:box-content items-center flex">
                            <span
                                onClick={closeModal}
                                className="absolute text-lg top-0 right-3 hover:scale-105 transition-all cursor-pointer text-slate-900">
                                &times;
                            </span>
                            <form className='flex flex-col gap-5 w-full'>
                                <p className='flex gap-2 justify-between'>
                                    <label htmlFor="date" className='text-slate-900'>Fecha:</label>
                                    <input
                                        defaultValue={parseDate(itinerary?.date || '')}
                                        className='rounded-sm p-1'
                                        type="date"
                                        id="date"
                                        name="date"
                                        required />
                                </p>
                                <p className='flex gap-2 justify-between flex-col'>
                                    <label htmlFor="description" className='text-slate-900'>Itinerario:</label>
                                    <textarea
                                        defaultValue={itinerary?.description}
                                        className='p-1 rounded-sm resize-none'
                                        id="description"
                                        name="description"
                                        required />
                                </p>
                                <p className='flex gap-2 justify-between flex-col'>
                                    <label htmlFor="link" className='text-slate-900'>Link:</label>
                                    <input
                                        defaultValue={itinerary?.link}
                                        className='p-1 rounded-sm'
                                        type="text"
                                        id="link"
                                        name="link"
                                    />
                                </p>
                                <p className='flex justify-center items-center'>
                                    <button
                                        className='cursor-pointer px-2 py-1 border rounded-sm hover:scale-105 transition-all text-slate-900'
                                        type="submit"
                                        formAction={(formData) => onSubmit(formData, itinerary?.id)}
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

export default Modal