import React, { useCallback, useEffect, useState } from 'react'
import { addExpenseAction, addPersonAction, deleteExpenseAction, deletePersonAction, editExpensesAction, editPersonsAction, getExpensesAction, getPersonsAction } from '@/app/actions'
import { Expense, ModalEditData, Persons } from '@/lib/types'
import ModalExpenses from '../modal-expenses'
import TableControls from '../table-controls'
import Loader from '../loader'
import { createClient } from '@/utils/supabase/client'
import EmptyState from '../empty-state'
import { formatter } from '@/lib/utils'

const Expenses = () => {
    const supabase = createClient();
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [persons, setPersons] = useState<Persons[]>([])
    const [calculateResult, setCalculateResult] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState<Partial<ModalEditData>>()
    const [loadingExpenses, setLoadingExpenses] = useState(true)
    const [loadingPersons, setLoadingPersons] = useState(true)

    const getExpenses = useCallback(async () => {
        setLoadingExpenses(true)
        try {
            const data = await getExpensesAction() as Expense[]
            setExpenses(data || []);
        } catch (error) {
            console.log(error)
        }
        setLoadingExpenses(false)
    }, [])

    const getPersons = useCallback(async () => {
        setLoadingPersons(true)
        try {
            const data = await getPersonsAction() as Persons[]
            setPersons(data || []);
        } catch (error) {
            console.log(error)
        }
        setLoadingPersons(false)
    }, [])

    useEffect(() => {
        getExpenses()
    }, [getExpenses])

    useEffect(() => {
        getPersons()
    }, [getPersons])

    const openModalFunc = (type: string, data?: Persons | Expense) => {
        setModalData({
            type,
            ...data
        })
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
    }

    const calculate = () => {
        const totalCost = sumExpenses(expenses).replace(',', '.')
        const totalCostNumber = Number(totalCost.slice(1))
        const rest = totalCostNumber / persons.length
        const arr = [...persons]
        persons.forEach(p => {
            const result = Number(p.amount) - rest
            let resultString = ''
            let bgColor = ''
            if (result > 0) {
                resultString = 'Recibe'
                bgColor = '#22c55e40'
            }
            if (result < 0) {
                resultString = 'Paga'
                bgColor = '#ef444440'
            }
            if (result === 0) {
                resultString = '-'
                bgColor = '#0f172a40'
            }
            const personIndex = persons.findIndex(pr => pr.id === p.id)
            arr.splice(personIndex, 1,
                {
                    ...p, diff: result,
                    text: `${resultString} ${formatter.format(Math.abs(result))}`,
                    bgColor,
                }
            )
        })
        setPersons(arr)
        setCalculateResult(true)
    }

    const onSubmit = async (formData: FormData, id?: number) => {
        const isExpense = modalData?.type === 'expense'
        try {
            if (id) {
                isExpense ? await editExpensesAction(formData, id) : await editPersonsAction(formData, id)
            } else {
                isExpense ? await addExpenseAction(formData) : await addPersonAction(formData)
            }
            setModalData(undefined)
            setOpenModal(false)
        } catch (error) {
            console.log(error)
        }
    }

    const onDelete = async (type: string, id: number) => {
        const isExpense = type === 'expense'
        try {
            isExpense ? await deleteExpenseAction(id) : await deletePersonAction(id)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const channel = supabase
            .channel('expenses-persons')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'persons',
                },
                () => {
                    getPersons()
                    setCalculateResult(false)
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'expenses',
                },
                () => {
                    getExpenses()
                    setCalculateResult(false)
                }
            )
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [supabase, persons, expenses])

    const sumExpenses = useCallback((expenses: Expense[]) => {
        return formatter.format(expenses.reduce(
            (accumulator, expense) => accumulator + Number(expense.amount),
            0,
        ))
    }, [])

    return (
        <div className='flex flex-col gap-2'>
            <div className="flex justify-end items-center">
                <div className="flex justify-center items-center">
                    <button
                        className='bg-white text-slate-900 cursor-pointer px-2 py-1 border rounded-sm hover:scale-105 hover:bg-opacity-50 transition-all'
                        onClick={() => openModalFunc('expense')}
                    >
                        Agregar gasto
                    </button>
                </div>
            </div>
            <div className="max-h-[500px] overflow-hidden overflow-y-scroll rounded-sm border">
                {
                    loadingExpenses ?
                        <div className='bg-black bg-opacity-40 w-full flex justify-center items-center p-10'>
                            <Loader />
                        </div> :
                        !expenses.length ? <EmptyState text='Todavia no agregaste ningun gasto' /> :
                            <table className='w-full border-hidden'>
                                <tbody>
                                    <tr className='bg-slate-600 border-b'>
                                        <th>Detalle</th>
                                        <th>Monto</th>
                                    </tr>
                                    {expenses.map((e) => (
                                        <tr key={e.id} className='border-b bg-slate-900 bg-opacity-40'>
                                            <td className='py-2 border-r'>
                                                {e.detail}
                                            </td>
                                            <td className='flex justify-end py-2'>
                                                <span className='border-r pr-1'>{formatter.format(Number(e.amount))}</span>
                                                <TableControls
                                                    onDelete={() => onDelete('expense', e.id)}
                                                    onEdit={() => openModalFunc('expense', e)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className='bg-yellow-900 bg-opacity-40'>
                                        <td className='py-2'>
                                            Gasto total
                                        </td>
                                        <td className='py-2 text-end pr-1'>
                                            {sumExpenses(expenses)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                }
            </div>
            <div className='bg-slate-700 flex items-center justify-between border rounded-sm px-1 py-1'>
                <h1>Divisor de gastos</h1>
                <div className="flex justify-center items-center gap-2">
                    <button
                        className='cursor-pointer px-2 py-1 border rounded-sm hover:scale-105 hover:bg-black hover:bg-opacity-35 transition-all'
                        onClick={() => openModalFunc('person')}
                    >
                        Agregar persona
                    </button>
                    <button
                        className='px-2 py-1 border rounded-sm hover:scale-105 hover:bg-black hover:bg-opacity-35 transition-all disabled:bg-gray-600'
                        onClick={calculate}
                        disabled={!expenses.length || !persons.length}
                    >
                        Calcular
                    </button>
                </div>
            </div>
            <div className="max-h-[500px] overflow-hidden overflow-y-scroll rounded-sm border">
                {
                    loadingPersons ?
                        <div className='bg-black bg-opacity-40 w-full flex justify-center items-center p-10'>
                            <Loader />
                        </div> :
                        !persons.length ? <EmptyState text='Todavia no agregaste ninguna persona' /> :
                            <table className='w-full border-hidden'>
                                <tbody>
                                    <tr className='bg-slate-600 border-b'>
                                        <th>Nombre</th>
                                        <th colSpan={!calculateResult ? 2 : 1}>Gastado</th>
                                        {
                                            calculateResult ?
                                                <th colSpan={2}>Cuanto corresponde</th> : <></>
                                        }
                                    </tr>
                                    {persons.map((p) => (
                                        <tr
                                            key={p.id}
                                            className='border-b bg-slate-900 bg-opacity-40 bg-red'
                                            style={{ backgroundColor: p?.bgColor }}
                                        >
                                            <td className='py-2'>
                                                {p.name}
                                            </td>
                                            <td className='py-2 border-x text-end pr-1'>
                                                {formatter.format(Number(p.amount))}
                                            </td>
                                            {
                                                p?.text ?
                                                    <td className='py-2 pr-1 text-end border-r'>
                                                        {p.text}
                                                    </td> : <></>
                                            }
                                            <td className='w-1 py-2'>
                                                <TableControls
                                                    onDelete={() => onDelete('person', p.id)}
                                                    onEdit={() => openModalFunc('person', p)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                }
            </div>
            <ModalExpenses
                closeModal={closeModal}
                onSubmit={onSubmit}
                open={openModal}
                modalData={modalData}
            />
        </div>
    )
}

export default Expenses