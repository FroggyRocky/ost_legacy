import { connect } from "react-redux"
import {reduxForm, Field} from 'redux-form'
import './addReq.css'
import {addNewRequisites} from '../../../Redux/Reducers/priceList.js'

function AddReq(props) {




    return <div className="addReq-container">
        <form className="addReq-form" onSubmit={props.handleSubmit}>
        <label className="addReq-label">Full currency name</label>
        <Field
          className='addReq-field'
          name="currency_name"
          component="input"
          type="text"
          placeholder="Full-name"
          required
        />
          <label className="addReq-label">Currency Ticker</label>
        <Field
          className='addReq-field'
          name="currency_ticker"
          component="input"
          type="text"
          placeholder="Ticker name"
          required
        />
        <label className="addReq-label">Wallet Address</label>
        <Field
          className='addReq-field'
          name="requisites"
          component="input"
          type="text"
          placeholder="Wallet Address"
          required
        />
        <button className="add-Req-button">Save</button>
        </form>
    </div>
}
















function AddReqFormContainer(props) {

function onSubmit(data) {
props.addNewRequisites(data)
}
return <WithReduxForm onSubmit={onSubmit}  {...props} />
}




const WithReduxForm = reduxForm({form:'AddReq'})(AddReq)


const mapStateToProps = (state) => ({
  
})
export default connect(mapStateToProps, {addNewRequisites})(AddReqFormContainer)