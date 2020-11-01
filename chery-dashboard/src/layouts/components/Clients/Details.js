import React, { useState, useEffect } from 'react'
import { Drawer, List, Avatar, Divider, Col, Row, Card, Empty } from 'antd';
import './Details.css'

import { getDateExact } from '../../../helpers/userdata'
import { UserOutlined } from '@ant-design/icons';
import { paths } from '../../../config/constants';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import allActions from '../../../redux/actionsStore';


const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

function Details({ data, etats, detailsDrawerState }) {
  //state = { visible: true, client: {} };
  let history = useHistory()

  const [visible, setVisible] = useState(true)
  const [client, setClient] = useState({})
  const dispatch = useDispatch()


  const showDrawer = () => {
    /*  this.setState({
       visible: true,
     }); */
    setVisible(true)
  };

  const onClose = () => {
    /* this.setState({
      visible: false,
    }); */
    setVisible(false)
    setTimeout(() => {
      detailsDrawerState()
    }, 500);

  };
  /* componentDidMount() {
    //console.log(data)
    this.setState({ client: this.props.data })
  } */

  useEffect(() => {
    setClient(data)

  }
    , [])

  const goToDossierDetails = (dossier, client) => {

    window.location.reload()//to force delete props.location.state and recreate an other one
    dispatch(allActions.sideMenuActions.changeSelectedItemAction("3"))
    history.push(paths.DASHBOARD, { dossier: dossier, client: client, component: paths.DOSSIER_DETAILS })
  }



  //render() {
  return (
    <>

      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
          <Avatar style={{ marginRight: 10 }} size={64} icon={<UserOutlined />} />
          {/*           <Avatar style={{ marginRight: 10 }} size={100} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
 */}

          Informations du clients
          </p>
        <p className="site-description-item-profile-p">Personelles</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Nom" content={client.nom} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Prénom" content={client.prenom} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="CIN" content={client.CIN} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Adresse" content={client.adresse} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Email" content={client.email} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Numéro du téléphone" content={client.tel} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="Date d'ajout" content={getDateExact(client.created_at)} />
          </Col>

        </Row>

        <Row>
          <Col span={16}>
            <DescriptionItem title="Date de derniére modification" content={getDateExact(client.updated_at)} />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="VIP"
              content={client.VIP}
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Dossiers({data.dossiers.length})</p>

        <div className="site-card-wrapper">
          <Row gutter={16}>

            {data.dossiers && data.dossiers.map((value, index) => (
              <Col span={12} key={index} >
                <Card style={{ marginBottom: 12 }} hoverable={true} title={`Numéro ${value.num}`} bordered={true}
                  onClick={() => goToDossierDetails(value, data)}   >
                  {/*  <Link to={{ pathname: paths.DASHBOARD, component: paths.CONSEILLERS }} /> */}
                  <DescriptionItem title="Date d'ajout" content={getDateExact(value.created_at)} /><br />
                  <DescriptionItem title="Etat actuel" content={etats[index]} />
                </Card>
              </Col>

            ))}

          </Row>
          {!data.dossiers.length && <Empty description="Pas de dossiers ajoutés pour le moment" />}
        </div>


      </Drawer>
    </>
  );
}
//}

export default Details