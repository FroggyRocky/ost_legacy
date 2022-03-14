import { reduxForm } from 'redux-form';
import TopUp from './TopUp';
import {setPaymentData, setDropDownState} from '../../../Redux/Reducers/settings'
import { connect } from 'react-redux';
import {useState} from 'react'
import AdminAPI from '../../../api/AdminAPI'

 function TopUpContainer(props) {

const [error, setError] = useState('')
const [currency, setCurrency] = useState('')
async function onSubmit(data) {
    const formData = {
        ...data,
        coin:currency || 'BTC'
        }
    const ticketTypeId = await AdminAPI.getBalanceTicketTypeId('Balance')
    const ticketData = {
        ticketTypeId:ticketTypeId.data.id,
        userId:props.user.id,
        title:'TOP UP'
    } 
    await props.setPaymentData(formData, ticketData)
}
    return <>
    <WithReduxForm onSubmit={onSubmit} {...props} currency={currency} 
    setCurrency={setCurrency} customError = {error} setDropDownState={props.setDropDownState} 
    isDropDownOpen={props.isDropDownOpen}
    />
    </>
 }

const WithReduxForm = reduxForm({form:'Top-up'})(TopUp)

const mapStateToProps = (state) => ({
    isTicketCreated: state.Settings.topUp.isTicketCreated,
    isRequestSending:state.Settings.topUp.isRequestSending,
    createdTicketId:state.Settings.topUp.createdTicketId,
    isDropDownOpen:state.Settings.isDropDownOpen
})

export default connect(mapStateToProps, {setPaymentData,setDropDownState})(TopUpContainer)
