"use client"

import React, { ReactNode, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import Expenses from './expenses';
import ItinerariesComponent from './itineraries';

const Home = () => {
    const [type, setType] = useState('itineraries')

    const comp: { [key: string]: ReactNode } = {
        itineraries:
            <motion.div
                key='itineraries-animation'
                className="h-full w-full absolute top-0 left-0"
                initial={{ opacity: 0, x: -500, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 500 }}
                transition={{
                    duration: 1,
                    delay: 0.5,
                }}
            >
                <ItinerariesComponent />
            </motion.div>,
        expenses:
            <motion.div
                key='expenses-animation'
                className="h-full w-full absolute top-0 left-0"
                initial={{ opacity: 0, x: -500, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 500 }}
                transition={{
                    duration: 1,
                    delay: 0.5,
                }}
            >
                <Expenses />
            </motion.div>,
    }

    return (
        <div className="container px-2 md:px-8 py-8 h-full flex flex-col justify-center max-w-[1000px] gap-5 text-sm md:text-base">
            <div className="flex justify-between items-center border-b-2 pb-2">
                <h1>Itinerario - Mallorca 2025</h1>
                <div className="flex justify-center items-center gap-2">
                    <button
                        className='cursor-pointer px-2 py-1 border rounded-sm hover:scale-105 hover:bg-black hover:bg-opacity-35 transition-all'
                        style={{ backgroundColor: type === 'itineraries' ? 'black' : '' }}
                        onClick={() => setType('itineraries')}
                    >
                        Itinerario
                    </button>
                    <button
                        className='cursor-pointer px-2 py-1 border rounded-sm hover:scale-105 hover:bg-black hover:bg-opacity-35 transition-all'
                        style={{ backgroundColor: type === 'expenses' ? 'black' : '' }}
                        onClick={() => setType('expenses')}
                    >
                        Gastos
                    </button>
                </div>
            </div>
            <div className='relative'>
                <AnimatePresence initial={false}>
                    {comp[type]}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Home