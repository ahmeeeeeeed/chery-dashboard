import React, { useState, useEffect } from 'react';
import { getDossiersInfoParEtat } from '../../../api/dossiers';
import { Col, Row, Card } from 'antd';
import { FolderOpenOutlined, CheckCircleOutlined, CloseCircleTwoTone, setTwoToneColor } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';

//setTwoToneColor('red');
function NombreDossiersEtat(props) {

    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState()

    useEffect(() => {
        setLoading(true)
        getStats().then(res => {
            setStats(res)
            //console.log(res);

            setLoading(false)
        })
    }, [])

    const getStats = async () => {
        return await getDossiersInfoParEtat()
    }

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>

                {stats && stats.map((value, index) => (
                    <Col span={8} key={index} >
                        <Card loading={loading} title={`${index + 1}- ${value.etat}`} bordered={true} hoverable
                            style={{ marginBottom: 12, textAlign: "center", borderWidth: 5, borderColor: "#dddcdc" }} >
                            <div style={{ float: "left", textAlign: "left" }}>
                                <Title level={5}  >
                                    <FolderOpenOutlined style={{ color: 'cadetblue', fontSize: '30px', }} /> Nombre de dossiers
                                </Title><br />
                                <Title level={5}  >
                                    <CheckCircleOutlined style={{ color: 'green', fontSize: '30px', }} /> Dossiers validés
                                </Title><br />
                                <Title level={5} >
                                    <CloseCircleTwoTone style={{ color: 'red', fontSize: '30px', }} /> Dossiers Réfusés
                                </Title>
                            </div>
                            <div style={{ float: "right", textAlign: "right" }}>
                                <Title level={4}  >
                                    {value.stat.nbr_dossiers_total}
                                </Title><br />
                                <Title level={4}  >
                                    {value.stat.dossiers_valide}
                                </Title><br />
                                <Title level={4}  >
                                    {value.stat.dossiers_refuse}
                                </Title>

                            </div>



                            {/* <DescriptionItem title="nbr_dossiers_total" content={value.stat.nbr_dossiers_total} /><br />
                            <DescriptionItem title="dossiers_valide" content={value.stat.dossiers_valide} />
                            <DescriptionItem title="dossiers_refuse" content={value.stat.dossiers_refuse} /> */}
                        </Card>
                    </Col>

                ))}

            </Row>
        </div>

    )
}

export default NombreDossiersEtat;