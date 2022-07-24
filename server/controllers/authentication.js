const modules = require('../dbmodels'),
    jwt = require('jsonwebtoken'),
    generator = require('generate-password'),
    nodemailer = require('nodemailer'),
    bcrypt = require('bcrypt'),
    speakeasy = require('speakeasy');
require('dotenv').config();

const images = [{filename: 'logo.png', path: './img/logo.png', cid: 'logo'},
    {filename: 'telegram.png', path: './img/telegram.png', cid: 'telegram'},
    {filename: 'facebook.png', path: './img/facebook.png', cid: 'facebook'}];

const transporter = nodemailer.createTransport({
    host: 'cpanel1.v.fozzy.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {rejectUnauthorized: false}
});
exports.token = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        try {
            const userData = await modules.Users.findOne({
                attributes: ['admin', 'active'],
                where: {
                    id: user.id
                },
                include: {
                    model: modules.Permissions,
                }
            });
            if (userData.active) {
                if (userData.admin) {
                    req.admin = userData.admin;
                    req.permission = userData.permission;
                }
                req.id = user.id;
                next()
            } else {
                return res.send('clear')
            }
        } catch (e) {
            res.send('clear')
        }
    });
};

exports.reset = async (req, res) => {
    try {
        const userEmail = jwt.verify(req.body.secret, process.env.FORGET_PASSWORD);
        if (userEmail) {
            const newPassword = generator.generate({
                length: 8,
                numbers: true
            });
            const img = [{filename: 'password.png', path: './img/password.png', cid: 'password'}].concat(images);
            const mailOptions = {
                from: 'info@ostproduct.com',
                to: userEmail,
                subject: 'New password at OST PRODUCT',
                html: `<div style="width:100%;background:#404040;text-align:center;font-family:Arial,sans-serif">
                        <div style="max-width:600px;margin-left:auto;margin-right:auto;">
                            <div style="padding: 40px 30px 30px 30px"><a href="https://${req.get('host')}"><img src="cid:logo" style="width:165px"></a></div>
                            <div style="background:#ffffff;padding:30px">
                                <div style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;text-align:left">
                                    New password
                                </div>
                                <div style="text-align:left">
                                    Hi, we've changed your account password into:
                                    <div style="margin:10px 0;font-weight:bold">${newPassword}</div>
                                    You can change it to your own in your account settings. 
                                </div>
                                <br>
                                <a href="https://${req.get('host')}" 
                                style="background:linear-gradient(274.02deg,#228de2,#4252e6 50.52%,#4428b6);width:100%;padding:10px 0;display:block;border-radius:8px;color:white;font-size:26px;font-weight:600;cursor:pointer;text-decoration:none">
                                    Go to main page
                                </a>
                                <img src="cid:password" alt="password" style="width:540px;margin-top:70px">
                                <div style="background:#404040;padding:30px;color:white;border-radius:4px;font-size:14px;line-height:20px;font-weight:bold">
                                    <div style="margin-bottom:10px">
                                        <a href="https://www.facebook.com/ostproduct"><img src="cid:facebook" alt="facebook" style="width:30px;margin-right:10px;cursor:pointer"></a>
                                        <a href="https://www.t.me/ostproduct"><img src="cid:telegram" alt="telegram" style="width:30px;cursor:pointer"></a>
                                    </div>
                                    &reg; OST TEAM, 2021
                                </div>
                            </div>
                        </div>
                    </div>`,
                attachments: img
            };
            await modules.Users.update({password: bcrypt.hashSync(newPassword, 10)}, {
                where: {
                    email: userEmail
                }
            });
            await transporter.sendMail(mailOptions, function (error) {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200)
                }
            });
        } else {
            res.sendStatus(401)
        }
    } catch (e) {
        res.sendStatus(401)
    }
};
exports.confirmEmail = async (req, res) => {
    try {
        const userEmail = jwt.verify(req.body.secret, process.env.FORGET_PASSWORD);
        const user = await modules.Users.findOne({
            attributes: ['id', 'email_confirmed'],
            where: {
                email: userEmail
            }
        });
        if (user) {
            if (user.email_confirmed !== true) {
                await modules.Users.update({email_confirmed: true}, {
                    where: {
                        id: user.id
                    }
                });
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(401)
        }
    } catch (e) {
        res.sendStatus(401);
    }
};
exports.login = async (req, res) => {
    const userLogin = {
        email: req.body.email,
        password: req.body.password,
        token: req.body.token
    };
    try {
        const user = await modules.Users.findOne({
            raw: true,
            where: {
                email: userLogin.email
            }
        });
        if (user) {
            if (bcrypt.compareSync(userLogin.password, user.password)) {
                if (!user.approved || !user.active) {
                    !user.approved && res.json({
                        code: 'activation',
                        err: 'Please confirm your email\n' + `Use the link from the letter sent on ${userLogin.email} to start the confirmation process. If you do not receive the email please check your spam filter or contact us.`
                    });
                    !user.active && res.json({err: 'Your account has been disabled'});
                } else {
                    if (user.id === 1) {
                        if (userLogin.token === '') return res.json({code: 'qrcode', err: 'qrcode'});
                        let result = speakeasy.totp.verify({
                            secret: process.env.ascii,
                            encoding: 'ascii',
                            token: userLogin.token
                        });
                        return result ? res.json({token: jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET)}) : res.json({
                            code: 'qrcode',
                            err: 'Wrong qrcode!'
                        });
                    } else {
                        return res.json({token: jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET)});
                    }
                }
            } else {
                res.json({err: 'You enter wrong password'});
            }
        } else {
            res.json({err: 'Such user does not exist'})
        }
    } catch (e) {
        res.send(e);
    }
};

exports.forget = async (req, res) => {
    try {
        const user = await modules.Users.findOne({
            raw: true,
            where: {
                email: req.body.email
            }
        });
        if (user) {
            const img = [{filename: 'forgot.png', path: './img/forgot.png', cid: 'forgot'}].concat(images);
            const mailOptions = {
                from: 'info@ostproduct.com',
                to: user.email,
                subject: 'Reset password at OST PRODUCT',
                html: `<div style="width:100%;background:#404040;text-align:center;font-family:Arial,sans-serif">
                        <div style="max-width:600px;margin-left:auto;margin-right:auto">
                            <div style="padding: 40px 30px 30px 30px"><a href="https://${req.get('host')}"><img src="cid:logo" style="width:165px"></a></div>
                            <div style="background:#ffffff;padding:30px">
                                <div style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;text-align:left">
                                    Forgot your password?
                                </div>
                                <div style="text-align:left">Hi friend,
                                    <br>
                                    You've recently asked to reset password for this account: ${user.email}
                                    <br>
                                    To update your password, click the link below :
                                </div>
                                <br>
                                <a href="https://${req.get('host')}/reset/${jwt.sign(user.email, process.env.FORGET_PASSWORD)}" 
                                style="background:linear-gradient(274.02deg,#228de2,#4252e6 50.52%,#4428b6);width:100%;padding:10px 0;display:block;border-radius:8px;color:white;font-size:26px;font-weight:600;cursor:pointer;text-decoration:none">
                                    Confirm
                                </a>
                                <img src="cid:forgot" alt="forgot" style="width:540px;margin-top:70px">
                                <div style="background:#404040;padding:30px;color:white;border-radius:4px;font-size:14px;line-height:20px;font-weight:bold">
                                    <div style="margin-bottom:10px">
                                        <a href="https://www.facebook.com/ostproduct"><img src="cid:facebook" alt="facebook" style="width:30px;margin-right:10px;cursor:pointer"></a>
                                        <a href="https://www.t.me/ostproduct"><img src="cid:telegram" alt="telegram" style="width:30px;cursor:pointer"></a>
                                    </div>
                                    &reg; OST TEAM, 2021
                                </div>
                            </div>
                        </div>
                    </div>`,
                attachments: img
            };

            await transporter.sendMail(mailOptions, function (error) {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            res.json({err: 'Such user does not exist'})
        }
    } catch (e) {
        res.sendStatus(e)
    }
};

exports.registration = async (req, res) => {
    try {
        const userInfo = {
            email: req.body.email,
            password: req.body.password,
            telegram: req.body.telegram,
            skype: req.body.skype,
            mla: req.body.mla,
            country: req.body.country,
            referred_user_id: req.body.referredUserId
        };
        const user = await modules.Users.findOne({
            where: {
                email: userInfo.email
            }
        });
        if (!user) {
            userInfo.password = bcrypt.hashSync(userInfo.password, 10);
            await modules.Users.create(userInfo);

            const user = await modules.Users.findOne({
                attributes: ['id'],
                raw: true,
                where: {
                    email: req.body.email
                }
            });
            if (req.body.referredUserId) {
                await modules.Referrals.increment('users_invited', {
                        by: 1,
                        where: {
                            userId: req.body.referredUserId
                        }
                    }
                )
            }
            const userReferralData = {
                referral_revenue: 0,
                referral_level: 5,
                userId: user.id,
                users_invited: 0
            }
            await modules.Referrals.create(userReferralData)
            await modules.Log.create({
                owner: user.id,
                receiver: user.id,
                operation: 5,
                description: `Registered user: ${user.id}`,
            });

            const img = [{
                filename: 'registration.png',
                path: './img/registration.png',
                cid: 'registration'
            }].concat(images);
            const mailOptions = {
                from: 'info@ostproduct.com',
                to: userInfo.email,
                subject: 'Registration at OST PRODUCT',
                html: `<div style="width:100%;background:#404040;text-align:center;font-family:Arial,sans-serif">
                        <div style="max-width:600px;margin-left:auto;margin-right:auto">
                            <div style="padding: 40px 30px 30px 30px"><a href="https://${req.get('host')}"><img src="cid:logo" style="width:165px"></a></div>
                            <div style="background:#ffffff;padding:30px">
                                <div style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;text-align:left">
                                    Registration Successful
                                </div>
                                <div style="text-align:left">
                                    Your application will undergo administrative review and you will receive our decision by email shortly.
                                    <br>
                                    Please click here to confirm your email address by clicking the link below:
                                </div>
                                <br>
                                <a href="https://${req.get('host')}/email/${jwt.sign(userInfo.email, process.env.FORGET_PASSWORD)}" 
                                style="background:linear-gradient(274.02deg,#228de2,#4252e6 50.52%,#4428b6);width:100%;padding:10px 0;display:block;border-radius:8px;color:white;font-size:26px;font-weight:600;cursor:pointer;text-decoration:none">
                                    Confirm
                                </a>
                                <img src="cid:registration" alt="registration" style="width:540px;margin-top:70px">
                                <div style="background:#404040;padding:30px;color:white;border-radius:4px;font-size:14px;line-height:20px;font-weight:bold">
                                    <div style="margin-bottom:10px">
                                        <a href="https://www.facebook.com/ostproduct"><img src="cid:facebook" alt="facebook" style="width:30px;margin-right:10px;cursor:pointer"></a>
                                        <a href="https://www.t.me/ostproduct"><img src="cid:telegram" alt="telegram" style="width:30px;cursor:pointer"></a>
                                    </div>
                                    &reg; OST TEAM, 2021
                                </div>
                            </div>
                        </div>
                    </div>`,
                attachments: img
            };
            await transporter.sendMail(mailOptions, function (error) {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            res.json({err: 'Such user exist'})
        }
    } catch (e) {
        console.log(e);
    }
};

exports.approve = async (req, res) => {
    if (req.admin) {
        try {
            const user = await modules.Users.findByPk(req.body.data);
            if (user) {
                await modules.Users.update({
                    approved: true,
                    name: 'Julie'
                }, {
                    where: {
                        id: user.id
                    }
                });
                await modules.Permissions.create({
                    acc_bm: 0,
                    acc_bm_update: false,
                    users: 0,
                    user_update: false,
                    user_balance: false,
                    user_roles: false,
                    user_active: false,
                    statistics: false,
                    price_list: false,
                    price_list_update: false,
                    log: false,
                    faq_update: false,
                    userId: user.id
                });
                await modules.Log.create({
                    owner: req.id,
                    receiver: req.body.data,
                    operation: 5,
                    description: `Approved user: ${req.body.data}`,
                });
                const img = [{filename: 'approve.png', path: './img/approve.png', cid: 'approve'}].concat(images);
                const mailOptions = {
                    from: 'info@ostproduct.com',
                    to: user.email,
                    subject: 'Your account was approved at OST PRODUCT',
                    html: `<div style="width:100%;background:#404040;text-align:center;font-family:Arial,sans-serif">
                        <div style="max-width:600px;margin-left:auto;margin-right:auto">
                            <div style="padding: 40px 30px 30px 30px"><a href="https://${req.get('host')}"><img src="cid:logo" style="width:165px"></a></div>
                            <div style="background:#ffffff;padding:30px">
                                <div style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;text-align:left">
                                    You have been approved by OST Team
                                </div>
                                <div style="text-align:left">Hi friend,
                                    <br>
                                    Congratulations, your application with us has been approved!
                                </div>
                                <br>
                                <a href="https://${req.get('host')}" 
                                style="background:linear-gradient(274.02deg,#228de2,#4252e6 50.52%,#4428b6);width:100%;padding:10px 0;display:block;border-radius:8px;color:white;font-size:26px;font-weight:600;cursor:pointer;text-decoration:none">
                                    Go to main page
                                </a>
                                <img src="cid:approve" alt="approve" style="width:540px;margin-top:70px">
                                <div style="background:#404040;padding:30px;color:white;border-radius:4px;font-size:14px;line-height:20px;font-weight:bold">
                                    <div style="margin-bottom:10px">
                                        <a href="https://www.facebook.com/ostproduct"><img src="cid:facebook" alt="facebook" style="width:30px;margin-right:10px;cursor:pointer"></a>
                                        <a href="https://www.t.me/ostproduct"><img src="cid:telegram" alt="telegram" style="width:30px;cursor:pointer"></a>
                                    </div>
                                    &reg; OST TEAM, 2021
                                </div>
                            </div>
                        </div>
                    </div>`,
                    attachments: img
                };
                await transporter.sendMail(mailOptions, function (error) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.send('No such user found')
            }
        } catch (e) {
            res.send(e)
        }
    } else {
        res.send('You need to be administrator')
    }
};

/*function generateQrcode() {
    const qrcode = require('qrcode');
    const secret = speakeasy.generateSecret({
        name: 'Hello Zuckerberg'
    });
    console.log(secret);
    qrcode.toDataURL(secret.otpauth_url, function (err, data) {
        console.log(data);
    })
}*/
