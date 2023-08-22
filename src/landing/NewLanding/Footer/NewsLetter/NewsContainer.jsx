import { reduxForm } from "redux-form";
import NewsLetter from './NewsLetter.jsx'


export default function NewsLetterFormHandler() {

function onSubmit(payload) {

}

    return <WithReduxForm onSubmit={onSubmit} />
 
}

const WithReduxForm = reduxForm({form:'NewsLetterSubscription'})(NewsLetter);


