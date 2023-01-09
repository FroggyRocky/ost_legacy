const {Op} = require("sequelize");
const modules = require("../dbmodels");

exports.ticketType = async (req, res) => {
    if (req.admin) {
        try {
            const data = {
                name: req.body.data.name,
                active: req.body.data.active,
            };
            if (req.body.data.id) {
                await modules.TicketTypes.update(
                    {...data},
                    {
                        where: {
                            id: req.body.data.id,
                        },
                    }
                );
            } else {
                await modules.TicketTypes.create({...data});
            }
            res.sendStatus(200);
        } catch (e) {
            console.log(e);
            res.send(500);
        }
    } else {
        res.sendStatus(401);
    }
};
exports.ticket = async (req, res) => {
    try {
        let createdTicket
        if (req.body.data.id) {
            await modules.Tickets.update(
                {solved: req.body.data.solved},
                {
                    where: {
                        id: req.body.data.id,
                    },
                }
            );
            await modules.Message.update(
                {isRead:true},
                {where:{ticketId:req.body.data.id}}
            )
            res.sendStatus(200)
        } else {
            const data = {
                ticketTypeId: req.body.data.ticketTypeId,
                title: req.body.data.title,
                description: req.body.data.description,
                requisiteId:req.body.data?.requisiteId
            };
            if (req.admin) {
                if (req.body.data.userId) {
                    data.userId = req.body.data.userId;
                } else {
                    return res.sendStatus(500);
                }
            } else {
                data.userId = req.id;
            }
            createdTicket = await modules.Tickets.create({...data});
            await modules.Log.create({
                owner: req.body.data.userId || req.id,
                receiver: req.body.data.userId || req.id,
                operation: 6,
                description: `Ticket Created`,
            });
            res.status(200).send({id:createdTicket.id});
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};
exports.tickets = async (req, res) => {
    try {
        const tickets = {};
        tickets.ticketTypes = await modules.TicketTypes.findAll();
        if (req.admin) {
            tickets.tickets = await modules.Tickets.findAll({
                include: [
                    {
                        model: modules.TicketTypes,
                        attributes: ["name"],
                    },
                    {
                        model:modules.Requisites,
                        attributes:['currency_ticker', 'requisites', 'currency_name']
                    },
                    {
                        model: modules.Message,
                        include: [
                            {
                                model: modules.Users,
                                attributes: ["admin"],
                            },
                        ],
                    },
                ],
                order: [
                    ["createdAt", "DESC"],
                    [{model: modules.Message}, "id", "ASC"],
                ],
            });
        } else {
            tickets.tickets = await modules.Tickets.findAll({
                where: {
                    userId: req.id,
                },
                include: [
                    {
                        model: modules.TicketTypes,
                        attributes: ["name"],
                    },
                    {
                        model:modules.Requisites,
                        attributes:['currency_ticker', 'requisites', 'currency_name']
                    },
                    {
                        model: modules.Message,
                        include: [
                            {
                                model: modules.Users,
                                attributes: ["admin"],
                            },
                        ],
                    },
                ],
                order: [
                    ["createdAt", "DESC"],
                    [{model: modules.Message}, "id", "ASC"],
                ],
            });
        }
        res.send({...tickets});
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

exports.message = async (req, res) => {
    try {
        const data = {
            ticketId: req.body.data.ticketId,
            userId: req.id,
            message: req.body.data.message,
            type: req.body.data.type || 'message',
            src: req.body.data.src,
            isRead: false,
        };
        const response = await modules.Message.create({...data});
        res.send({id: response.id})
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};


exports.updateMessage = async (req, res) => {

    try {
        const data = {...req.body}
        await modules.Message.update({src: data.src, message: data.message}, {
            where: {
                id: data.messageId
            }
        })
        res.sendStatus(200)
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
}

////Find email of user who created ticket////
exports.ticketCreatorId = (req, res) => {
    debugger;
    try {
        const data = {
            id: req.body.data,
        };
        modules.Users.findOne({
            where: {
                id: data.id,
            },
            attributes: ["email"],
        }).then(function (project) {
            res.send(project.email);
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};


exports.balanceMessage = async (req, res) => {
    try {
        const data = {
            ticketId: req.body.data.ticketId,
            userId: req.body.data.userId,
            message: req.body.data.message,
            type: req.body.data.type || 'message',
            isRead: false
        };
        await modules.Message.create({...data});
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

exports.ticketBalanceTypeId = async (req, res) => {
    try {
        const data = {
            name: req.body.data
        }
        modules.TicketTypes.findOne({
            where: {
                name: data.name
            }
        }).then(function (foundData) {
            res.send(foundData)
        })
    } catch (e) {
        res.sendStatus(500)
        console.log(e)
    }
}


exports.readMessages = async (req, res) => {
    try {
        const {userId, ticketId} = await req.body
        console.log(userId, ticketId)
        const response = await modules.Message.update(
            {isRead: true},
            {
                where: {
                    ticketId: ticketId,
                    userId: {[Op.ne]: userId}
                }
            }
        )
        res.send(response).status(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

exports.solveTicket = async (req, res) => {
    try {
        const userId = req.id
        const ticketId = req.body.ticketId
        const ticketCreatorId = req.body.ticketCreatorId
        const transactionId = req.body.transaction_id
        if(+ticketCreatorId === +userId || req.admin) {
            await modules.Tickets.update(
                {solved: true, transaction_id:transactionId, },
                {
                    where: {
                        id: ticketId
                    }
                }
            )
            await modules.Message.update(
                {isRead:true},
                {where:{ticketId:ticketId}}
            )
            res.sendStatus(200)
        } else {
            res.sendStatus(403)
        }
    } catch (e) {
        console.log(e)
    }
}