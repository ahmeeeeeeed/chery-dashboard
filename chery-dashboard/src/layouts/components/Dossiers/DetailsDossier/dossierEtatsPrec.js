import React, { useEffect, useState } from 'react';

import { Table, Tag, Space } from 'antd';
import { getEtatById } from '../../../../api/etats';
import { getDateExact } from '../../../../helpers/userdata';
import { getDossier } from '../../../../api/dossiers';


const columns = [
    {
        title: 'Nom',
        dataIndex: 'nom',
        width: "20%"
    },
    {
        title: 'Remarques',
        dataIndex: 'Remarques',

    },
    {
        title: "Date de changement d'état",
        dataIndex: 'update_at',

        width: "25%"
    }
];

/* const data = [
    {
        key: '1',
        name: 'John Brown',
        chinese: 98,
        math: 60,
        english: 70,
    },
    {
        key: '2',
        name: 'Jim Green',
        chinese: 98,
        math: 66,
        english: 89,
    },
    {
        key: '3',
        name: 'Joe Black',
        chinese: 98,
        math: 90,
        english: 70,
    },
    {
        key: '4',
        name: 'Jim Red',
        chinese: 88,
        math: 99,
        english: 89,
    },
]; */
function DossierEtatsPrec(props) {

    const [dossier, setDossier] = useState(props.dossier)
    const [loading, setLoading] = useState([])
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        setLoading(true)

        getDoss(dossier._id).then((result) => {
            //  console.log(result)
            setDossier(result)
            //  console.log(dossier.etats_prec.length)
            //  console.log(result.etats_prec.length)
            getListEtats(result.etats_prec).then((res) => {
                // console.log(res)
                loadTableData(res, result)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })


    }, [])
    const getDoss = async (id) => {
        return await getDossier(id)
    }
    const getListEtats = async (etats_prec) => {


        let etats = []
        for (let index = 0; index < etats_prec.length; index++) {
            await getEtatById(etats_prec[index].etat).then(res => {
                etats.push(res)
            })
        }
        return etats

    }
    const loadTableData = (etats, dossier) => {

        const data = []
        etats.forEach((element, index) => {
            data.push({
                key: index + 1,
                nom: element.nom,
                Remarques: dossier.etats_prec[index].remarques,
                update_at: getDateExact(dossier.etats_prec[index].updated_at)
            })

        });
        data.reverse()
        setTableData(data)
    }
    return (<>{/* {dossier.etats_prec.length} */}
        <Table columns={columns} dataSource={tableData} loading={loading} />
    </>);
}

export default DossierEtatsPrec;