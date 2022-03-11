import { reduxForm } from 'redux-form';
import TopUp from './TopUp';
import {setPaymentData} from '../../../Redux/Reducers/settings'
import { connect } from 'react-redux';
import {useState} from 'react'
import AdminAPI from '../../../api/AdminAPI'

 function TopUpContainer(props) {

const [error, setError] = useState('')

async function onSubmit(formData) {
    const ticketTypeId = await AdminAPI.getBalanceTicketTypeId('Balance');
    
    const ticketData = {
        ticketTypeId:ticketTypeId.data.id,
        userId:props.user.id,
        title:'TOP UP'
    } 
    if(!formData.coin) {
        formData.coin = 'BITCOIN'
    } else await props.setPaymentData(formData, ticketData)
}

    return <>
    <WithReduxForm onSubmit={onSubmit} {...props} customError = {error} />
    </>
} 


const WithReduxForm = reduxForm({form:'Top-up'})(TopUp)

const mapStateToProps = (state) => ({
    isTicketCreated: state.Settings.topUp.isTicketCreated,
    isRequestSending:state.Settings.topUp.isRequestSending,
    createdTicketId:state.Settings.topUp.createdTicketId
})

export default connect(mapStateToProps, {setPaymentData})(TopUpContainer)
