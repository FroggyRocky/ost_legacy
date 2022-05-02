import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import DropDown from '../../../common/DropDown'
import {getRefferalData, createReferralLink} from '../../../Redux/Reducers/settings'

function Referral(props) { 

const [linkType, setLinkType] = useState(null)

const link = 'www.hotspot.com'

useEffect(() => {
props.getRefferalData()
}, [])

function selectLinkType(linkType) {
setLinkType(linkType)
props.createReferralLink(linkType)
}



   return <div className="referral-container">
       <div className="referral-header-container">
        <h2 className="referral-header">Referrals</h2>
        </div>
    <DropDown dropDownOptions={props.linkTypes} selectOption={selectLinkType} placeholder={linkType} defaultPlaceholder='Choose link type' />
   <p>{props.referralLink}</p> 
    <p>Invited Users:{props.invitedReferrals}</p>
    <p>Balance:{props.referralRevenue}$</p>
    <p>Level of Referral programm:{props.referralLevel}</p>
   </div> 
}


const MapPropsToState = (state) => ({
    invitedReferrals:state.Settings.invitedReferrals,
    referralRevenue:state.Settings.referralRevenue,
    referralLevel:state.Settings.referralLevel,
    linkTypes:state.Settings.linkTypes,
    referralLink:state.Settings.referralLink
})

export default connect(MapPropsToState, {getRefferalData, createReferralLink})(Referral)