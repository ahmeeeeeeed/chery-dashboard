'use strict'
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

/*********************************Auth**************************** */
Route.post('/login', 'AuthController.login').middleware('guest')
Route.post('/refreshToken', 'AuthController.refreshToken').middleware('guest')
Route.post('/logout', 'AuthController.logout').middleware('auth')
Route.post('/loginClient', 'AuthController.loginClient').middleware('guest')
Route.get('/getClientAfterAuth/:num/:demande', 'AuthController.getClientAfterAuth').middleware('ClientAutorization')/* .middleware('auth') */ //////
Route.post('/clientAuth', 'AuthController.clientAuth').middleware('guest')
Route.post('/clientLogout', 'AuthController.clientLogout').middleware('ClientAutorization')

/********************************users************************************ */
Route.post('/register', 'UserController.register').middleware('auth')
Route.get('/getUser/:id_user', 'UserController.getUser').middleware('auth')
Route.get('/listusers', 'UserController.listusers').middleware('auth')
Route.get('/listconseillers', 'UserController.listconseillers').middleware('auth')
Route.get('/listadmins', 'UserController.listadmins').middleware('auth')
Route.put('/updateUser/:id_user', 'UserController.updateUser').middleware('auth')
Route.put('/changeConseillerGrants/:id_user', 'UserController.changeConseillerGrants').middleware('auth')
Route.put('/deleteUser/:id_user', 'UserController.deleteUser').middleware('auth')
Route.get('/getNomberConseillers', 'UserController.getNomberConseillers').middleware('auth')

/*******************************clients************************************ */
Route.post('/addClient/:connecter_user', 'ClientController.addClient').middleware('auth')
Route.get('/clients', 'ClientController.clients').middleware('auth')
Route.get('/getClient/:id_client', 'ClientController.getClient').middleware('auth')
Route.put('/updateClient/:id_client/:connecter_user', 'ClientController.updateClient').middleware('auth')
Route.put('/deleteDeffClient/:id_client/:connecter_user', 'ClientController.deleteDeffClient').middleware('auth')
Route.put('/deleteClient/:id_client/:connecter_user', 'ClientController.deleteClient').middleware('auth')
Route.get('/getNomberClient', 'ClientController.getNomberClient').middleware('auth')


/*******************************dossiers************************************ */
Route.post('/addDossier/:connecter_user', 'DossierController.addDossier').middleware('auth')
Route.get('/listDossiers', 'DossierController.listDossiers').middleware('auth')
Route.get('/getDossier/:id_dossier', 'DossierController.getDossier').middleware('auth') //////
Route.put('/updateDossier/:id_dossier/:connecter_user', 'DossierController.updateDossier').middleware('auth')
Route.put('/deleteDossier/:id_dossier/:connecter_user', 'DossierController.deleteDossier').middleware('auth')
Route.put('/changerEtatDossier/:id_dossier/:id_etat/:connecter_user', 'DossierController.changerEtatDossier').middleware('auth')
Route.put('/changerEtatEnsembleDossiers/:connecter_user', 'DossierController.changerEtatEnsembleDossiers').middleware('auth')
Route.get('/getDossiersMemeEtat/:id_etat', 'DossierController.getDossiersMemeEtat').middleware('auth')
Route.get('/getNomberDossier', 'DossierController.getNomberDossier').middleware('auth') //////
Route.get('/getDossiersInfoParEtat', 'DossierController.getDossiersInfoParEtat').middleware('auth') //////

/*******************************etats*************************************** */
Route.post('/addEtat/:connecter_user', 'EtatController.addEtat').middleware('auth')
Route.get('/listEtats', 'EtatController.listEtats').middleware('auth')
Route.get('/listEtatsSupprimes', 'EtatController.listEtatsSupprimes').middleware('auth')
Route.get('/listEtatsSupprimesEtNonSupprimes', 'EtatController.listEtatsSupprimesEtNonSupprimes').middleware('auth')
Route.get('/getEtatById/:id_etat', 'EtatController.getEtatById').middleware('auth')
Route.get('/getEtatByName/:nom', 'EtatController.getEtatByName').middleware('auth')
Route.get('/getEtatByOrdre/:ordre', 'EtatController.getEtatByOrdre').middleware('auth')
Route.get('/getEtatsPrecByOrdre/:id_etat', 'EtatController.getEtatsPrecByOrdre').middleware('auth')
Route.put('/updateEtat/:id_etat/:connecter_user', 'EtatController.updateEtat').middleware('auth')
Route.put('/changerOrdreEtat/:connecter_user', 'EtatController.changerOrdreEtat').middleware('auth')
Route.get('/getNomberEtat', 'EtatController.getNomberEtat').middleware('auth')
Route.get('/getNomberEtatSupprimes', 'EtatController.getNomberEtatSupprimes').middleware('auth')
Route.put('/deleteEtat/:id_etat/:connecter_user', 'EtatController.deleteEtat').middleware('auth')

/*******************************historique************************************ */
Route.get('/getAllHistory', 'HistoriqueController.getAllHistory').middleware('auth')
Route.get('/getHistoryByUser/:id_user', 'HistoriqueController.getHistoryByUser').middleware('auth')
Route.get('/getHistoryByClient/:id_client', 'HistoriqueController.getHistoryByClient').middleware('auth')
Route.get('/getHistoryEtat/:id_etat', 'HistoriqueController.getHistoryEtat').middleware('auth')
Route.get('/getHistoryByDossier/:id_dossier', 'HistoriqueController.getHistoryByDossier').middleware('auth')
Route.get('/getNombreHistoryByDossier/:id_dossier', 'HistoriqueController.getNombreHistoryByDossier').middleware('auth')
Route.get('/getNombreHistory', 'HistoriqueController.getNombreHistory').middleware('auth')

/*****************************************SMS***************************************************** */
Route.post('/addSms', 'SmsApiController.addSms').middleware('auth')
Route.get('/getSms', 'SmsApiController.getSms').middleware('auth')
Route.get('/sendSms', 'SmsApiController.sendSms').middleware('auth')
Route.put('/updateSms', 'SmsApiController.updateSms').middleware('auth')

/*****************************************Mail***************************************************** */
Route.post('/addMail', 'MailApiController.addMail').middleware('auth')
Route.get('/getMails', 'MailApiController.getMails').middleware('auth')
Route.get('/getMailByEtat/:id_etat', 'MailApiController.getMailByEtat').middleware('auth')
Route.get('/getMailById/:id_mail', 'MailApiController.getMailById').middleware('auth')
Route.get('/sendMail', 'MailApiController.sendMail').middleware('auth')
Route.put('/updateMail/:id_mail', 'MailApiController.updateMail').middleware('auth')














