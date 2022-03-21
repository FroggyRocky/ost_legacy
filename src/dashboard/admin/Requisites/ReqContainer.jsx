import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getRequisites, deleteReq, updateReq } from '../../../Redux/Reducers/priceList.js'
import Requisites from './Requisites'
import { reduxForm } from 'redux-form'
import AddIcon from '@mui/icons-material/Add';
import {NavLink} from 'react-router-dom';


function ReqContainer({ requisites, isReqLoaded, getRequisites, deleteReq, updateReq}) {

const [initialValues, setInitialValues] = useState({})

// function getInitialValue() {
//       for(let i = 0; i < requisites?.length; i++) {
//             setInitialValues(prev => ({
//                 ...prev,
//                 [requisites[i].currency_ticker]:requisites[i].requisites
//             }))
//         }
// }

    useEffect(async() => {
        // await getRequisites();
    }, [requisites])


   async function onSubmit(data) {
           await updateReq(data)
    }

    useEffect(async () => {
        await getRequisites();
    }, [])

    return <div className='requisites-header'>
        <h2 className='requisites-header'>Wallets</h2>
        {isReqLoaded ? <WithReduxForm onSubmit={onSubmit} deleteReq = {deleteReq}
         req={requisites} /> :
            <NavLink to='/dashboard/adminpricelist/addrequisites'>
            <div className='priceList-add-currency'>
                <AddIcon className='priceList-add-requisites-icon' />
            </div>
            </NavLink>
        }
    </div>
}

const WithReduxForm = reduxForm({ form: 'newReq', destroyOnUnmount: false })(Requisites)

const mapStateToProps = (state) => ({
    requisites: state.PriceList.requisites,
    isReqLoaded: state.PriceList.isReqLoaded,
})




export default connect(mapStateToProps, { getRequisites, deleteReq, updateReq})(ReqContainer)