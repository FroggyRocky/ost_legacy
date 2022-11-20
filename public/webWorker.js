const USDT_TRC20_AMOUNT_OF_DIGITS_AFTER_VALUE = 6
function removerZeros(num) {
        for (var i = 0; i < num.length; i++) {

            if (num.charAt(i) != '0') {
                let res = num.substr(i);
                return res;
            }
        }

        return "0";
    }
function findTransfer(tickets, userId, ticketId) {
    const filteredTickets = tickets.filter(ticket => {
        if(ticket.token_info.symbol === 'USDT') {
            const value = ticket.value;
            const splitFrom = (value.length - 6)
            let id = value.slice(splitFrom)
            id = removerZeros(id)
            if(+id === +userId) {
                ticket.ticketCreatorId = userId
                ticket.netTranferValue = value.slice(0,splitFrom)
                ticket.ticketId = ticketId
                return ticket
            }
        }
    })
    return filteredTickets
}

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('message', e => {
    let {type, tickets, userId, ticketId} = e.data
    switch (type) {
        case 'transfer':
            const foundTickets = findTransfer(tickets,userId, ticketId)
            if(foundTickets.length !== 0) {
                /* eslint-disable-next-line no-restricted-globals */
                self.postMessage(foundTickets)
            } else {
                /* eslint-disable-next-line no-restricted-globals */
                self.postMessage({ticketId})
            }
    }
})