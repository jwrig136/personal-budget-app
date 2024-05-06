import '../HomePage/HomePage.scss'
import { useState } from 'react';
import { collection, query, where, getAggregateFromServer, sum } from 'firebase/firestore'
import { db } from '../firebase';
import './BudgetTable.scss';

function BudgetTable({ id, title, budgetAmount }) {
    const [sumOfExpenses, setSumOfExpenses] = useState();
    const [leftover, setLeftover] = useState();

    async function totalExpenseAmount() {
        const items = query(collection(db, 'expenses'), where('budgetId', '==', id))
        const snapshot = await getAggregateFromServer(items, {
            sum: sum('expenseAmount')
        });

        setSumOfExpenses((parseFloat(snapshot.data().sum)).toFixed(2))
        if (sumOfExpenses != undefined) {
            setLeftover((parseFloat(budgetAmount) - sumOfExpenses).toFixed(2));
        }

    }

    totalExpenseAmount();

    return (
        <>
            <tr>
                <td>{title}</td>
                <td>${budgetAmount}</td>
                <td>${sumOfExpenses}</td>
                <td>${leftover}</td>
            </tr>
        </>

    )
}

export default BudgetTable