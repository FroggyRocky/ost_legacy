import AdminAPI from "../../api/AdminAPI";
import UserAPI from '../../api/UserAPI'
import {webURL} from '../../api/URL'
import {setPopUpState} from './login'

const SET_TOP_UP_DATA = "Reducers/settings/SET_TOP_UP_DATA";
const SET_PAYMENT_TICKET_STATUS = "Reducers/settings/SET_PAYMENT_TICKET_STATUS";
const SET_PAYMENT_REQUEST_STATUS = 'Reducers/settings/SET_PAYMENT_REQUEST_STATUS'
const SET_DROP_DOWN_STATE = 'Reducers/settings/SET_DROP_DOWN_STATE'
const SET_REFERRAL_DATA = 'Reducers/settings/SET_REFERRAL_DATA'
const SET_REFERRAL_LINK = 'Reducers/settings/SET_REFERRAL_LINK'

const initialState = {
  topUp: {
    coin: "",
    amount: 0,
    creatorEmail:'',
    createdTicketId: null,
    isTicketCreated: false,
    isRequestSending:false
  },
  isDropDownOpen:false, // top-up drop down
  invitedReferrals:null,
  referralRevenue:null,
  referralLevel:null,
  userId:null, // userReferral Id
  linkTypes:['login', 'registration'],
  referralLink:null
};

export default function settings(state = initialState, action) {
  switch (action.type) {
    case SET_TOP_UP_DATA:
      return {
        ...state,
        topUp: {
          ...state.topUp,
          coin: action.coin,
          amount: action.amount,
          creatorEmail:action.creatorEmail,
          createdTicketId: action.createdTicketId,
        },
      };
    case SET_PAYMENT_TICKET_STATUS:
      return {
        ...state,
        topUp: {
          ...state.topUp,
          isTicketCreated: action.status,
        },
      };
      case SET_PAYMENT_REQUEST_STATUS:
        return {
          ...state,
          topUp: {
            ...state.topUp,
            isRequestSending:action.status
          }
        }
        case SET_DROP_DOWN_STATE: 
        return {
          ...state,
          isDropDownOpen:action.state
        }
        case SET_REFERRAL_DATA: 
        return {
          ...state,
          invitedReferrals:action.invitedReferrals,
          referralRevenue:action.referralRevenue,
          referralLevel:action.referralLevel,
          userId:action.userId
        }
        case SET_REFERRAL_LINK:
          return {
            ...state,
            referralLink:action.link
          }
    default:
      return {
        ...state,
      };
  }
}

const setTopUpData = (coin, amount, createdTicketId, creatorEmail) => ({
  type: SET_TOP_UP_DATA,
  coin,
  amount,
  creatorEmail,
  createdTicketId,
});
const setDropDownState = (state) => ({type:SET_DROP_DOWN_STATE, state})

const setPaymentTicketStatus = (status) => ({
  type: SET_PAYMENT_TICKET_STATUS,
  status,
});

const setRequestStatus = (status) => ({type:SET_PAYMENT_REQUEST_STATUS, status})

const setReferralData = (invitedReferrals,referralRevenue,referralLevel, userId ) => 
({type:SET_REFERRAL_DATA,invitedReferrals,referralRevenue,referralLevel, userId })

const setReferralLink = (link) => ({type:SET_REFERRAL_LINK, link})

async function setPaymentAutoMessage(ticketId, userId, message) {
    const data = {
      ticketId: ticketId,
      userId: userId,
      message: message,
    }
   return AdminAPI.setBalanceAutoMessage({...data});
}

function setCryptoAddress(coin, requisites) {
  const reqNum = requisites.filter(el => el.currency_ticker === coin);
  return reqNum[0]
}

const setPaymentData = (formData, ticketData) => async (dispatch, getState) =>  {
  const {PriceList} = await getState();
      dispatch(setRequestStatus(true))
  const { coin, amount } = formData;
  const {userId} = ticketData
  const {currency_name, currency_ticker, requisites} = setCryptoAddress(coin,PriceList.requisites);
  const fullCurrencyName = `${currency_name} ( ${currency_ticker} )`
  const UserAutoMessgae = `${fullCurrencyName} ${amount}$`;
  
  const AdminAutoMessage = `HELLO! HERE YOUR ${fullCurrencyName} ADDRESS: ${requisites}`;
  const res = await AdminAPI.ticketCreateOrUpdate(ticketData);
  if (res.status === 200) {
    const tickets = await AdminAPI.getTickets();
    if (tickets.status === 200) {
    const createdTicketId = tickets.data.tickets[0].id;
    const res = await setPaymentAutoMessage(createdTicketId, userId, UserAutoMessgae);
    const res1 = await setPaymentAutoMessage(createdTicketId, 1, AdminAutoMessage);
    const res3 = await UserAPI.getUserEmailById(userId)

    if(res.status === 200 && res1.status === 200 && res3.status === 200) {
      dispatch(setTopUpData(coin, amount, createdTicketId,res3.data));
      dispatch(setPaymentTicketStatus(true));
      dispatch(setRequestStatus(false));
    }
    
    }
  }
};


const getRefferalData = () => async (dispatch) => {
  const res = await UserAPI.getReferralData()
  const {invited_referrals,referral_revenue,referral_level, userId } = res.data
  dispatch(setReferralData(invited_referrals,referral_revenue, referral_level, userId))
}

const createReferralLink = (linkType) => async (dispatch,getState) => {
  const settingsState = await getState().Settings
  const link = `${webURL}/${linkType}?referral_id=${settingsState.userId}`
  dispatch(setReferralLink(link))
  

}


export { setPaymentData, setPaymentTicketStatus, setDropDownState, getRefferalData, createReferralLink };
