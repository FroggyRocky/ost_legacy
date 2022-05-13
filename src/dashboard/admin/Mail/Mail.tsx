import React, { ChangeEvent, useState} from "react"
import ClearIcon from '@mui/icons-material/Clear';
import { InjectedFormProps } from "redux-form"
import { Field } from "redux-form"
import {usersMailData} from '../../../Redux/Reducers/mail'
import './mail.css'


type OwnPropsType = {
    selectedUsers:Array<usersMailData>,
    getUsersData:() => void,
    selectUser:(email:string | null, id?:number) => void,
    users:Array<usersMailData>,
    deleteSelectedUser:(id:number) => void,
    clearSelectedUsers:() => void,
 }



export default function Mail(props:OwnPropsType & InjectedFormProps<OwnPropsType> & React.MouseEventHandler<HTMLElement>) { 

    const [currentChecked, setCurrentChecked] = useState<string | null>('all')
    const [filteredUsers, setFilteredUsers] = useState<Array<usersMailData>>([]);
    

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
  if(id != null) {
  if(props.selectedUsers.length > 0) {
    if(!props.selectedUsers.some(e => e.id === +id)) {
       props.selectUser(value, +id)
    }
  } else {
    console.log('first record')
    props.selectUser(value, +id)
  }
}
}

function deleteEmail(e:React.MouseEvent) {
  const id = +e.currentTarget.id
  props.deleteSelectedUser(id)
}



const searchOptions = filteredUsers.map((el):any => {
  return <div key={el.id} data-email = {el.email} data-id={el.id} className='mail-searchOption-container' onClick={handleSelectUser}>
    <div className="mail-searchOption-content">
        <span>{el.id} - {el.email}</span>
    </div>
  </div>
})


const selectedEmails = props.selectedUsers.map((el:any) => {
 return <div className='mail-selectedUsers-content'>
    <span className="mail-selectedUsers-email">{el.email}</span>
    <ClearIcon className="mail-selectedUsers-delete" id={el.id} onClick={deleteEmail} />
  </div>
})


 function handleSearchChange(e:ChangeEvent<HTMLInputElement>) {
  const currentState = e.target.value
  if(currentState != '') {
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
        {(currentChecked === 'select' && props.users.length) &&
         <section className='mail-search-container'>
          {props.selectedUsers.length > 0 && <div className="mail-selectedUsers-container">{selectedEmails}</div>}
          <Field className='mail-userSearch' name='search' component='input' placeholder="Search User" onChange={handleSearchChange} />
          {props.dirty && <div className='mail-search-dropDown'>
          {searchOptions}
            </div>}
          </section> }
        <section className="mail-info-container">
        <Field className='mail-subject' name='mailSubject' placeholder="Mail Subject" component='input' />
        <Field className="mail-textarea" placeholder="Mail text..." component='textarea' name="mailText" id="" cols={30} rows={10} />
        </section>
        <button className="mail-button">Send</button>
        </form>

}



