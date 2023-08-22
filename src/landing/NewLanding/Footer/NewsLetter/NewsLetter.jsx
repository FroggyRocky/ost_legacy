import React from 'react';
import styles from "../footer.module.scss";
import { Field } from 'redux-form';
import {emailVal, minValue, maxValue, required} from '../../../../Redux/FormValidators/FormValidators'
import {Input} from '../../../../Redux/FormValidators/CustomFields'

const minLengthName = minValue(2,'Name')
const maxLength = maxValue(40, 'Name')


export default function NewsLetter(props) {

    return <div className={styles.newsletter}>
            <h2 className={styles.newsletter_h2}>NEWSLETTER</h2>
            <p className={styles.newsletter_p}>
            Please subscribe to our newsletter to stay updated with OST
            </p>
            <form onSubmit={props.handleSubmit}>
            <div className={styles.inputsBtn_container}>
              <div className={styles.inputs}>
                <div className={styles.input}>
              <Field 
               type="text" placeholder="Name" name='name'
               component={Input} validate={[maxLength,minLengthName,required]}  />
               </div>
              <div className={styles.input}>
                <Field 
               type="text" placeholder="Email" name='email'
               component={Input} validate={[emailVal,minLengthName,required,maxLength]} />
               </div>
               </div>
            <button className={styles.button}>Subscribe</button>
            </div>
            </form>
          </div>
}





