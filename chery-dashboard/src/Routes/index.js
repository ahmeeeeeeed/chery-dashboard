import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import RouterWrapper from './RouterWrapper'

import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../layouts/components/Login/Login'
import afficherHistoriques from '../layouts/components/Historiques/afficherHistoriques'
import afficherEtats from '../layouts/components/Etats/afficherEtats'
import afficherDossiers from '../layouts/components/Dossiers/afficherDossiers'
import afficherConseillers from '../layouts/components/Conseillers/afficherConseillers'
import afficherClients from '../layouts/components/Clients/afficherClients'
import Not_found from '../layouts/components/NotFound/NotFound'


import { paths } from '../config/constants'

export default function Routes() {

    return (<>

        <Switch>
            <RouterWrapper exact path={paths.MAIN} component={DashboardLayout} isPrivate />
            <RouterWrapper exact path={paths.DASHBOARD} component={DashboardLayout} isPrivate />
            <RouterWrapper path={paths.LOGIN} component={Login} />
            {/* <RouterWrapper path={paths.HISTORIQUES} component={afficherHistoriques} isPrivate />
            <RouterWrapper path={paths.ETATS} component={afficherEtats} isPrivate />
            <RouterWrapper path={paths.DOSSIERS} component={afficherDossiers} isPrivate />
            <RouterWrapper path={paths.CONSEILLERS} component={afficherConseillers} isPrivate />
            <RouterWrapper path={paths.CLIENTS} component={afficherClients} isPrivate />  */}
            <Route to={paths.NO_MATCH} component={Not_found} />
        </Switch>

        { /* <Switch>
            <Redirect exact from='/' to='/dashboard' />
            <Route exact path={paths.DASHBOARD} component={DashboardLayout}  />
            <Route path={paths.LOGIN} component={Login} />
            <Route path={paths.HISTORIQUES} exact component={afficherHistoriques}  />
            <Route path={paths.ETATS} component={afficherEtats}  />
            <Route path={paths.DOSSIERS} component={afficherDossiers}  />
            <Route path={paths.CONSEILLERS} component={afficherConseillers}  />
            <Route path={paths.CLIENTS} component={afficherClients} />
            <Redirect to="/not_found" />
        </Switch> */ }
    </>)
}