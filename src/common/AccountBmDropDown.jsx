import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useEffect, useState} from "react";
import verified from '../img/verified.png'

function AccountBmDropDown(props) {

    const [isDropDownOpen, setDropDownState] = useState(false)
    const [checkedOption, setCheckedOption] = useState(props.placeholder)

    useEffect(() => {
        setCheckedOption(props.placeholder)
    }, [props.placeholder])

    useEffect(() => {
        setDropDownState(props.isDropDownOpen)
    }, [props.isDropDownOpen])

    function toggleDropDown(e) {
        setDropDownState(prev => !prev)

    }

    function selectOption(e) {
        const name = e.currentTarget.getAttribute('name')
        const type = e.currentTarget.getAttribute('data-optionType')
        const id = e.currentTarget.getAttribute('id')
        const option = {
            name,
            type,
            id
        }
        setDropDownState(false)
        props.selectOption(option)

    }
function closeDropDown() {
    setDropDownState(false)
}
    /// recieves an array with names of the options
    const dropDownOptionComponents = props.dropDownOptions?.map((el) => {
        return <div key={el.id} id={el.id} className='select-options-container'
                    name={el.name} data-optionType={el.type} data-class={'dropDown'} onClick={selectOption}>
            <span>{el.name}{el.price ? `-${el.price}` : ''}{el.type?.toLowerCase() === 'verified' &&
                <span><img width='18' height='18' src={verified} alt='verified'/></span>}</span>
            <div className='selectRadio__container'>
                <input className="select-radio" type="radio"/>
                {+checkedOption.id === +el.id && <div className='radio-circle--checked radio-circle'></div>}
            </div>
        </div>
    })
    return <div className='select-container' tabIndex={0} onBlur={closeDropDown}>
        <div
            className='select-input'
            name={props.name}
            onClick={toggleDropDown}
            data-class={'dropDown'}
            id={props.id}
        >
      <span className="select-placeholder">
{checkedOption.name ?
    <span>{checkedOption.name}{checkedOption.price ? `-${checkedOption.price}` : ''}{checkedOption.type?.toLowerCase() === 'verified' &&
        <span><img width='18' height='18' src={verified} alt='verified'/></span>}</span> : 'Select Type'}
      </span>
            <span className={`select-arrow ${!props.dropDownOptions?.length && 'selectArrow-off'}`}>
        <KeyboardArrowDownIcon className={isDropDownOpen && 'selectArrow-up'}
                               style={{color: '#f2f2f3', fontSize: 28}}/>
      </span>
        </div>
        {isDropDownOpen &&
            <div className='select-dropDown-container'>
                {dropDownOptionComponents}
            </div>
        }
    </div>
}

export default AccountBmDropDown