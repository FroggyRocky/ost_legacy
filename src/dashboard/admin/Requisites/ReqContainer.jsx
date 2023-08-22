import {useEffect} from 'react'
import {connect} from 'react-redux'
import {deleteReq, getRequisites, updateReq} from '../../../Redux/Reducers/priceList.js'
import Requisites from './Requisites'
import {reduxForm} from 'redux-form'
import AddIcon from '@mui/icons-material/Add';
import {NavLink} from 'react-router-dom';


function ReqContainer({requisites, isReqLoaded, getRequisites, deleteReq, updateReq}) {

    useEffect(async () => {
        // await getRequisites();
    }, [requisites])


    async function onSubmit(data) {
        console.log(data)
        await updateReq(data)
    }

    useEffect(async () => {
        async function fetchReq() {
            await getRequisites();
        }

        fetchReq()
            .catch(e => {
                console.log(e)
            })
    }, [])

    return <div className='requisites-header'>
        <h2 className='requisites-header'>Wallets</h2>
        {isReqLoaded ? <WithReduxForm onSubmit={onSubmit} deleteReq={deleteReq}
                                      req={requisites} getRequisites={getRequisites}/> :
            <NavLink to='/dashboard/adminpricelist/addrequisites'>
                <div className='priceList-add-currency'>
                    <AddIcon className='priceList-add-requisites-icon'/>
                </div>
            </NavLink>
        }
    </div>
}

const WithReduxForm = reduxForm({form: 'reqForm', destroyOnUnmount: false})(Requisites)

const mapStateToProps = (state) => ({
    requisites: state.PriceList.requisites,
    isReqLoaded: state.PriceList.isReqLoaded,
})


export default connect(mapStateToProps, {getRequisites, deleteReq, updateReq})(ReqContainer)