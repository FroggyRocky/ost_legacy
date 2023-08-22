import {ReactComponent as AttachLogo} from '../img/attach.svg'
import gradient from '../landing/NewLanding/assets/svgs/fadeRobot.png'
import './modalAttach.css'

export default function ModalAttach(props) {
 
function dragLeave() {
    props.setAttachState(false)
}

function dragOver(e) {
    e.preventDefault()
 }

function fileDrop(e) {
    e.preventDefault()
    let dt = e.dataTransfer
    let files = dt.files
    props.setAttachState(false)
    arrangeFiles(files)
}


function arrangeFiles(files) {
    for(let key in files) {
        if(key === 'length') {
            return 
        } 
         else if(files[key].type.split('/')[0] === 'image') {
        previewFiles(files[key])
        }
    }
}



function previewFiles(file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async function() {
        const imgsSrc = await reader.result
        props.setImgsPreviewSrc(imgsSrc, file, props.ticketId)  
      }
}




       return <div className="attach-modal-container" onClick={props.closeModal} >
            <img className="attach-modal-gradient" src={gradient} alt="gradient" />
        <div onDrop={fileDrop} onDragOver={dragOver} onDragLeave={dragLeave} className='leave-drag-area'></div>
            <div className="attach-modal-content" > 
                <main className="attach-modal-info" >
                    <AttachLogo  />
                    <p className='attach-modal-text'>Drop files</p>
                </main>
            </div>
        </div>
    }

