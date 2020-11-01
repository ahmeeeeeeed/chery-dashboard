import { Card, Avatar, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { getEtatById } from '../../../../api/etats';
import Details from '../../Clients/Details';
import { getClient } from '../../../../api/clients';
import allActions from '../../../../redux/actionsStore';
import { useDispatch } from 'react-redux';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';


const { Meta } = Card;

function DossierClient({ client }) {
    const [etatsDossiersClient, setEtatsDossiersClient] = useState([])
    const [openDetailsDrawer, setOpenDetailsDrawer] = useState(false)
    const [loading, setLoading] = useState(false)
    const [refreshedClient, setRefreshedClient] = useState(client)


    const getListEtats = async (tab) => {

        //  this.setState({ loading: true })
        setLoading(true)
        let etats = []
        for (let index = 0; index < tab.length; index++) {
            await getEtatById(tab[index].etat_actuel.etatId).then(res => {
                etats.push(res.nom)

            })
        }
        //console.log(etats)
        // this.setState({ etatsDossiersClient: etats, loading: false })
        setEtatsDossiersClient(etats)
        setLoading(false)
    }

    const closeDetailsDrawer = () => {
        // this.setState({ openDetailsDrawer: false })
        setOpenDetailsDrawer(false)
    }

    const refresh = async () => {
        setLoading(true)
        return await getClient(client._id).then(res => {
            //  console.log({ client: res })
            setRefreshedClient(res)
            setLoading(false)
        })
    }

    return (<>

        {openDetailsDrawer && etatsDossiersClient.length > 0 &&
            <Details etats={etatsDossiersClient}
                data={refreshedClient}
                detailsDrawerState={closeDetailsDrawer} />}
        <Card
            bordered loading={loading}
            style={{ width: 400, textAlign: "center", marginRight: 20 }}
            cover={
                <Avatar style={{ top: '50%', left: '50%', transform: 'translate(-50%, 10%)' }} size={100} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            actions={[
                <Button disabled={loading} style={{ color: 'green' }} type="link" block onClick={() => {
                    //this.setState({ openDetailsDrawer: true, clientData: record })
                    // console.log("clicked !")

                    refresh().then((res) => {
                        //console.log(res)
                        getListEtats(refreshedClient.dossiers)
                        //console.log(etatsDossiersClient)
                        setOpenDetailsDrawer(true)
                    })
                }} >
                    Détails
                </Button>
            ]}
        >
            <Meta style={{ padding: 16 }}
                // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={`Client : ${client.nom + ' ' + client.prenom}`}
                description={<b>
                    <p>CIN : {client.CIN}</p>
                    <p>email : {client.email}</p>
                    {client.VIP === "oui" ? (
                        <p>VIP : {client.VIP}  <CheckCircleOutlined style={{ color: 'green', fontSize: '20px', }} /></p>
                    ) : (
                            <p>VIP : {client.VIP}  <StopOutlined style={{ color: 'red', fontSize: '20px', }} /></p>
                        )
                    }
                </b>}
            />
        </Card>
    </>);
}

export default DossierClient;