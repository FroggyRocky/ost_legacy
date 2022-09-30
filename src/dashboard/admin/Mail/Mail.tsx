import React, { ChangeEvent, useEffect, useState} from "react"
import ClearIcon from '@mui/icons-material/Clear';
import { InjectedFormProps } from "redux-form"
import { Field } from "redux-form"
import {usersMailData} from '../../../Redux/Reducers/mail'
import Modal from '../../../common/Modal'
import './mail.css'



type OwnPropsType = {
    selectedUsers:Array<any>,
    users:Array<usersMailData>,
    isMailSent:boolean | null,
    isMailSending:boolean,
    getUsersData:() => void,
    selectUser:(email:string | null, id?:number) => void,
    deleteSelectedUser:(id:number, email:string) => void,
    clearSelectedUsers:() => void,
    setSentState:(state:boolean | null) => void,
    setSendingState:(state:boolean) => void
 }



export default function Mail(props:OwnPropsType & InjectedFormProps<OwnPropsType> & React.MouseEventHandler<HTMLElement>) { 

    const [currentChecked, setCurrentChecked] = useState<string | null>('all')
    const [filteredUsers, setFilteredUsers] = useState<Array<any>>([]);
    const [searchState, setSearchState] = useState<string>('')
  
    useEffect(() => {
      if(props.isMailSent === true) {
      setFilteredUsers([])
      props.getUsersData()
      }
    }, [props.isMailSent])


 function closeModal(state:boolean) {
   if(state === false) {
   props.setSentState(null)
   props.setSendingState(false)
   } 
 }

function handleRadioChange(e:ChangeEvent<HTMLInputElement>) {
    const type = e.target.getAttribute('name');
    setCurrentChecked(type)
    if(type === 'select') {
        props.getUsersData()
    } else if (type === 'all') {
      props.clearSelectedUsers()
    }
 }

function handleSelectUser(e:React.MouseEvent) {
  const value = e.currentTarget.getAttribute('data-email')
  const id = e!.currentTarget!.getAttribute('data-id')
  if(id) {
  if(props.selectedUsers.length > 0) {
    if(!props.selectedUsers.some(e => e.id === +id)) {
       props.selectUser(value, +id)
       const filtered = filteredUsers.filter(el => +el.id !== +id)
       setFilteredUsers(filtered)
       props.change('search', '')
       setSearchState('')
    }
  } else {
    props.selectUser(value, +id)
    const filtered = filteredUsers.filter(el => +el.id !== +id)
    setFilteredUsers(filtered)
    props.change('search', '')
    setSearchState('')
  }
}

}

function deleteEmail(e:React.MouseEvent) {
  const id = +e.currentTarget.id
  const email = e.currentTarget.getAttribute('data-email')
  if(id && email) {
  props.deleteSelectedUser(id, email)
  setFilteredUsers((prev) => [...prev, {id,email}])
  }
}



const searchOptions = filteredUsers.map((el):any => {
  return <div key={el.id} data-email = {el.email} data-id={el.id} className='mail-searchOption-container' onClick={handleSelectUser}>
    <div className="mail-searchOption-content">
        <span>{el.id} - {el.email}</span>
    </div>
  </div>
})


const selected = props.selectedUsers.map((el:any) => {
 return <div className='mail-selectedUsers-content' key={el.id}>
    <span className="mail-selectedUsers-email">{el.email}</span>
    <ClearIcon className="mail-selectedUsers-delete" id={el.id} data-email={el.email} onClick={deleteEmail} />
  </div>
})




 function handleSearchChange(e:ChangeEvent<HTMLInputElement>) {
  const currentState = e.target.value
  setSearchState(currentState)
  if(currentState) {
  if(+currentState) {
    const filtered = props.users.filter(user => user.id === +currentState)
    setFilteredUsers(filtered)
  } else {
    const filtered = props.users.filter(user => user.email.includes(currentState))
    setFilteredUsers(filtered)
  }
  } else {
    setFilteredUsers([])
  }
 }




    return <form className='mail-container' onSubmit={props.handleSubmit}>
      {props.isMailSent && <Modal smallModal={true} closeModal={closeModal}
       header={props.isMailSent === true ? 'Success!' : 'Failure!'}  
       text={props.isMailSent === true ? 'Your Email Successfully Sent' : 'Something went wrong'}/> }
          <h1>Mail</h1>
        <section className='mail-checkbox-container'>
        <label className='mail-checkbox-content'>
              <input
              className="mail-checkbox"
                type="radio"
                name="all"
                onChange={handleRadioChange}
                checked={currentChecked === 'all'}
              />
              <div className="mail-checkbox-title">All</div>
            </label>
            <label className='mail-checkbox-content'>
              <input
              className="mail-checkbox"
                type="radio"
                name="select"
                onChange={handleRadioChange}
                checked={currentChecked === 'select'}
              />
              <div className="mail-checkbox-title">Select Users</div>
            </label>
            </section>
        {(currentChecked === 'select' && props.users.length > 0) && <>
        {props.selectedUsers.length > 0 && <div className="mail-selectedUsers-container">{selected}</div>}
         <section className='mail-search-container'>
          <Field className='mail-userSearch' name='search' component='input' autoComplete="off" placeholder="Search User" onChange={handleSearchChange} />
          {searchState && <div className='mail-search-dropDown'>
          {searchOptions}
            </div>}
          </section> </>}
        <section className="mail-info-container">
        <Field className='mail-subject' name='mailSubject' autoComplete="off" placeholder="Mail Subject" component='input'  />
        <Field className="mail-textarea" required placeholder="Mail text..." autoComplete="off" component='textarea' name="mailText" id="" cols={30} rows={10} />
        </section>
        <button className={(props.isMailSending) ? 'mail-button--disabled' : 'mail-button'}
          disabled={props.isMailSending}>{props.isMailSending ? 'Sending...' : 'Send'}</button>
        </form>

}



