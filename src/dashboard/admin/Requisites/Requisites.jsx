import EditIcon from '@mui/icons-material/Edit';
import {useState, useEffect} from 'react'
import {Field} from 'redux-form'

export default function Requisites(props) {

    const [currentInput, setCurrentInput] = useState({});
    const [isEditModeOn, setEditModeState] = useState(false);

useEffect(() => {
    setCurrentInput(props.req)
},[props.req])



function enableEditMod() {
    setEditModeState(true)
}
function disableEditMode() {
    setEditModeState(false)
}

function detectInputChange(e) {

}

function setNewReq() {
    props.changeReq(currentInput);
    disableEditMode();
}


const fields = () => {

    return props.req.map((el, index) => <div key={index} className='requisites-field'>
            <label>{el.currency_name}</label>
            {isEditModeOn ?
            <Field name ={el.currency_name} component='input'
            onChange={detectInputChange} /> :
            <div>{el.requisites}</div>
            }
        </div>
    )
}

    return <div className="requisites-container">
        <h2 className='requisites-header'>Requisites</h2>
        <div className='requisites-requisites'>
        <div> <EditIcon onClick={enableEditMod} /></div>
    <form onSubmit={props.handleSubmit}>
        {fields()}
       {isEditModeOn && <button className='requisites-save' onClick={setNewReq}>Save</button> }
    </form>
        </div>
    </div>
}