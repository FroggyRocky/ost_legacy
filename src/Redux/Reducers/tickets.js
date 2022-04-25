import UserAPI from '../../api/UserAPI'
import AdminAPI from '../../api/AdminAPI'

const SET_ATTACH_STATE = 'Reducers/tickets/SET_ATTACH_STATE'
const SET_IMGS_PREVIEW_SRC = 'Reducers/tickets/SET_IMGS_PREVIEW_SRC'
const DELETE_IMG_PREVIEW = 'Reducers/tickets/DELETE_IMG_PREVIEW'
const SET_FILES_IN_LOAD = 'Reducers/tickets/SET_FILES_IN_LOAD'
const CLEAR_IMGS_PREVIEW = 'Reducers/tickets/CLEAR_IMGS_PREVIEW'
const UNSET_LOADED_FILE = 'Reducers/tickets/UNSET_LOADED_FILES'
const initialState = {
    isAttaching: false,
    imgsPreviewSrc: [],
    filesInLoad: [],
    isFileMessageCreating: false, 
    isZoomedModeOn:true,
    ticketImgsArr:[]
}

export default function tickets(state = initialState, action) {
    switch (action.type) {
        case SET_ATTACH_STATE:
            return {
                ...state,
                isAttaching: action.state
            }
        case SET_IMGS_PREVIEW_SRC:
            if (state.imgsPreviewSrc.length === 0) {
                return { ...state, imgsPreviewSrc: [{ src: action.imgsSrc, id: 1, fileData: action.fileData }], isAttaching: false }
            } else if (state.imgsPreviewSrc.length > 0) {
                return {
                    ...state,
                    imgsPreviewSrc: [...state.imgsPreviewSrc, { src: action.imgsSrc, id: state.imgsPreviewSrc.length + 1, fileData: action.fileData }],
                    isAttaching: false
                }
            }
        case DELETE_IMG_PREVIEW:
            return {
                ...state,
                imgsPreviewSrc: [...state.imgsPreviewSrc.filter(el => el.id != action.id)]
            }
        case SET_FILES_IN_LOAD: {
            return {
                ...state,
                filesInLoad: [...state.filesInLoad, action.loadingItemId]
            }
        }
        case UNSET_LOADED_FILE:
            return {
                ...state,
                filesInLoad: state.filesInLoad.filter(id => id != action.id)
            }
        case CLEAR_IMGS_PREVIEW:
            return {
                ...state,
                imgsPreviewSrc: [],
            }

        default:
            return {
                ...state
            }
    }
}

const setAttachState = (state) => ({ type: SET_ATTACH_STATE, state })
const setImgsPreviewSrc = (imgsSrc, fileData) => ({ type: SET_IMGS_PREVIEW_SRC, imgsSrc, fileData })
const setFilesInLoad = (loadingItemId) => ({ type: SET_FILES_IN_LOAD, loadingItemId })
const deleteImgPreview = (id) => ({ type: DELETE_IMG_PREVIEW, id })
const clearImgsPreview = () => ({ type: CLEAR_IMGS_PREVIEW })
const unsetLoadedFile = (id) => ({ type: UNSET_LOADED_FILE, id })

const sendFiles = (ticketId) => async (dispatch, getState) => {

    const files = await getState().Tickets.imgsPreviewSrc;
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i].fileData;
            const messageData = {
                ticketId: ticketId,
                type: 'img'
            }
            const resMsg = await AdminAPI.messageCreate({ ...messageData });
            if (resMsg.status === 200) {
                dispatch(setFilesInLoad(resMsg.data.id))
                const resS3 = await UserAPI.uploadS3File(file)
                dispatch(clearImgsPreview());
                if (resS3.status === 200) {
                    const { location, fileName } = resS3.data
                    const messageData = {
                        message: fileName,
                        messageId: resMsg.data.id,
                        src: location,
                    }
                    await AdminAPI.updateMessage({ ...messageData });
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
}


export { setAttachState, setImgsPreviewSrc, deleteImgPreview, sendFiles, unsetLoadedFile }