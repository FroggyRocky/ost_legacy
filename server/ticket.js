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
          { ...data },
          {
            where: {
              id: req.body.data.id,
            },
          }
        );
      } else {
        await modules.TicketTypes.create({ ...data });
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
    if (req.body.data.id) {
      if (req.admin) {
        await modules.Tickets.update(
          { solved: req.body.data.solved },
          {
            where: {
              id: req.body.data.id,
            },
          }
        );
      } else {
        return res.sendStatus(500);
      }
    } else {
      const data = {
        ticketTypeId: req.body.data.ticketTypeId,
        title: req.body.data.title,
        description: req.body.data.description,
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
      await modules.Tickets.create({ ...data });
    }
    
    res.sendStatus(200);
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
          [{ model: modules.Message }, "id", "ASC"],
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
          [{ model: modules.Message }, "id", "ASC"],
        ],
      });
    }
    res.send({ ...tickets });
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
    };
    await modules.Message.create({ ...data });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

////Find email of user who created ticket////
exports.ticketCreatorId = (req, res) => { debugger;
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

///set balance (top-up) message /// 
exports.balanceMessage = async (req, res) => {
  try {
    const data = {
      ticketId: req.body.data.ticketId,
      userId: req.body.data.userId,
      message: req.body.data.message,
    };
    await modules.Message.create({ ...data });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

exports.ticketBalanceTypeId = async (req,res) => {
  try {
  const data = {
    name:req.body.data
  }
  modules.TicketTypes.findOne({
    where: {
      name:data.name
    }
  }).then(function(foundData) {
    res.send(foundData)
  })
} catch(e) {
  res.sendStatus(500)
  console.log(e)
}
}