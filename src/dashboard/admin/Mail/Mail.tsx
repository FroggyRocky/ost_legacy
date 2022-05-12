import React, { useState } from "react"
import { connect } from "react-redux"
import DropDown from "../../../common/DropDown"
import {AppStateType} from '../../../Redux/store'
import {setMailOption} from '../../../Redux/Reducers/mail'
import './mail.css'



function Mail(props:Props) {




const [currentOption, setCurrentOption] = useState<string>()


function selectOption(option:string) {
    setCurrentOption(option)
}


    return <div>
        <h1>Mail</h1>
        <DropDown selectOption={selectOption} placeholder={currentOption} defaultPlaceholder='Choose Mail Options' dropDownOptions={props.mailOptions} /> 
        <textarea className="mail-textarea" name="" id="" cols={30} rows={10}></textarea>
    </div>
}

type Props = mapStateType & mapDispatchType & OwnProps

type OwnProps = {

}

type mapStateType = {
    mailOption:string | null,
    mailOptions:Array<string>
}
const mapStateProps = (state:AppStateType) => ({
mailOption:state.Mail.mailOption,
mailOptions:state.Mail.mailOptions
})

type mapDispatchType = {
    setMailOption: (option:string) => void
}

const mapDispatchProps = {
    setMailOption,
}

export default connect<mapStateType, mapDispatchType, OwnProps, AppStateType>(mapStateProps, mapDispatchProps)(Mail)