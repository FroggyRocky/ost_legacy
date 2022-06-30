import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useEffect } from 'react';
import { useState } from 'react';
import './dropDown.css'

export default function DropDown(props) { 

  const [isDropDownOpen, setDropDownState] = useState(false)
  const [checkedOption, setCheckedOption] = useState(props.placeholder)

  useEffect(() => {
    setCheckedOption(props.placeholder)
  },[props.placeholder])

  function toggleDropDown() {
    setDropDownState(prev => !prev)
  }
  
  function selectOption(e) {
    const name = e.currentTarget.getAttribute('name')
    const id = e.currentTarget.id
    setCheckedOption(name)
    setDropDownState(false)
    if(id) {
      props.selectOption({name,id})
    }
    else {
       props.selectOption(name)
    }
  }
  /// recieves an array with names of the options
  const dropDownOptionComponents = props.dropDownOptions?.map((el, index) => {
    return <div key={el.id || index} id={el.id} className='select-options-container'
      name={ el.name || el}  onClick={selectOption}>
      <span>{el.name || el}</span>
      <div className='selectRadio__container'>
        <input className="select-radio" type="radio" checked={null} />
        {(checkedOption === el.name && el) && <div className='radio-circle--checked radio-circle'></div>}
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
          style={{ color: '#f2f2f3', fontSize: 28 }} />
      </span>
    </div>
    {isDropDownOpen &&
      <div className='select-dropDown-container'>
        {dropDownOptionComponents}
      </div>
    }
  </div>
}