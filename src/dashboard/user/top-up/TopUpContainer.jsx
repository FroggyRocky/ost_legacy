import {reduxForm} from 'redux-form';
import TopUp from './TopUp';
import {setPaymentData} from '../../../Redux/Reducers/settings'
import {connect} from 'react-redux';
import {useEffect, useState} from 'react'
import AdminAPI from '../../../api/AdminAPI'
function TopUpContainer(props) {

    const [topUpData, setTopUpData] = useState({currencyTicker: '', currencyId: '', userEmail: ''})
    useEffect(() => {
        if (props.requisites && props.requisites.length !== 0) {
            setTopUpData({
                currencyTicker: props.requisites[0].currency_ticker,
                currencyId: props.requisites[0].id,
                userEmail: props.user.email
            })
        }
    }, [props.requisites, props.user])

    async function onSubmit(data) {
        const formData = {
            ...data,
            currencyTicker: topUpData.name,
            userEmail: topUpData.userEmail
        }
        const ticketTypeId = await AdminAPI.getBalanceTicketTypeId('Balance')
        const ticketData = {
            ticketTypeId: ticketTypeId.data.id,
            userId: props.user.id,
            title: 'TOP UP',
            requisiteId: topUpData.currencyId
        }
        await props.setPaymentData(formData, ticketData)
    }

    return <>
        <WithReduxForm onSubmit={onSubmit} {...props} topUpData={topUpData}
                       setTopUpData={setTopUpData}
                       isDropDownOpen={props.isDropDownOpen} requisites={props.requisites}
        />
    </>
}

const WithReduxForm = reduxForm({form: 'Top-up'})(TopUp)

const mapStateToProps = (state) => ({
    isTicketCreated: state.Settings.topUp.isTicketCreated,
    isRequestSending: state.Settings.topUp.isRequestSending,
    createdTicketId: state.Settings.topUp.createdTicketId,
    isDropDownOpen: state.Settings.isDropDownOpen,
    requisites: state.PriceList.requisites
})

export default connect(mapStateToProps, {setPaymentData})(TopUpContainer)
