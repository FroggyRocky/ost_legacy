import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import './dropDown.css'

export default function DropDown(props) {

    const [isDropDownOpen, setDropDownState] = useState(false)

    function toggleDropDown () {
        setDropDownState(prev => !prev)
    }

    function selectOption(e) {
        const option = e.currentTarget.getAttribute('name')
        setDropDownState(false)
        props.selectOption(option)
    }
/// recieves an array with names of the options
    const dropDownOptionComponents = props.dropDownOptions?.map((el, index) => {
        return <div key={index} className='select-options-container'
          name={el} onClick={selectOption}>
            <span>{el}</span>
          <div>
            <input className="select-radio" type="radio" checked={null}/>
              <div  className='radio-circle--checked radio-circle'></div>
          </div>
        </div>
      })

return <div className='select-container'>
<div
className='select-input'
name={props.name}
onClick={toggleDropDown}
id={props.id}
>
<span className="select-placeholder">
 {props.placeholder || props.defaultPlaceholder}
</span>

<span className={`select-arrow ${!props.dropDownOptions?.length && 'selectArrow-off'}`}>
<KeyboardArrowDownIcon className={isDropDownOpen && 'selectArrow-up'}
    style={{ color: '#f2f2f3', fontSize: 30 }} />
</span> 
</div>
{isDropDownOpen && 
<div className='select-dropDown-container'>
{dropDownOptionComponents}
</div>
}
</div>
}