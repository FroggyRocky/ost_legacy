import CloseIcon from '@mui/icons-material/Close';

export default function ZoomedImg(props) {



return <div className="zoomed-modal-container" onClick={closeModal}>
    <img className="zoomed-modal-gradient" src={gradient} alt="gradient" />
        <div className="zoomed-modal-content">
            <CloseIcon className='zoomed-modal-closeIcon' id='modal-close' style={{fontSize:'30'}} onClick={closeModal} />
            <main className="zoomed-modal-info">
                <img src="https://s3.timeweb.com/cq02541-0f934591-593a-490d-9dfa-f5e6f4f58d5e/ec92cf32-ea02-47c6-bbbd-2084be4f7953.png" alt="zoomedImage" />
            </main>
        </div>
    </div>
}