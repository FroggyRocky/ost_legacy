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

  useEffect(() => {
    setDropDownState(props.isDropDownOpen)
  }, [props.isDropDownOpen])

  function toggleDropDown(e) {
    props.setDropDown(prev => !prev)
    setDropDownState(prev => !prev)

  }
  
  function selectOption(e) {
    const name = e.currentTarget.getAttribute('name')
    const id = e.currentTarget.id
    setCheckedOption(name)
    setDropDownState(false)
    props.setDropDown(false)
    if(id) {
      props.selectOption({name,id})
    }
    else {
       props.selectOption(name)
    }
  }
  /// recieves an array with names of the options
  const dropDownOptionComponents = props.dropDownOptions?.map((el) => {
    return <div key={el.id} id={el.id} className='select-options-container'
      name={el.name || el.id || el} data-class={'dropDown'}  onClick={selectOption}>
      <span>{el.name || el.id || el}</span>
      <div className='selectRadio__container'>
        <input className="select-radio" type="radio" />
        {(checkedOption === el || checkedOption === el.name) && <div className='radio-circle--checked radio-circle'></div>}
      </div>
    </div>
  })

  return <div className='select-container'>
    <div
      className='select-input'
      name={props.name}
      onClick={toggleDropDown}
      data-class={'dropDown'}
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