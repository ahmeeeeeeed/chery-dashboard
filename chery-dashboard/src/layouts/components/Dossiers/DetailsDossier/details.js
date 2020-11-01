import React, { useState, useEffect } from 'react';

import { Layout, Breadcrumb, Spin, Row, Col, Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
//import './dossiers.css'
import { listDossiers, getDossier } from '../../../../api/dossiers';
import DossierClient from './dossierClient';
import DossierInfo from './dossierInfo';
import DossierEtatsPrec from './dossierEtatsPrec';
import DossierHistorique from './dosserHistorique';
import { Link } from 'react-router-dom';
import { paths } from '../../../../config/constants';
import history from '../../../../services/history';
import { useDispatch } from 'react-redux';
import allActions from '../../../../redux/actionsStore';


const { Content } = Layout;


//class Details extends React.Component {
const Details = (props) => {

    // console.log(props.data)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(props.data)

    const dispatch = useDispatch()

    useEffect(() => {
        //console.log(props.data)
        dispatch(allActions.sideMenuActions.changeSelectedItemAction("3"))
    })
    const reloadPage = async () => {

        window.location.reload()

    }

    const changeDossierData = async () => {
        await getDossier(props.data.dossier._id).then((res) => {
            //setData(props.data.do)
            props.data.dossier = res
            setData(props.data)
        })
        console.log(props.data.dossier)
        window.location.reload()


    }

    const goToDossier = () => {
        //if (dossier == null)
        history.push(paths.DASHBOARD, { component: paths.DOSSIERS })
    }


    return (
        <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item style={{ cursor: 'pointer' }} onClick={() => goToDossier()} >


                    Dossiers
                        </Breadcrumb.Item>
                {data && <Breadcrumb.Item>{data.dossier.num}</Breadcrumb.Item>}
            </Breadcrumb>

            {
                !data ? (
                    <div className="example">
                        <Spin size="large" />
                    </div>
                ) : (<>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>

                        <Row style={{ padding: 20 }} >
                            <Col offset={2} span={9}>
                                <DossierClient client={data.client} />
                            </Col>
                            <Col offset={2} span={9}>
                                <DossierInfo dossier={data.dossier} reloadPage={reloadPage} changeDossierData={changeDossierData} />
                            </Col>
                        </Row>
                    </div>
                    <Divider />
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>

                        <Title level={3} style={{ padding: 20, textAlign: "center", color: 'cadetblue', marginBottom: 20 }}>
                            Les états précédents
                        </Title>
                        <DossierEtatsPrec dossier={data.dossier} />
                    </div>
                    <Divider />
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>

                        <Title level={3} style={{ padding: 20, textAlign: "center", color: 'cadetblue', marginBottom: 20 }}>
                            Historique de ce dossier
                        </Title>
                        <DossierHistorique dossier={data.dossier} />
                    </div>

                </>
                    )
            }
        </Content >
    );
}
//}

export default Details;