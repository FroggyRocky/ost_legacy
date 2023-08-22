import ReactTooltip from "react-tooltip";

function getValueById(values, id) {
    const value = values.find(el => (el.id === id));
    return value?.name
}

function colorOfStatus(statusId) {
    switch (statusId) {
        case 1:
            return 'success';
        case 2:
            return 'primary';
        case 3:
            return 'danger';
        case 4:
            return 'success';
        default:
            return null
    }
}

function operationType (operation) {
    switch (operation) {
        case 1:
            return 'Balance';
        case 2:
            return 'Purchase';
        case 3:
            return 'Replacement';
        case 4:
            return 'Additions';
        case 5:
            return 'Registration';
        default:
            return null
    }
}

function handleClick(event) {
    let id;
    if (event.target.tagName === 'svg') {
        id = event.target.parentElement;
    } else if (event.target.tagName === 'path') {
        id = event.target.parentElement.parentElement;
    } else {
        id = event.target;
    }
    id.parentElement.parentElement.parentElement.classList.toggle('opened');
    let elem = document.getElementById(id.dataset.id);
    elem.hidden === true ? elem.hidden = false : elem.hidden = true;
}

function copyText (evt) {
    ReactTooltip.hide();
    let text;
    if (evt.target.tagName === 'svg') {
        text = evt.target.parentElement.id;
    } else if (evt.target.tagName === 'path') {
        text = evt.target.parentElement.parentElement.id;
    } else {
        text = evt.target.id;
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

function convertDate(date) {
    const formattedDate = new Date(Date.parse(date));
    return formattedDate.toLocaleDateString();
}

function convertTime(date) {
    const formattedDate = new Date(Date.parse(date));
    return formattedDate.toLocaleTimeString();
}

function convertDateTime(date) {
    const formattedDate = new Date(Date.parse(date));
    return formattedDate.toLocaleString();
}

const tableAdditionalInfo = {
    getValueById,
    colorOfStatus,
    handleClick,
    copyText,
    convertDate,
    operationType,
    convertTime,
    convertDateTime
};

export default tableAdditionalInfo;
