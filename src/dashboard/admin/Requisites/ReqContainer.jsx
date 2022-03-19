import { useEffect } from 'react'
import { connect } from 'react-redux'
import { getRequisites, deleteReq } from '../../../Redux/Reducers/priceList.js'
import Requisites from './Requisites'
import { reduxForm } from 'redux-form'
import AddIcon from '@mui/icons-material/Add';
import {NavLink} from 'react-router-dom';

function ReqContainer({ requisites, changeReq, isReqLoaded, getRequisites, deleteReq }) {

    function onSubmit(formData) {
        console.log(formData)
    }

    useEffect(async () => {
        await getRequisites()
    }, [])

    return <div className='requisites-header'>
        <h2 className='requisites-header'>Wallets</h2>
        {isReqLoaded ? <WithReduxForm initialValues={requisites} onSubmit={onSubmit} deleteReq = {deleteReq}
         req={requisites} changeReq={changeReq} /> :
            <NavLink to='/dashboard/adminpricelist/addrequisites'>
            <div className='priceList-add-currency'>
                <AddIcon className='priceList-add-requisites-icon' />
            </div>
            </NavLink>
        }
    </div>
}

const WithReduxForm = reduxForm({ form: 'newReq' })(Requisites)

const mapStateToProps = (state) => ({
    requisites: state.PriceList.requisites,
    isReqLoaded: state.PriceList.isReqLoaded
})




export default connect(mapStateToProps, { getRequisites, deleteReq })(ReqContainer)