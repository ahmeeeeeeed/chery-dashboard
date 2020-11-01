import React, { useState, useEffect } from 'react';
import './accueil.css'
import { Card, Col, Row, Avatar, Typography } from 'antd';

import { UserOutlined, FolderOpenOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getNomberClient } from '../../../api/clients';
import { getNomberDossier } from '../../../api/dossiers';
import { getNomberEtat } from '../../../api/etats';
const { Title } = Typography;


function DisplayNumbers(props) {

    const [loading, setLoading] = useState(false)
    const [nombreClients, setNombreClients] = useState(0)
    const [nombreDossiers, setNombreDossiers] = useState(0)
    const [nombreEtats, setNombreEtats] = useState(0)

    useEffect(() => {
        setLoading(true)
        getClientsCount().then(res => {
            setNombreClients(res)
            getDossiersCount().then(res => {
                setNombreDossiers(res)
                getEtatsCount().then(res => {
                    setNombreEtats(res)
                    setLoading(false)
                })
            })
        })
    }, [])

    const getClientsCount = async () => {

        const x = await getNomberClient()
        //console.log(x)
        return x
    }
    const getDossiersCount = async () => {
        return await getNomberDossier()
    }
    const getEtatsCount = async () => {
        return await getNomberEtat()
    }
    return (

        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card loading={loading} bordered={true} className="numbers-card" style={{ backgroundColor: '#282c34' }}>
                        <div className="div-left" style={{ float: "right" }}>
                            <div className="circle" style={{ width: 100, height: 100, borderRadius: '50%', borderStyle: 'solid', borderColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }} >
                                <Title level={2} style={{ color: "white" }} >
                                    {nombreClients}
                                </Title>
                            </div>
                        </div>
                        <div className="numbers-card-div-right" style={{ textAlign: "center", float: "left" }} >
                            <Avatar size={100} style={{ backgroundColor: "#282c34", marginTop: -20 }} icon={<UserOutlined />} />
                            <Title level={5} style={{ color: "white" }} >
                                Nombre de clients
                            </Title>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card loading={loading} bordered={true} className="numbers-card" style={{ backgroundColor: '#282c34' }}>
                        <div className="div-left" style={{ float: "right" }}>
                            <div className="circle" style={{ width: 100, height: 100, borderRadius: '50%', borderStyle: 'solid', borderColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }} >
                                <Title level={2} style={{ color: "white" }} >
                                    {nombreDossiers}
                                </Title>
                            </div>
                        </div>
                        <div className="numbers-card-div-right" style={{ textAlign: "center", float: "left" }} >
                            <Avatar size={100} style={{ backgroundColor: "#282c34", marginTop: -20 }} icon={<FolderOpenOutlined />} />
                            <Title level={5} style={{ color: "white" }} >
                                Nombre de dossiers
                            </Title>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card loading={loading} bordered={true} className="numbers-card" style={{ backgroundColor: '#282c34' }}>
                        <div className="div-left" style={{ float: "right" }}>
                            <div className="circle" style={{ width: 100, height: 100, borderRadius: '50%', borderStyle: 'solid', borderColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }} >
                                <Title level={2} style={{ color: "white" }} >
                                    {nombreEtats}
                                </Title>
                            </div>
                        </div>
                        <div className="numbers-card-div-right" style={{ textAlign: "center", float: "left" }} >
                            <Avatar size={100} style={{ backgroundColor: "#282c34", marginTop: -20 }} icon={<CheckCircleOutlined />} />
                            <Title level={5} style={{ color: "white" }} >
                                Nombre d'états
                            </Title>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>

    );
}

export default DisplayNumbers;