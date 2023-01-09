const DataTypes = require('sequelize'),
    db = require('./dbconnection');

const Faqs = db.define('faqs', {
    header: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});
const BmTypes = db.define('bmTypes', {
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(20),
        defaultValue: 'standard'
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

const Bms = db.define('bms', {
    faceBm: {
        type: DataTypes.STRING(40),
    },
    link1: {
        type: DataTypes.STRING(50),
    },
    link2: {
        type: DataTypes.STRING(50),
    },
    link3: {
        type: DataTypes.STRING(50),
    },
    faceToken: {
        type: DataTypes.STRING(50),
    },
    archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    bought: {
        type: DataTypes.DATE,
    },
    creator: {
        type: DataTypes.INTEGER,
    },
    type: {
        type: DataTypes.STRING(20),
        defaultValue: 'standard'
    }
});

const Permissions = db.define('permissions', {
    acc_bm: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    acc_bm_update: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    users: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    user_update: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    user_balance: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    user_roles: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    user_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    statistics: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    price_list: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    price_list_update: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    log: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    faq_update: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
});

const Countries = db.define('countries', {
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    type: {
        type: DataTypes.STRING(30),
    },
    description: {
        type: DataTypes.TEXT,
    },

});

const Accounts = db.define('accounts', {
    login: {
        type: DataTypes.STRING(40),
    },
    password: {
        type: DataTypes.STRING(32),
    },
    email: {
        type: DataTypes.STRING(40),
    },
    email_password: {
        type: DataTypes.STRING(32),
    },
    code2fa: {
        type: DataTypes.STRING(100),
    },
    agent: {
        type: DataTypes.STRING(200),
        defaultValue: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36'
    },
    resolution: {
        type: DataTypes.STRING(12),
    },
    language: {
        type: DataTypes.STRING(30),
    },
    platform: {
        type: DataTypes.STRING(10),
    },
    concurrency: {
        type: DataTypes.INTEGER,
    },
    proxy: {
        type: DataTypes.STRING(10),
    },
    proxy_id: {
        type: DataTypes.STRING,
    },
    proxy_traffic_total: {
        type: DataTypes.STRING,
    },
    proxy_traffic_left: {
        type: DataTypes.STRING,
    },
    proxy_ip: {
        type: DataTypes.STRING(25),
    },
    proxy_login: {
        type: DataTypes.STRING(40),
    },
    proxy_password: {
        type: DataTypes.STRING(32),
    },
    proxy_date: {
        type: DataTypes.STRING(20),
    },
    act_id: {
        type: DataTypes.STRING(20)
    },
    cookies: {
        type: DataTypes.TEXT('long'),
    },
    selfie: {
        type: DataTypes.STRING(50),
    },
    token: {
        type: DataTypes.STRING(350),
    },
    note: {
        type: DataTypes.STRING(50),
    },
    limited: {
        type: DataTypes.INTEGER,
    },
    archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    bought: {
        type: DataTypes.DATE,
    },
    birth: {
        type: DataTypes.STRING(20),
    },
    creator: {
        type: DataTypes.INTEGER,
    },
    uuid: {
        type: DataTypes.STRING(40),
    },
    type: {
        type: DataTypes.STRING(30),
    }
});

const Statuses = db.define('statuses', {
    name: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
});
const Log = db.define('logs', {
    owner: {
        type: DataTypes.INTEGER,
    },
    receiver: {
        type: DataTypes.INTEGER,
    },
    operation: {
        type: DataTypes.INTEGER,
    },
    description: {
        type: DataTypes.STRING(600),
    },
    amount: {
        type: DataTypes.INTEGER,
    }
});

const Users = db.define('users', {
    email: {
        type: DataTypes.STRING(50),
        unique: true
    },
    email_confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    password: {
        type: DataTypes.STRING(60),
    },
    telegram: {
        type: DataTypes.STRING(40),
    },
    skype: {
        type: DataTypes.STRING(50),
    },
    country: {
        type: DataTypes.STRING(25),
    },
    balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    page: {
        type: DataTypes.INTEGER,
        defaultValue: 25
    },
    telMessages: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    mla: {
        type: DataTypes.STRING(40),
    },
    auth: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    ru: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    manager: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    managerId: {
        type: DataTypes.INTEGER,
        defaultValue: 2
    },
    name: {
        type: DataTypes.STRING(10),
    },
    works: {
        type: DataTypes.STRING(40),
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    referred_user_id: {
        type: DataTypes.INTEGER, //id of the user who invited you
    }
});

const Phones = db.define('phones', {
    host: {
        type: DataTypes.STRING(40)
    },
    name: {
        type: DataTypes.STRING(20)
    },
    phone: {
        type: DataTypes.STRING(40)
    },
    text: {
        type: DataTypes.TEXT
    }
});

const Tickets = db.define('tickets', {
    title: {
        type: DataTypes.STRING(100)
    },
    description: {
        type: DataTypes.TEXT
    },
    solved: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    transaction_id: {
        type: DataTypes.STRING,
    }
});
const TicketTypes = db.define('ticketTypes', {
    name: {
        type: DataTypes.STRING(20)
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1
    }
});
const Message = db.define('message', {
    message: {
        type: DataTypes.STRING(600)
    },
    src: {
        type: DataTypes.STRING(1000)
    },
    type: {
        type: DataTypes.STRING(600)
    },
    isRead: {
        type: DataTypes.BOOLEAN
    }

});

const Requisites = db.define('requisites', {
    currency_ticker: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    currency_name: {
        type: DataTypes.STRING(100)
    },
    requisites: {
        type: DataTypes.STRING(100)
    }

})

const Referrals = db.define('referrals', { // referral data of the user
    users_invited: {
        type: DataTypes.INTEGER
    },
    referral_revenue: {
        type: DataTypes.DECIMAL
    },
    referral_level: {
        type: DataTypes.INTEGER //percentage
    }
})

Users.hasOne(Referrals);
Referrals.belongsTo(Users)

BmTypes.hasMany(Bms);
Bms.belongsTo(BmTypes);

Statuses.hasMany(Bms);
Bms.belongsTo(Statuses);

Bms.hasOne(Accounts);
Accounts.belongsTo(Bms);

Users.hasMany(Bms);
Bms.belongsTo(Users);

Countries.hasMany(Accounts);
Accounts.belongsTo(Countries);

Statuses.hasMany(Accounts);
Accounts.belongsTo(Statuses);

Users.hasMany(Accounts);
Accounts.belongsTo(Users);

Users.hasOne(Permissions);
Permissions.belongsTo(Users);

TicketTypes.hasMany(Tickets);
Tickets.belongsTo(TicketTypes);

Users.hasOne(Tickets);
Tickets.belongsTo(Users);

Tickets.hasMany(Message);
Message.belongsTo(Tickets);

Users.hasOne(Message);
Message.belongsTo(Users);

Requisites.hasOne(Tickets)
Tickets.belongsTo(Requisites)

module.exports = {
    Faqs,
    Countries,
    Accounts,
    Statuses,
    Users,
    BmTypes,
    Bms,
    Log,
    Permissions,
    Phones,
    TicketTypes,
    Tickets,
    Message,
    Requisites,
    Referrals,
};