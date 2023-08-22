import React from 'react';
import './Faq.css'
import {NavLink} from "react-router-dom";
import {ReactComponent as Plus} from "../../img/plus.svg";
import {ReactComponent as Pencil} from "../../img/pencil.svg";

const Faq = (props) => {

    const faqs = props.faqs?.map((el) =>
            <div className='faq-tr' key={el.id}>
                <div className='faq-tr-name'>
                    {el.header}
                    {props.user.admin && props.user.permission.faq_update &&
                    <NavLink to={`/dashboard/faq/create-faq/${el.id}`}>
                        <Pencil/>
                    </NavLink>}
                </div>
                <div className='faq-tr-text'>
                    {el.text}
                </div>
            </div>
        );

    return (
        <div className='faq'>
            <div className='faq-header-name'>
                FAQ
                {props.user.admin && props.user.permission.faq_update &&
                    <NavLink to={`/dashboard/faq/create-faq`}>
                        <div>
                            <Plus/>
                            Create
                        </div>
                    </NavLink>}
            </div>
            {props.faqs?.length ? (
                <div>
                    {faqs}
                </div>
            ) : (
                <div className='mb-3'>
                    No FAQ was created
                </div>
            )}
        </div>
    )
};

export default Faq;