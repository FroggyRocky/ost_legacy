import UserAPI from "../../api/UserAPI";
const TICKETS_EXPIRATION_DATE = 3

export async function handleUSDT_TRC_20(ticket) {
    try {
        const timestamp_min = new Date(ticket.createdAt).getTime() // not for testTickets
        let timestamp_max = new Date(ticket.createdAt)
        timestamp_max = timestamp_max.setDate(timestamp_max.getDate() + TICKETS_EXPIRATION_DATE)
        const {userId, id} = ticket
        const {data} = await UserAPI.fetchUSDTTRC_20(ticket.requisite.requisites, timestamp_min, timestamp_max);
        const worker = new Worker('/webWorker.js')
        worker.addEventListener('message', handleUSDT_TRC_20_workerResponse)
        worker.addEventListener('error', handleUSDT_TRC_20_workerErr)
        worker.postMessage({type:'transfer', tickets:data, userId, ticketId:id})
    } catch (e) {
    }
}

async function handleUSDT_TRC_20_workerResponse(e) {
    try {
        const foundTransfers = e.data
        if (foundTransfers && Object.keys(foundTransfers).length !== 0 || foundTransfers.length !== 0) {
            const {netTranferValue, ticketId, transaction_id, ticketCreatorId} = foundTransfers[0]
            await UserAPI.topUp(+netTranferValue, ticketCreatorId, transaction_id)
            await UserAPI.solveTicket(ticketId, ticketCreatorId, transaction_id)
        } else {
            await UserAPI.solveTicket(foundTransfers[0].ticketId, foundTransfers[0].ticketCreatorId, foundTransfers[0].transaction_id)
        }
    } catch (e) {
        return;
    }
}

function handleUSDT_TRC_20_workerErr(e) {
}