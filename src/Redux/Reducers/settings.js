import AdminAPI from "../../api/AdminAPI";
import UserAPI from '../../api/UserAPI'
import {webURL} from '../../api/URL'



const SET_TOP_UP_DATA = "Reducers/settings/SET_TOP_UP_DATA";
const SET_PAYMENT_TICKET_STATUS = "Reducers/settings/SET_PAYMENT_TICKET_STATUS";
const SET_PAYMENT_REQUEST_STATUS = 'Reducers/settings/SET_PAYMENT_REQUEST_STATUS'
const SET_DROP_DOWN_STATE = 'Reducers/settings/SET_DROP_DOWN_STATE'
const SET_REFERRAL_DATA = 'Reducers/settings/SET_REFERRAL_DATA'
const SET_REFERRAL_LINK = 'Reducers/settings/SET_REFERRAL_LINK'
const SET_INVITED_EMAILS = 'Reducers/settings/SET_INVITED_EMAILS'


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
  usersInvited:null,
  referralRevenue:null,
  referralLevel:null,
  userId:null, // userReferral Id
  linkTypes:['Landing', 'Registration'],
  referralLink:null,
  invitedEmails:[]
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
          usersInvited:action.usersInvited,
          referralRevenue:action.referralRevenue,
          referralLevel:action.referralLevel,
          userId:action.userId
        }
        case SET_REFERRAL_LINK:
          return {
            ...state,
            referralLink:action.link
          }
          case SET_INVITED_EMAILS:
            return {
              ...state,
              invitedEmails:[...action.emails]
            }
    default:
      return {
        ...state,
        referralId:action.id
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

const setReferralData = (usersInvited,referralRevenue,referralLevel, userId ) => 
({type:SET_REFERRAL_DATA,usersInvited,referralRevenue,referralLevel, userId })

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
  console.log(PriceList)
      dispatch(setRequestStatus(true))
  const { coin, amount } = formData;
  const {userId} = ticketData
  const {currency_name, currency_ticker, requisites, id} = setCryptoAddress(coin,PriceList.requisites);
  ticketData.requisiteId = id
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
const setInvitedEmails = (emails) => ({type:SET_INVITED_EMAILS, emails})


const getRefferalData = () => async (dispatch) => {
  const res = await UserAPI.getReferralData()
  const res2 = await UserAPI.getInvitedEmails()
  
  if(res.status === 200 && res2.status === 200) {
    const invitedEmails = res2.data.map((el) => {
      return el.email
    })
    dispatch(setInvitedEmails(invitedEmails))
  const {users_invited,referral_revenue,referral_level, userId } = res.data
  dispatch(setReferralData(users_invited,referral_revenue, referral_level, userId))
  }
}

const createReferralLink = (linkType) => async (dispatch,getState) => {
  const settingsState = await getState().Settings
    const link = `${webURL}/${linkType?.toLowerCase()}/referral_id=${settingsState.userId}`
    dispatch(setReferralLink(link))
  }
  




export { setPaymentData, setPaymentTicketStatus, setDropDownState, getRefferalData, createReferralLink};
