import React, { ChangeEvent, useState } from "react"

import { InjectedFormProps } from "redux-form"
import { Field } from "redux-form"

import './mail.css'

type OwnPropsType = {
    selectedUsers:Array<string>,
    getUsersData:() => void
}

export default function Mail(props:OwnPropsType & InjectedFormProps<OwnPropsType>) { 

    const [currentChecked, setCurrentChecked] = useState<string | null>()


function handleRadioChange(e:ChangeEvent<HTMLInputElement>) {
    const type = e.target.getAttribute('name');
    setCurrentChecked(type)
    if(type === 'select') {
        props.getUsersData()
    }
 }

 function handleSearchChange() {

 }

    return <div>
        <h1>Mail</h1>
        <form onSubmit={props.handleSubmit}>
        <div className='mail-checkbox-container'>
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
            </div>
        {currentChecked === 'select' && <Field className='main-userSearch' component='input' onChange={handleSearchChange} />}
        <Field className='mail-subject' placeholder="Mail Subject" component='input' />
        <Field className="mail-textarea" component='textarea' name="mailText" id="" cols={30} rows={10} />
        <button>Send</button>
        </form>
    </div>

}



