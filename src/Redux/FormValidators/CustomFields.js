import styles from './customFields.module.scss'

function Input({input,meta:{error, touched, ...meta}, ...props}) {
return <div>
            <input {...input} {...props} ></input>
        {touched && error ? <div className={styles.error}>*{error}</div> : null}
</div>
}

// function Select ({input,meta:{error, prestine}, ...props}) { console.log(error)
//   return  <div>
//             <select className='top-up--select-coin' {...input} {...props} >{props.children}</select>
//         {!prestine && error ? <div className={styles.error}>*{error}</div> : null}
// </div>
// }

export {Input}