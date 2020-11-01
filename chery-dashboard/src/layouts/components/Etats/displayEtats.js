import React from "react"
import { Table, Button, Popconfirm, message, Space, Modal, Input } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined, CheckCircleOutlined, StopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';


import { listEtats, changerOrdreEtat, deleteEtat } from '../../../api/etats'
import './etats.css'
import { getDateExact, getConnectedUser } from "../../../helpers/userdata";
import AddEtat from "./addEtat";
import ModifyEtat from "./modifyEtat";
import { any } from "prop-types";
const { confirm } = Modal;
const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));
/* const columnss = [
    {
        title: 'Sort',
        dataIndex: 'sort',
        width: 30,
        className: 'drag-visible',
        render: () => <DragHandle />,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        className: 'drag-visible',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
]; */


/* const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        index: 0,
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        index: 1,
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        index: 2,
    },
]; */

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class DisplayEtats extends React.Component {
    state = {
        dataSource: [],
        loading: false,
        loadingEtatButton: false,
        ordreHasChanged: false,
        openModifyModal: false,
        etatData: {},
    };

    componentDidMount() {
        this.fetch();

    }
    /*********************************************draggble************************************************ */
    onSortEnd = ({ oldIndex, newIndex }) => {
        const { dataSource } = this.state;
        //console.log("oldIndex : " + oldIndex)
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
            console.log('Sorted items: ', newData);
            this.setState({ dataSource: newData, ordreHasChanged: true });
        }
    };

    DraggableBodyRow = ({ className, style, ...restProps }) => {
        const { dataSource } = this.state;
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
        //console.log("index : " + index)
        return <SortableItem index={index} {...restProps} />;
    };
    fetch = async () => {
        this.setState({ loading: true });

        await listEtats().then(res => {
            const result = this.loadTableData(res)
            //console.log(res);

            this.setState({
                loading: false,
                dataSource: result,
            });
        }).catch(err => {
            console.log(err)
            this.setState({ loading: false })
        })

    };
    loadTableData = (etatsData) => {
        const tab = []
        etatsData.forEach(element => {
            // console.log(Object.keys(element.signes[0])[0])
            tab.push({
                nom: element.nom,
                titre: element.titre,
                ordre: element.ordre,
                signes: element.signes.length == 1 ? Object.keys(element.signes[0])[0] : Object.keys(element.signes[0]) + ", " + Object.keys(element.signes[1]),
                created_at: element.created_at,
                index: element.ordre,
                fullEtat: element
            })
        });
        return tab
    }

    changeOrdre = async () => {
        //console.log(this.state.dataSource)
        await changerOrdreEtat(getConnectedUser(), this.state.dataSource).then(() => {
            this.fetch()
        })
    }
    closeModal = () => {
        this.setState({ openModifyModal: false })

    }
    showPropsConfirm = async (record, thiss) => {
        confirm({
            title: "Il y a des dossiers qui sont reliés par cet état",
            icon: <ExclamationCircleOutlined />,
            content: "Aprés la suppression, il faut changer l'état de ces dossier vers d'autres états actifs",
            okText: "D'accord",
            okType: 'danger',
            cancelText: 'Non',
            width: '35%',
            onOk() {
                console.log(thiss)
                return new Promise(async (resolve, reject) => {
                    await deleteEtat(record._id, getConnectedUser()).then((res) => {
                        resolve()
                        thiss.fetch()
                    })

                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {
                console.log('Cancel');
            },
        })

        //this.fetch()
    }
    /************************************************************************************************************* */
    render() {
        const { dataSource, loading, loadingEtatButton, ordreHasChanged, openModifyModal } = this.state;
        const DraggableContainer = props => (
            <SortableContainer
                useDragHandle
                helperClass="row-dragging"
                onSortEnd={this.onSortEnd}
                {...props}
            />
        );
        const columns = [
            {
                title: 'Sort',
                dataIndex: 'sort',
                width: 30,
                className: 'drag-visible',
                render: () => <DragHandle />,
            },
            {
                title: 'Ordre',
                width: '10%',
                dataIndex: 'ordre',
            },
            {
                title: 'Nom',
                dataIndex: 'nom',
                className: 'drag-visible',
                width: '20%'
            },
            {
                title: 'Titre',
                dataIndex: 'titre',
                width: '30%'
            },

            {
                title: 'Signes',
                width: '20%',
                dataIndex: 'signes',
                render: (text, record) => (
                    <>
                        {record.signes === "positif" ? (
                            <>Validé</>
                        ) : (<>
                            Validé, Réfusé
                        </>)
                        }
                    </>
                )
            },
            {
                title: 'Date de création',
                width: '20%',
                dataIndex: 'created_at',
                render: (text, record) => (
                    <> {getDateExact(record.created_at)} </>
                ),
            },
            {
                title: 'Actions',
                width: '20%',
                render: (text, record) => (
                    <><Space size="middle">
                        <a onClick={() => {
                            console.log(record.fullEtat)
                            this.setState({ openModifyModal: true, etatData: record.fullEtat })
                            // this.setState({ openDetailsDrawer: true, clientData: record })
                            //  this.getListEtats(record.dossiers)

                        }}
                        >Modifier</a>
                        <a style={{ color: 'red' }} onClick={() => {
                            this.showPropsConfirm(record.fullEtat, this)
                            //  this.fetch()

                        }} >
                            <>Supprimer</>
                        </a>
                    </Space>
                    </>
                ),
            }
        ];
        return (<>
            {openModifyModal && <ModifyEtat data={this.state.etatData}
                modalState={this.closeModal}
                refreshAfterUpdateEtat={() => this.fetch()}
            />}

            <Button style={{ marginBottom: 20, textAlign: "center" }} type="primary"
                onClick={() => {
                    this.setState({ ordreHasChanged: false, loading: true })
                    this.changeOrdre()
                }} disabled={!ordreHasChanged} loading={loadingEtatButton} >
                Enregistrer <CheckCircleOutlined style={{ fontSize: '16', }} />
            </Button>
            <Button style={{ marginBottom: 20, marginLeft: 20, textAlign: "center" }}
                onClick={() => {
                    this.setState({ ordreHasChanged: false })
                    this.fetch()
                }} disabled={!ordreHasChanged} loading={loadingEtatButton} >
                Annuler <StopOutlined style={{ fontSize: '16', }} />
            </Button>
            <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                rowKey="index"
                components={{
                    body: {
                        wrapper: DraggableContainer,
                        row: this.DraggableBodyRow,
                    },
                }}
            />
            {loading === false && <AddEtat listetats={dataSource} refreshAfterAddEtat={() => this.fetch()} />}

        </>);
    }
}

export default DisplayEtats