import {AppStateType} from '../../../Redux/store'
import {sendMail, getUsersData} from '../../../Redux/Reducers/mail'
import { connect } from "react-redux"
import { reduxForm } from 'redux-form';
import Mail from './Mail';

function MailContainer(props) {

function onSubmit(formData) {
    console.log(formData)
}

return <WithReduxForm {...props} onSubmit={onSubmit}/>

}



const WithReduxForm = reduxForm({form:'mail'})(Mail)

const mapStateProps = (state) => ({
    selectedUsers:state.Mail.selectedUsers
})

const mapDispatchProps = {
    sendMail,
    getUsersData
}

export default connect(mapStateProps, mapDispatchProps)(MailContainer)