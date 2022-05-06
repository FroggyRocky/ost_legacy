import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import DropDown from '../../../common/DropDown'
import {getRefferalData, createReferralLink} from '../../../Redux/Reducers/settings'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import './referral.css'
import Modal from '../../../common/Modal' 

function Referral(props) { 

const [linkType, setLinkType] = useState(null)
const [isModalOpen, setModalSate] = useState(false)


useEffect(() => {
props.getRefferalData()
}, [])

function selectLinkType(linkType) {
setLinkType(linkType)
props.createReferralLink(linkType)
}

function toggleModal(state) {
    setModalSate(state)
}

 
  const invitedEmails = props.invitedEmails.map((el) => {
      return <p>{el}</p>
  })

   return <div className="referral-container">
       {isModalOpen && <div className='referral-modal'>
       <Modal header='Your last referrals' text={invitedEmails} closeModal={toggleModal} smallModal={true}/>
       </div>}
       <div className="referral-header-container">
        <h2 className="referral-header">Referrals</h2>
        </div>
 
   
   <p className="referral-text">Your referral program status :&nbsp;<b>{props.referralLevel}%</b></p> 
    <p className="referral-text referrals">Your referrals :&nbsp;
    <b>{props.usersInvited}</b>
    <ErrorOutlineIcon className='referrals-icon' style={{fontSize:22}} onClick={() => toggleModal(true)}  />
    </p>
    <p className="referral-text">Revenue :&nbsp; 
    <b className='referral-revenue'>{props.referralRevenue}$</b>
    </p>
    <DropDown dropDownOptions={props.linkTypes} selectOption={selectLinkType} placeholder={linkType} defaultPlaceholder='Choose link type' />
   <p className="referral-link">{props.referralLink}</p>
   <div className="referral-breaking-line"></div>
   </div> 
}


const MapPropsToState = (state) => ({
    usersInvited:state.Settings.usersInvited,
    referralRevenue:state.Settings.referralRevenue,
    referralLevel:state.Settings.referralLevel,
    linkTypes:state.Settings.linkTypes,
    referralLink:state.Settings.referralLink,
    invitedEmails:state.Settings.invitedEmails
})

export default connect(MapPropsToState, {getRefferalData, createReferralLink})(Referral)