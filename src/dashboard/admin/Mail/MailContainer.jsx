
import {sendMail, getUsersData, selectUser, deleteSelectedUser, clearSelectedUsers} from '../../../Redux/Reducers/mail'
import { connect } from "react-redux"
import { reduxForm } from 'redux-form';
import Mail from './Mail';

function MailContainer(props) {

function onSubmit(formData) {
  const {mailText, mailSubject}  = formData
  props.sendMail(mailText, mailSubject)
}

return <WithReduxForm {...props} onSubmit={onSubmit}/>

}



const WithReduxForm = reduxForm({form:'mail'})(Mail)

const mapStateProps = (state) => ({
    selectedUsers:state.Mail.selectedUsers,
    users:state.Mail.users
})

const mapDispatchProps = {
    sendMail,
    getUsersData,
    selectUser,
    deleteSelectedUser,
    clearSelectedUsers
}

export default connect(mapStateProps, mapDispatchProps)(MailContainer)