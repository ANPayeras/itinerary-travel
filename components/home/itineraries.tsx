import React, { Fragment, useCallback, useEffect, useState } from 'react'
import Modal from '../modal'
import { createClient } from '@/utils/supabase/client';
import { Itineraries, Itinerary } from '@/lib/types';
import { addItineraryAction, deleteItineraryAction, editItineraryAction, getItinerariesAction } from '@/app/actions';
import Loader from '../loader';
import TableControls from '../table-controls';
import EmptyState from '../empty-state';

const ItinerariesComponent = () => {
    const supabase = createClient();
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [editItinerary, setEditItinerary] = useState<Itinerary>()
    const [itineraries, setItineraries] = useState<Itineraries[]>([])

    const getItineraries = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getItinerariesAction() as Itineraries[]
            setItineraries(data || []);
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        getItineraries()
    }, [getItineraries])

    const onSubmit = async (formData: FormData, id?: number) => {
        try {
            if (id) {
                await editItineraryAction(formData, id)
            } else {
                await addItineraryAction(formData)
            }
            setEditItinerary(undefined)
            setOpenModal(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const channel = supabase
            .channel('itineraries')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'itineraries',
                },
                () => {
                    getItineraries()
                }
            )
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [supabase, itineraries])

    const addEvent = () => {
        setOpenModal(true)
    }

    const redirectLink = (link: string) => {
        window.open(link, "_blank")
    }

    const deleteItinerary = async (id: number) => {
        try {
            await deleteItineraryAction(id)
        } catch (error) {
            console.log(error)
        }
    }

    const openModalEdit = (id: number, date: string) => {
        const findDate = itineraries.find(i => i.date === date)!
        let findItinerary = {}
        if (findDate?.itineraries.length > 1) {
            findItinerary = findDate.itineraries.find(i => i.id === id)!
        } else {
            findItinerary = findDate.itineraries[0]
        }
        setEditItinerary(findItinerary as Itinerary)
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
        setEditItinerary(undefined)
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className="flex justify-end items-center">
                <div className="flex justify-center items-center">
                    <button
                        className='bg-white text-slate-900 cursor-pointer px-2 py-1 border rounded-sm hover:scale-105 hover:bg-opacity-50 transition-all'
                        onClick={addEvent}
                    >
                        Agregar evento
                    </button>
                </div>
            </div>
            <div className="max-h-[500px] overflow-hidden overflow-y-scroll rounded-sm border">
                {
                    loading ?
                        <div className='bg-black bg-opacity-40 w-full flex justify-center items-center p-10'>
                            <Loader />
                        </div> :
                        !itineraries.length ? <EmptyState text='Todavia no agregaste ninguna actividad' /> :
                            <table className='w-full border-hidden'>
                                <tbody>
                                    <tr className='bg-slate-600 border-b'>
                                        <th>Día</th>
                                        <th>Itinerario</th>
                                    </tr>
                                    {
                                        itineraries.map((i) => {
                                            const hasMore = i.itineraries.length > 1
                                            const length = i.itineraries.length
                                            const first = i.itineraries[0]
                                            return (
                                                <Fragment key={i.date}>
                                                    <tr>
                                                        <td className="w-1 px-2 py-3 bg-slate-700 border-b" rowSpan={length}>{i.date}</td>
                                                        <td className="flex px-2 py-3 gap-2 bg-slate-900 border-b">
                                                            <div className='flex-1 flex flex-col gap-2'>
                                                                <span>{first.description}</span>
                                                                {
                                                                    first.link ?

                                                                        <button className="text-blue-400 cursor-pointer hover:underline transition-all" onClick={() => redirectLink(first.link)}>
                                                                            Ver más
                                                                        </button> : <></>
                                                                }
                                                            </div>
                                                            <TableControls
                                                                onDelete={() => deleteItinerary(first.id)}
                                                                onEdit={() => openModalEdit(first.id, first.date)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    {
                                                        hasMore && i.itineraries.slice(1).map((it) => (
                                                            <tr key={it.id}>
                                                                <td className="flex px-2 py-3 gap-2 bg-slate-900 border-b">
                                                                    <div className='flex-1 flex gap-2'>
                                                                        <span>{it.description}</span>
                                                                        {
                                                                            it.link ?
                                                                                <button className="text-blue-400 cursor-pointer hover:underline transition-all" onClick={() => redirectLink(it.link)}>
                                                                                    Ver más
                                                                                </button> : <></>
                                                                        }
                                                                    </div>
                                                                    <TableControls
                                                                        onDelete={() => deleteItinerary(it.id)}
                                                                        onEdit={() => openModalEdit(it.id, it.date)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                }
            </div>
            <Modal
                closeModal={closeModal}
                onSubmit={onSubmit}
                open={openModal}
                itinerary={editItinerary}
            />
        </div>
    )
}

export default ItinerariesComponent