import { Layout } from 'antd';
import React from 'react';


import HeaderLyout from './HeaderLayout'
import SidemenuLayout from './SidemenuLayout'
import Accueil from './components/Accueil/accueil'
import Clients from './components/Clients/afficherClients'
import Etats from './components/Etats/afficherEtats'
import Dossiers from './components/Dossiers/afficherDossiers'
import Historiques from './components/Historiques/afficherHistoriques'
import Conseillers from './components/Conseillers/afficherConseillers'
import DossierDetails from './components/Dossiers/DetailsDossier/details'
import EmailSMS from './components/EmailSms/afficherEmailSms'




import FooterLayout from './FooterLayout'

import { paths } from '../config/constants'

class DashboardLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = { marginleft: 200 }
    this.changeMargin = this.changeMargin.bind(this)

  }

  changeMargin(event) {

    if (event)
      this.setState({ marginleft: 100 })
    else this.setState({ marginleft: 200 })
  }

  render() {

    return (
      <Layout>
        <HeaderLyout />
        <Layout style={{ minHeight: '100vh' }}>
          <SidemenuLayout collapseHandler={this.changeMargin} />
          <Layout style={{ marginLeft: this.state.marginleft }}
            /* {...console.log("before : " + this.props.location.state)} */
                 /* style={{overflow:'auto', position : 'absolute',left:200,top:84, width : '85.2%',height:'100%'}}  */ className="site-layout">
            {this.props.location.state && this.props.location.state.component === paths.DOSSIER_DETAILS ?
              (<><DossierDetails data={this.props.location.state} /></>)
              :
              (
                <>
                  {this.props.location.state && this.props.location.state.component === paths.DOSSIERS ?
                    (<><Dossiers data={this.props.location.state} /></>)
                    :
                    (
                      <>
                        {this.props.location.component === paths.DASHBOARD && <Accueil />}
                        {this.props.location.component === paths.CLIENTS && <Clients />}
                        {this.props.location.component === paths.DOSSIERS && <Dossiers />}
                        {this.props.location.component === paths.ETATS && <Etats />}
                        {this.props.location.component === paths.CONSEILLERS && <Conseillers />}
                        {this.props.location.component === paths.HISTORIQUES && <Historiques />}
                        {this.props.location.component === paths.EMAIL_SMS && <EmailSMS />}
                        {/* {this.props.location.state && <DossierDetails />} */}
                        {!this.props.location.component && <Accueil />}
                      </>
                    )}

                </>
              )}


            <FooterLayout />
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default DashboardLayout;