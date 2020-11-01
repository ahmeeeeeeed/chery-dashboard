'use strict'

const Historique = use('App/Models/Historique')
const MailApi = use('App/Models/MailApi')
const Etat = use('App/Models/Etat')
const Mailgun = use('mailgun-js')
const Env = use('Env')




const addHistorique = async (desc, user, client, dossier, etat, mail) => {
    //console.log({ desc, user, client, dossier, etat, mail })
    return await Historique.create({
        desc: desc,
        user: user,
        client: client,
        dossier: dossier,
        etat: etat,
        mail: mail
    })
}
const send = (email, subject, prenom, nom, mail, id_etat, id_dossier, desc, DOMAIN, api_key, MAIL_ACCOUT_ADDRESS) => {
    //console.log(desc)
    const mailjet = use('node-mailjet')
        .connect(api_key, DOMAIN)
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": MAIL_ACCOUT_ADDRESS,
                        "Name": "Chery Tunisie"
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": nom + ' ' + prenom
                        }
                    ],
                    "Subject": subject,
                    "TextPart": mail.description,
                    "HTMLPart": "<h3>Cher client, bienvenu chez <a href='https://www.mailjet.com/'>Chery Tunisie</a>!</h3><br />" + desc,
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        })
    request
        .then((result) => {
            console.log(result.body.Messages)
            let descr = "Un email de " + subject + " vient d'être envoyé"
            addHistorique(descr, null, null, id_dossier, id_etat, mail.toJSON()._id)
            return result.body.Messages[0]
        })
        .catch((err) => {
            console.log(err.statusCode)
            return err.statusCode
        })


}
class MailApiController {

    async sendMail({ request, response, auth, params }) {
        try {
            const { email, subject, id_etat, id_dossier, prenom, nom, cin, num } = request.all()
            const APIKEY_PRIVATE = Env.get('APIKEY_PRIVATE');
            const APIKEY_PUBLIC = Env.get('APIKEY_PUBLIC')
            const MAIL_ACCOUT_ADDRESS = Env.get('MAIL_ACCOUT_ADDRESS')

            const mail = await MailApi.findBy('etat', id_etat)

            var chars = { '{nom_prenom}': nom + ' ' + prenom, '{cin}': cin, '{num_dossier}': num };
            mail.description = mail.description.replace(/{nom_prenom}/g, m => chars[m]);
            mail.description = mail.description.replace(/{cin}/g, m => chars[m]);
            mail.description = mail.description.replace(/{num_dossier}/g, m => chars[m]);
            //console.log(mail.description)
            return send(email, subject, prenom, nom, mail, id_etat, id_dossier, mail.description, APIKEY_PRIVATE, APIKEY_PUBLIC, MAIL_ACCOUT_ADDRESS)

            /*   const { email, subject, id_etat, id_dossier } = request.all()
              const DOMAIN = Env.get('API_MAIL_DOMAIN');
              const api_key = Env.get('API_MAIL_KEY')
              var mailgun = Mailgun({ apiKey: api_key, domain: DOMAIN });
  
              const mail = await MailApi.findBy('etat', id_etat)
  
              //console.log({ email, subject, id_etat, id_dossier })
              const data = {
                  from: 'Chery Tunisie chery_tunisie@email.com',
                  to: email,
                  subject: subject,
                  text: mail.description,
                  template: "templatechery",
                  'h:X-Mailgun-Variables': { body: "test_text" }
              };
              mailgun.messages().send(data, function (error, body) {
                  if (error) {
                      console.log("got an error: ", error);
                      return response.send(error)
                  }
                  else {
  
                      let desc = "Un email de " + subject + " vient d'être envoyé"
                      addHistorique(desc, null, null, id_dossier, id_etat, mail.toJSON()._id)
                      console.log(body);
                      return response.json(body)
                  }
  
              });*/
        } catch (error) {
            console.log(err)
            return response.json(err)
        }
    }

    async addMail({ request, response, auth, params }) {
        try {
            const mail = await MailApi.create(request.all())

            return response.json(mail)
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }

    }
    async getMails({ request, response, auth, params }) {
        try {
            //const listmails = await MailApi.where({ ordre: { $gte: 1 } }).sort({ ordre: 1 }).fetch()
            const x = await Etat.where({ ordre: { $gte: 1 } }).sort({ ordre: 1 }).fetch()
            const tabMails = []
            for (let index = 0; index < x.toJSON().length; index++) {
                // console.log(x.toJSON()[index])
                const mail = await MailApi.findBy('etat', x.toJSON()[index]._id)
                mail.etat = x.toJSON()[index].nom
                tabMails.push(mail)
            }
            if (tabMails.length)
                return response.json(tabMails)
            else response.status(204).send("no content")
        } catch (error) {
            console.log(err)
            return response.send(err)
        }
    }

    async getMailByEtat({ request, response, auth, params }) {
        try {
            return response.json(await MailApi.findBy('etat', params.id_etat))
        } catch (error) {
            console.log(err)
            return response.send(err)
        }
    }
    async getMailById({ request, response, auth, params }) {
        try {
            return response.json(await MailApi.find(params.id_mail))
        } catch (error) {
            console.log(err)
            return response.send(err)
        }
    }



    async updateMail({ request, response, auth, params }) {
        try {
            const content = request.all()
            const mail = await MailApi.find(params.id_mail)
            mail.description = content.description
            mail.deleted_at = content.deleted_at
            mail.save()
            return response.json(mail)
        } catch (error) {
            console.log(err)
            return response.send(err)
        }
    }

}

module.exports = MailApiController
