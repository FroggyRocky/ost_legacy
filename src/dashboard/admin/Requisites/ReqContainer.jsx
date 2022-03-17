import {useEffect} from 'react'
import { connect } from 'react-redux'
import {getRequisites,changeReq} from '../../../Redux/Reducers/priceList.js'
import Requisites from './Requisites'
import {reduxForm} from 'redux-form'

function ReqContainer({requisites, changeReq, isReqLoaded, getRequisites}) {

function onSubmit(formData) {
    console.log(formData)
}

    useEffect(async () => {
        await getRequisites()
    }, [])

return isReqLoaded ? <WithReduxForm initialValues={requisites} onSubmit={onSubmit} req={requisites} changeReq={changeReq} /> :
 <div>Loading</div>

}

const WithReduxForm = reduxForm({form:'newReq'})(Requisites)

const mapStateToProps = (state) => ({
    requisites:state.PriceList.requisites,
    isReqLoaded:state.PriceList.isReqLoaded
})




export default connect(mapStateToProps, {getRequisites,changeReq})(ReqContainer)