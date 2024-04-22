import './DashboardPage.css'
import {useState} from 'react'
import EditExpense from './EditExpense';
import { doc, updateDoc, deleteDoc} from "firebase/firestore";
import {db} from '../firebase'

function Expense({id, title, value}) {

  const [open, setOpen] = useState({edit:false, view:false})

  const handleClose = () => {
    setOpen({edit:false, view:false})
  }


   //function to delete a document from firstore */ 
  const handleDelete = async () => {
    const taskDocRef = doc(db, 'expenses', id)
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
        <p>{value}</p>
        <div className='task__buttons'>
          <div className='task__deleteNedit'>
            <button 
              className='task__editButton' 
              onClick={() => setOpen({...open, edit : true})}>
              Edit
            </button>
            <button className='task__deleteButton' onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>


      {open.edit &&
        <EditExpense
          onClose={handleClose} 
          toEditTitle={title} 
          toEditValue={value} 
          open={open.edit}
          id={id} />
      }

    </div>
  )
}

export default Expense