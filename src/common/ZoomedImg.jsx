import { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './zoomedImg.css'


export default function ZoomedImg(props) {

    useEffect(() => {
    function removeEvent() {
        return document.removeEventListener('keydown', checkKey)
    }
        function checkKey(e) {
            if(e.keyCode == 27) {
                props.setImgZoomState(null)
            }
        }
     document.addEventListener('keydown', checkKey)
        return removeEvent
    }, [])

    // function checkKey(e) {
    //     console.log('call')
    //     if (e.keyCode == 27) {
    //         props.setImgZoomState(null)
    //     }
    // }

    function closeModal(e) {
        const target = e.target.className
        const currentTarget = e.currentTarget.id
        if (target === 'zoomed-modal-container' || currentTarget === 'modal-close') {
            props.setImgZoomState(null)
        }
    }

    return <div className="zoomed-modal-container" onClick={closeModal}>
        <CloseIcon className='zoomed-modal-closeIcon' id='modal-close' style={{ fontSize: '35' }} onClick={closeModal} />
        <div className="zoomed-modal-content" onClick={closeModal}>
            <img className='zoom-modal-img' src={props.imgSrc} alt="zoomedImage" />
        </div>
    </div>
}
