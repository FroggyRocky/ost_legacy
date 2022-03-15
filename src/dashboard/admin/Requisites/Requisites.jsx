import EditIcon from '@mui/icons-material/Edit';
import {useState, useEffect} from 'react'

export default function Requisites(props) {

    const [currentInput, setCurrentInput] = useState({})
    const [isEditModeOn, setEditModeState] = useState(false)
function detectInputChange(e) {
    console.log(e.target.name, e.taget.value);
}

    return <div className="requisites-container">
        <h2 className='requisites-header'>Requisites</h2>
        <div className='requisites-requisites'>
        <div className='requisites-field'>
            <label>BTC</label>
            {isEditModeOn ?
            <input id='req_BTC' value={}/> :
            <div>{}</div>
            }
        </div>
        </div>
    </div>
}