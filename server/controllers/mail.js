const modules = require('../dbmodels'),
nodemailer = require('nodemailer')


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

const images = [{filename: 'logo.png', path: './img/logo.png', cid: 'logo'},
    {filename: 'telegram.png', path: './img/telegram.png', cid: 'telegram'},
    {filename: 'facebook.png', path: './img/facebook.png', cid: 'facebook'}]

exports.sendGeneralMail = async (req, res) => {
        const {mailSubject, mailText} = req.body
        const rawEmails = await modules.Users.findAll({
            attributes:['email'],
            raw : true
        })
        const emails = rawEmails.map(el => el.email)
    const mailConfig = {
        from:'info@ostproduct.com',
        to: emails,
    subject:mailSubject,
        html:`<head>
        <style>
        table, td, div, h1, p {
          font-family: Arial, sans-serif;
        }
        @media screen and (max-width: 530px) {
          .unsub {
            display: block;
            padding: 8px;
            margin-top: 14px;
            border-radius: 6px;
            background-color: #404040;
            text-decoration: none !important;
            font-weight: bold;
          }
          .col-lge {
            max-width: 100% !important;
          }
        }
        @media screen and (min-width: 531px) {
          .col-sml {
            max-width: 27% !important;
          }
          .col-lge {
            max-width: 73% !important;
          }
        }
      </style>
    </head>
        <body style="margin:0;padding:0;word-spacing:normal;background-color:#404040;">
        <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#404040;">
          <table role="presentation" style="width:100%;border:none;border-spacing:0;">
            <tr>
              <td align="center" style="padding:0;">
                <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:black;">
                  <tr>
                    <td style="padding:40px 30px 30px 30px;text-align:center;font-size:26px;font-weight:bold;">
                      <a href="" style="text-decoration:none;"><img src="cid:logo" width="165" alt="Logo" style="width:80%;max-width:165px;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px;background-color:#ffffff;">
                      <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">${mailSubject}</h1>
                      <p style="margin:0;">Greetings dear, <br>
                           ${mailText}
                      </div>
                          </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">\
                      <table role="presentation" width="100%">
                      <tr>
                      <td style="width:145px;" align="left" valign="top">
                    </td>
                  </tr>
                    <td style="padding:30px;text-align:center;font-size:30px;background-color:#404040;color:white;border-radius: 4px;">
                      <p style="margin:0 0 10px 0;">
                        <a href="http://www.facebook.com/ostproduct" style="text-decoration:none;"><img src="cid:facebook" width="30" height="30" alt="facebook" style="display:inline-block;color:white;"></a>

                         <a href="http://www.t.me/ostproduct" style="text-decoration:none;"><img src="cid:telegram" width="30" height="30" alt="telegram" style="display:inline-block;color:white;"></a>
    
                      </p>
                      <p style="margin:0;font-size:14px;line-height:20px;font-weight:bold;">&reg; OST TEAM, 2021<br>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>`,
      attachments:images
    }
    await transporter.sendMail(mailConfig, function(error){
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
    
}


exports.sendOptionalMail = async(req, res) => {
    const {emails,mailSubject, mailText} = req.body
    const mailConfig = {
        from:'info@ostproduct.com',
        to: emails,
        subject:mailSubject,
        html:`<head>
        <style>
        table, td, div, h1, p {
          font-family: Arial, sans-serif;
        }
        @media screen and (max-width: 530px) {
          .unsub {
            display: block;
            padding: 8px;
            margin-top: 14px;
            border-radius: 6px;
            background-color: #404040;
            text-decoration: none !important;
            font-weight: bold;
          }
          .col-lge {
            max-width: 100% !important;
          }
        }
        @media screen and (min-width: 531px) {
          .col-sml {
            max-width: 27% !important;
          }
          .col-lge {
            max-width: 73% !important;
          }
        }
      </style>
    </head>
        <body style="margin:0;padding:0;word-spacing:normal;background-color:#404040;">
        <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#404040;">
          <table role="presentation" style="width:100%;border:none;border-spacing:0;">
            <tr>
              <td align="center" style="padding:0;">
                <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:black;">
                  <tr>
                    <td style="padding:40px 30px 30px 30px;text-align:center;font-size:26px;font-weight:bold;">
                      <a href="" style="text-decoration:none;"><img src="cid:logo" width="165" alt="Logo" style="width:80%;max-width:165px;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px;background-color:#ffffff;">
                      <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">${mailSubject}</h1>
                      <p style="margin:0;">Greetings dear, <br>
                           ${mailText}
                      </div>
                          </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">\
                      <table role="presentation" width="100%">
                      <tr>
                      <td style="width:145px;" align="left" valign="top">
                    </td>
                  </tr>
                    <td style="padding:30px;text-align:center;font-size:30px;background-color:#404040;color:white;border-radius: 4px;">
                      <p style="margin:0 0 10px 0;">
                        <a href="http://www.facebook.com/ostproduct" style="text-decoration:none;"><img src="cid:facebook" width="30" height="30" alt="facebook" style="display:inline-block;color:white;"></a>

                         <a href="http://www.t.me/ostproduct" style="text-decoration:none;"><img src="cid:telegram" width="30" height="30" alt="telegram" style="display:inline-block;color:white;"></a>
    
                      </p>
                      <p style="margin:0;font-size:14px;line-height:20px;font-weight:bold;">&reg; OST TEAM, 2021<br>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>`,
      attachments:images
    }
    await transporter.sendMail(mailConfig, function(error){
        if (error) {
            console.log(error);
            res.status(500);
        } else {
            res.sendStatus(200);
        }
    });
}

exports.getUsersMailData = async(req,res) => {
    try{
    const data = await modules.Users.findAll({
        attributes: ['id', 'email'],
    });
    res.send(data).status(200)
} catch(e) {
    console.log(e)
    res.status(500)
}
}


