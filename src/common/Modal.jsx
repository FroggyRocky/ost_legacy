import './modal.css'
import gradient from '../landing/NewLanding/assets/svgs/fadeRobot.png'
import CloseIcon from '@mui/icons-material/Close';


export default function Modal(props) {

function closeModal(e) {
    const target = e.target.className
    const currentTarget = e.currentTarget.id
    if(target === 'common-modal-container' || currentTarget === 'modal-close' || target === 'common-modal-gradient') {
        props.closeModal(false)
    }
} 


    return <div className="common-modal-container" onClick={closeModal}>
    <img className="common-modal-gradient" src={gradient} alt="gradient" />
        <div className="common-modal-content">
            <CloseIcon className='common-modal-closeIcon' id='modal-close' style={{fontSize:'30'}} onClick={closeModal} />
            <main className="common-modal-info">
                <h2 className='common-modal-header'>{props.header}</h2>
                <p className='common-modal-text'>{props.text}</p>
            </main>
        </div>
    </div>
}