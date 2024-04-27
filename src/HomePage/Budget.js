import './HomePage.css'
import {useState} from 'react'
import EditBudget from './EditBudget';
import { doc, updateDoc, deleteDoc} from "firebase/firestore";
import {db} from '../firebase'

function Budget({id, title, budgetAmount}) {

  const [open, setOpen] = useState({edit:false, add:false})

  const handleClose = () => {
    setOpen({edit:false, add:false})
  }


   //function to delete a document from firstore */ 
  const handleDelete = async () => {
    const taskDocRef = doc(db, 'budget', id)
    try{
      await deleteDoc(taskDocRef)
    } catch (err) {
      alert(err)
    }
 }
  

  return (
      <div>
      <div className='task__body'>
        <h2>{title}</h2>
        <p>{budgetAmount}</p>
        <div className='task__buttons'>
          <div className='task__deleteNedit'>
            <button 
              className='task__editButton' 
              onClick={() => setOpen({...open, edit : true})}>
              Edit
            </button>
            <button 
              className='task__addButton' 
              onClick={() => setOpen({...open, add : true})}>
              Add Expense
            </button>
            <button className='task__deleteButton' onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>


      {open.edit &&
        <EditBudget
          onClose={handleClose} 
          toEditTitle={title} 
          toEditBudgetAmount={budgetAmount} 
          open={open.edit}
          id={id} />
      }


    </div>
  )
}

export default Budget