import React, {useState} from 'react';
import './AdminCreateFromExcel.css'
import xlsx from 'xlsx';
import accounts from '../../img/accounts.xlsx'
import bms from '../../img/bms.xlsx'
import {ReactComponent as Tick} from "../../img/tick.svg";
import {ReactComponent as Cross} from "../../img/cross.svg";

const AdminCreateFromExcel = (props) => {

    const [data, setData] = useState(null);
    const [pageModal, setPageModal] = useState(false);

    function getIdByValue(value, array) {
        const object = array.find(el => (el.name === value));
        return object.id
    }
    function handleModalClick() {
        window.removeEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
        setPageModal(false);
    }
    function handleChange(event) {
        const fileName = event.target.value.split("\\");
        const label = document.querySelector('.bulk-upload-file label');
        label.innerText = fileName[fileName.length-1];
        const fileReader = new FileReader();
        let rows;
        fileReader.readAsBinaryString(event.target.files[0]);
        fileReader.onload = async (event) => {
            const workbook = xlsx.read(event.target.result, {type: "binary"});
            workbook.SheetNames.forEach(sheet => {
                rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
            });
            // const res = await props.proxyData({type: 'p'});
            await Promise.all(rows.map(async el => {
                if (el.proxy_id) {
                    const res = await props.proxyData({proxy_id: el.proxy_id});
                    el.proxy_ip = `${res.data.node.ip}:${res.data.ports.http}`;
                    el.proxy_login = res.data.access.login;
                    el.proxy_password = res.data.access.password;
                    el.proxy_traffic_total = res.data.traffic.total;
                    el.proxy_traffic_left = res.data.traffic.left;
                } 
                // else {
                //     const address = el.proxy_ip.split(':');
                //     const proxy = res.data.list.find(proxy => proxy.host === address[0] && proxy.port === address[1]);
                //     el.proxy_id = `p${proxy.id}`;
                //     el.proxy_login = proxy.user;
                //     el.proxy_password = proxy.pass;
                //     el.proxy_date = proxy.date_end;
                // }
                return el
                }
            )).then(result => {
                setData(result);
                const table = document.getElementsByTagName('table')[0];
                return table.insertAdjacentHTML('beforebegin', getExcelTable(result));
            })
        };
    }

    async function handleClick(event) {
        event.preventDefault();
        if (data && data.length) {
            let res;
            try {
                if (props.accBulkCreate) {
                    res = await props.accBulkCreate(data.map((el, i) => {
                        el.statusId = 1;
                        el.creator = props.user.id;
                        try {
                            el.countryId = getIdByValue(el.countryId, props.countries);
                        } catch (e) {
                            alert('Check the country name in the line ' + (i + 1));
                            throw e;
                        }
                        return el
                    }));
                } else {
                    res = await props.bmBulkCreate(data.map((el, i) => {
                        el.statusId = 1;
                        el.creator = props.user.id;
                        try {
                            el.bmTypeId = getIdByValue(el.bmTypeId, props.bmTypes);
                        } catch (e) {
                            alert('Check BM name in the line ' + (i + 1));
                            throw e;
                        }
                        return el
                    }));
                }
                if (res.data === 'OK') {
                    const adminData = await props.getUserData();
                    props.setUserState(adminData.data);
                    setData(null);
                    document.getElementById('file').value = null;
                } else {
                    console.log(res.data);
                    alert('Something went wrong')
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            window.addEventListener('keydown', (event) => {if (event.keyCode === 27) handleModalClick()});
            setPageModal(true)
        }
    }
    function getExcelTable(info) {
        let htmlData = '';
        if (props.accCount) {
            info.map(el => htmlData += `<tr>
                <td>${el.countryId ? el.countryId : '#'}</td>
                <td>${el.login ? el.login : '#'}</td>
                <td>${el.password ? el.password : '#'}</td>
                <td>${el.code2fa ? el.code2fa : '#'}</td>
                <td>${el.proxy_id ? el.proxy_id : '#'}</td>
                <td>${el.proxy_ip ? el.proxy_ip : '#'}</td>
                <td>${el.proxy_login ? el.proxy_login : '#'}</td>
                <td>${el.proxy_password ? el.proxy_password : '#'}</td>
                <td>${el.proxy_date ? el.proxy_date : '#'}</td>
                <td>${el.email ? el.email : '#'}</td>
                <td>${el.email_password ? el.email_password : '#'}</td>
                <td>${el.birth ? el.birth : '#'}</td>
                <td>${el.cookie ? el.cookie : '#'}</td>
            </tr>`);
        return `<table class='excel-table'>
            <thead>
                <tr>
                    <th>country</th>
                    <th>login</th>
                    <th>password</th>
                    <th>code2fa</th>
                    <th>proxy_id</th>
                    <th>proxy_ip</th>
                    <th>proxy_login</th>
                    <th>proxy_password</th>
                    <th>proxy_date</th>
                    <th>email</th>
                    <th>email_password</th>
                    <th>birth</th>
                    <th>cookie</th>
                </tr>
            </thead>
        <tbody>
        ${htmlData}
        </tbody>
        </table>`
        } else {
            info.map(el => htmlData += `<tr>
                <td>${el.bmTypeId ? el.bmTypeId : '#'}</td>
                <td>${el.faceBm ? el.faceBm : '#'}</td>
                <td>${el.link1 ? el.link1 : '#'}</td>
                <td>${el.link2 ? el.link2 : '#'}</td>
                <td>${el.link3 ? el.link3 : '#'}</td>
            </tr>`);
            return `<table class='excel-table'>
                <thead>
                <tr>
                    <th>bmTypeId</th>
                    <th>faceBm</th>
                    <th>link1</th>
                    <th>link2</th>
                    <th>link3</th>
                </tr>
                </thead>
                <tbody>
                ${htmlData}
                </tbody>
        </table>`;
        }
    }

    return (
        <div className='bulk-upload'>
            <div className='bulk-upload-href'>
                {props.accCount ? <a href={accounts} download='accounts.xlsx'>xlsx</a> :
                    <a href={bms} download='bms.xlsx'>xlsx</a>}
            </div>
            <div className='bulk-upload-file'>
                <input
                    type='file'
                    id='file'
                    onChange={handleChange}
                    accept=".xlsx, .xls"
                />
                <label htmlFor='file'>file</label>
                <div className='bulk-upload-button'>
                    <button onClick={handleClick}>
                        <Tick/>
                    </button>
                </div>
            </div>
            {pageModal && <div className='modal'>
                <div className='modal-window'>
                    <div className='modal-window-close' onClick={handleModalClick}>
                        <Cross/>
                    </div>
                    <div className='modal-window-data'>
                        You can't load empty file!
                    </div>
                    <button onClick={handleModalClick}>
                        OK
                    </button>
                </div>
            </div>}
        </div>
    )
};

export default AdminCreateFromExcel;