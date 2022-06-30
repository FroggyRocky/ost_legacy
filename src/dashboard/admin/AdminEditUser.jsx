import { useState, useEffect } from 'react';
import './AdminEditUser.css'
import { ReactComponent as Cross } from "../../img/cross.svg";
import { ReactComponent as Pencil } from "../../img/pencil.svg";
import DropDown from '../../common/DropDown';
import { isPropertyAccessChain } from 'typescript';

const AdminEditUser = (props) => {

    const [adminSettingsState, setAdminSettingsState] = useState({
        id: props.user.id,
        email: props.user.email,
        active: props.user.active,
        admin: props.user.admin,
        balance: props.user.balance,
        manager: props.user.manager,
        managerId: props.user.managerId,
        name: props.user.name ? props.user.name : '',
        works: props.user.works ? props.user.works : ''
    });
    const [permissionsState, setPermissionsState] = useState({
        userId: props.user.id,
        acc_bm: props.user.permission?.acc_bm || 0,
        acc_bm_update: props.user.permission?.acc_bm_update || false,
        users: props.user.permission?.users || 0,
        user_update: props.user.permission?.user_update || false,
        user_balance: props.user.permission?.user_balance || false,
        user_roles: props.user.permission?.user_roles || false,
        user_active: props.user.permission?.user_active || false,
        statistics: props.user.permission?.statistics || false,
        price_list: props.user.permission?.price_list || false,
        price_list_update: props.user.permission?.price_list_update || false,
        log: props.user.permission?.log || false,
        faq_update: props.user.permission?.faq_update || false
    });

    useEffect(() => {
        const currentManager = props.managerList.find(el => el.id === props.user.managerId)
        if(currentManager) {
            console.log(currentManager)
            setManager({...currentManager})
        }
    }, [])

    const [okModalState, setOkModalState] = useState(false);
    const [disabledBalanceState, setDisabledBalanceState] = useState(true);
    function handleSwitchChange(event) {
        if (event.target.id === 'admin' && event.target.checked === false) {
            setAdminSettingsState({ ...adminSettingsState, [event.target.id]: event.target.checked });
            setPermissionsState({
                acc_bm: 0,
                acc_bm_update: false,
                users: 0,
                user_update: false,
                user_balance: false,
                user_roles: false,
                user_active: false,
                statistics: false,
                price_list: false,
                price_list_update: false,
                log: false,
                faq_update: false
            });
        } else {
            setAdminSettingsState({ ...adminSettingsState, [event.target.id]: event.target.checked });
        }
    }
    const [manager, setManager] = useState({name:'', id:null})

    function selectManager(value) {
        setManager(value)
        setAdminSettingsState(prev => ({...prev, managerId:value.id}))
    }
    function handleRoleSwitchChange(event) {
        if (event.target.id === 'price_list' && event.target.checked === false) {
            setPermissionsState({
                ...permissionsState,
                price_list_update: false,
                [event.target.id]: event.target.checked
            });
        } else if (event.target.id === 'user_update' && event.target.checked === false) {
            setPermissionsState({
                ...permissionsState,
                user_balance: false,
                user_roles: false,
                user_active: false,
                [event.target.id]: event.target.checked
            });
        } else {
            setPermissionsState({ ...permissionsState, [event.target.id]: event.target.checked });
        }
    }

    function handleRadioChange(event) {
        if (event.target.name === 'acc_bm' && +event.target.id === 0) {
            setPermissionsState({ ...permissionsState, acc_bm_update: false, [event.target.name]: +event.target.id });
        } else if (event.target.name === 'users' && +event.target.id === 0) {
            setPermissionsState({
                ...permissionsState,
                user_update: false,
                user_balance: false,
                user_roles: false,
                user_active: false,
                [event.target.name]: +event.target.id
            });
        } else {
            setPermissionsState({ ...permissionsState, [event.target.name]: +event.target.id });
        }
    }

    function handleChange(event) {
        setAdminSettingsState({ ...adminSettingsState, [event.target.name]: event.target.value });
    }

    function handleClick(event) {
        event.preventDefault();
        async function putUserData() {
            const res = await props.adminUserUpdate({ ...adminSettingsState, permissions: permissionsState });
            const adminData = await props.getUserData();
            props.setUserState(adminData.data);
            if (res.data === 'OK') {
                window.addEventListener('keydown', (event) => { if (event.keyCode === 27) handleOkModalClick() });
                setOkModalState(true);
            } else {
                alert('Something went wrong')
            }
        }
    
        putUserData().then();
    }

    function handleOkModalClick() {
        window.removeEventListener('keydown', (event) => { if (event.keyCode === 27) handleOkModalClick() });
        setOkModalState(false);
    }

    function handleConfirmActiveBalance() {
        setDisabledBalanceState(false);
    }

    return (
        <form className='user' onSubmit={handleClick}>
            <div className='user-header-name'>
                Edit user
            </div>
            <div className='user-section'>
                <div className='user-section-name'>
                    Main
                </div>
                <div className='user-section-tr'>
                    <div className='user-section-td'>
                        <div className='user-section-td-name'>
                            User ID
                        </div>
                        <div className='user-section-td-data'>
                            {props.user.id}
                        </div>
                    </div>
                    <div className='user-section-td'>
                        <div className='user-section-td-name'>
                            User email
                        </div>
                        <div className='user-section-td-data'>
                            <input
                                className='text-input'
                                type='text'
                                name='email'
                                placeholder='email'
                                value={adminSettingsState.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='user-section-td'>
                        <div className='user-section-td-name'>
                            Manager ID
                        </div>
                        <div className='editUser__dropDown'>
                            <DropDown dropDownOptions={props.managerList} selectOption={selectManager}
                                placeholder={manager.name} />
                        </div>
                    </div>
                    {props.userCurrent.admin && props.userCurrent.permission.user_active &&
                        <div className='user-section-td'>
                            <div className='user-section-td-name'>
                                Active
                            </div>
                            <div className='user-section-td-data'>
                                <label className='user-section-td-checkbox-input'>
                                    <input
                                        type='checkbox'
                                        id='active'
                                        onChange={handleSwitchChange}
                                        checked={adminSettingsState.active}
                                    />
                                    <span className='user-section-td-checkbox-input-text'>
                                        Active
                                    </span>
                                </label>
                            </div>
                        </div>}
                </div>
                {props.userCurrent.admin && props.userCurrent.permission.user_balance &&
                    <div className='user-section-tr'>
                        <div className='user-section-td'>
                            <div className='user-section-td-name'>
                                Balance
                            </div>
                            <div className='user-section-td-data'>
                                <input
                                    className='text-input'
                                    type='number'
                                    name='balance'
                                    placeholder='$'
                                    value={adminSettingsState.balance}
                                    onChange={handleChange}
                                    disabled={disabledBalanceState}
                                    min="0"
                                />
                                <div className='user-section-td-data-edit' onClick={handleConfirmActiveBalance}><Pencil /></div>
                            </div>
                        </div>
                    </div>}
            </div>
            {props.userCurrent.admin && props.userCurrent.permission.user_roles && <>
                <div className='user-section'>
                    <div className='user-section-name'>
                        Admin
                        <label className='user-section-td-checkbox-input'>
                            <input
                                type='checkbox'
                                id='admin'
                                onChange={handleSwitchChange}
                                checked={adminSettingsState.admin}
                            />
                            <span className='user-section-td-checkbox-input-text'></span>
                        </label>
                        <button type='submit'>Save</button>
                    </div>
                    {adminSettingsState.admin && <>
                        <div className='user-section-tr tr-with-radio'>
                            <div className='user-section-td'>
                                <div className='user-section-td-name'>
                                    Accounts and BM's
                                </div>
                                <div className='user-section-td-data'>
                                    <label>
                                        <input
                                            type='radio'
                                            id={0}
                                            name='acc_bm'
                                            onChange={handleRadioChange}
                                            checked={permissionsState.acc_bm === 0}
                                        />
                                        <div className='radio-text'>No</div>
                                    </label>
                                    <label>
                                        <input
                                            type='radio'
                                            id={1}
                                            name='acc_bm'
                                            onChange={handleRadioChange}
                                            checked={permissionsState.acc_bm === 1}
                                        />
                                        <div className='radio-text'>Own</div>
                                    </label>
                                    <label>
                                        <input
                                            type='radio'
                                            id={2}
                                            name='acc_bm'
                                            onChange={handleRadioChange}
                                            checked={permissionsState.acc_bm === 2}
                                        />
                                        <div className='radio-text'>All</div>
                                    </label>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='acc_bm_update'
                                            disabled={permissionsState.acc_bm === 0}
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.acc_bm_update}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Edit
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='user-section-tr tr-with-radio'>
                            <div className='user-section-td'>
                                <div className='user-section-td-name'>
                                    Users
                                </div>
                                <div className='user-section-td-data'>
                                    <label>
                                        <input
                                            type='radio'
                                            id={0}
                                            name='users'
                                            onChange={handleRadioChange}
                                            checked={permissionsState.users === 0}
                                        />
                                        <div className='radio-text'>No</div>
                                    </label>
                                    <label>
                                        <input
                                            type='radio'
                                            id={1}
                                            name='users'
                                            onChange={handleRadioChange}
                                            checked={permissionsState.users === 1}
                                        />
                                        <div className='radio-text'>Own</div>
                                    </label>
                                    <label>
                                        <input
                                            type='radio'
                                            id={2}
                                            name='users'
                                            onChange={handleRadioChange}
                                            checked={permissionsState.users === 2}
                                        />
                                        <div className='radio-text'>All</div>
                                    </label>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='user_update'
                                            disabled={permissionsState.users === 0}
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.user_update}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Edit
                                        </span>
                                    </label>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='user_balance'
                                            disabled={permissionsState.user_update === false || permissionsState.users === 0}
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.user_balance}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Balance
                                        </span>
                                    </label>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='user_roles'
                                            disabled={permissionsState.user_update === false || permissionsState.users === 0}
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.user_roles}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Roles
                                        </span>
                                    </label>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='user_active'
                                            disabled={permissionsState.user_update === false || permissionsState.users === 0}
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.user_active}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Block
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='user-section-tr tr-with-radio'>
                            <div className='user-section-td'>
                                <div className='user-section-td-name'>
                                    Statistics
                                </div>
                                <div className='user-section-td-data'>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='statistics'
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.statistics}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Check
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='user-section-tr tr-with-radio'>
                            <div className='user-section-td'>
                                <div className='user-section-td-name'>
                                    Price-list
                                </div>
                                <div className='user-section-td-data'>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='price_list'
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.price_list}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Check
                                        </span>
                                    </label>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='price_list_update'
                                            disabled={!permissionsState.price_list}
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.price_list_update}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Edit
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='user-section-tr tr-with-radio'>
                            <div className='user-section-td'>
                                <div className='user-section-td-name'>
                                    Log
                                </div>
                                <div className='user-section-td-data'>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='log'
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.log}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Check
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='user-section-tr tr-with-radio'>
                            <div className='user-section-td'>
                                <div className='user-section-td-name'>
                                    FAQ
                                </div>
                                <div className='user-section-td-data'>
                                    <label className='user-section-td-checkbox-input'>
                                        <input
                                            type='checkbox'
                                            id='faq_update'
                                            onChange={handleRoleSwitchChange}
                                            checked={permissionsState.faq_update}
                                        />
                                        <span className='user-section-td-checkbox-input-text'>
                                            Edit
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </>}
                </div>
                {adminSettingsState.admin &&
                    <div className='user-section'>
                        <div className='user-section-name'>
                            Manager
                            <label className='user-section-td-checkbox-input'>
                                <input
                                    type='checkbox'
                                    id='manager'
                                    onChange={handleSwitchChange}
                                    checked={adminSettingsState.manager}
                                />
                                <span className='user-section-td-checkbox-input-text'></span>
                            </label>
                        </div>
                        {adminSettingsState.manager &&
                            <div className='user-section-tr'>
                                <div className='user-section-td'>
                                    <div className='user-section-td-name'>
                                        Name
                                    </div>
                                    <div className='user-section-td-data'>
                                        <input
                                            className='text-input'
                                            type='text'
                                            name='name'
                                            placeholder='name'
                                            value={adminSettingsState.name}
                                            onChange={handleChange}
                                            maxLength="10"
                                        />
                                    </div>
                                </div>
                                <div className='user-section-td'>
                                    <div className='user-section-td-name'>
                                        Working time
                                    </div>
                                    <div className='user-section-td-data'>
                                        <input
                                            className='text-input'
                                            type='text'
                                            name='works'
                                            placeholder='works'
                                            value={adminSettingsState.works}
                                            onChange={handleChange}
                                            maxLength="40"
                                        />
                                    </div>
                                </div>
                            </div>}
                    </div>}
            </>}
            {okModalState && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleOkModalClick}>
                        <Cross />
                    </div>
                    <div className='modal-window-data'>
                        Your changes have been made
                    </div>
                    <button onClick={handleOkModalClick}>
                        OK
                    </button>
                </div>
            </div>}
        </form>
    );
};
export default AdminEditUser;