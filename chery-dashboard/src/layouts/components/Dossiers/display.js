import React from 'react'
import { Table, Button, Space, Input, Popconfirm, message, Tooltip, Select, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { clients, getClient } from '../../../api/clients';
import { getDateExact, getConnectedUser } from '../../../helpers/userdata';
import { listDossiers, deleteDossier, getNomberDossier } from '../../../api/dossiers';
import AddDossier from './addDossier';
import { Link } from 'react-router-dom';
import { paths } from '../../../config/constants';
import history from '../../../services/history';
import TextArea from 'antd/lib/input/TextArea';
import ModifyDossier from './modifyDossier';
import ChangerEtat from './DetailsDossier/changerEtat';

const { Option } = Select;
/* const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
    });
} */

class Display extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        filteredInfo: null,
        sortedInfo: null,
        searchText: '',
        searchedColumn: '',

        data: [],
        pagination: {
            current: 1,
            pageSize: 5,
            total: 1,
        },
        loading: false,
        openModifyModal: false,
        dossierData: {},

        loadingEtatButton: false,
        openChangeEtatModal: false
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    componentDidMount() {
        const { pagination } = this.state;
        this.fetch({ pagination });
        //console.log(pagination)
        // this.setState({openModifyModal  : false})
    }
    handleTableChange = (paginations, filters, sorter) => {
        //console.log(pagination)
        let pagination = { current: this.state.pagination.current, pageSize: this.state.pagination.pageSize }

        if (pagination.current != this.state.pagination.current || pagination.pageSize != this.state.pagination.pageSize)
            this.fetch({
                sortField: sorter.field,
                sortOrder: sorter.order,
                pagination,
                ...filters,
            });
        // console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    handleChangePagination = (pageNumber, pageSize) => {
        // console.log('pageNumber: ', pageNumber);
        // console.log('pageSize: ', pageSize);

        if (pageNumber != this.state.pagination.current || pageSize != this.state.pagination.pageSize) {
            let pagination = { current: pageNumber, pageSize: pageSize }
            this.fetch({ pagination });

        }
    }

    /******************************************pagination*********************************************** */

    fetch = async (params = {}) => {
        this.setState({ selectedRowKeys: [] })
        // console.log(params)
        this.setState({ loading: true });
        //console.log(this.props.getClients())
        //console.log(this.props.listclients)

        await listDossiers(params.pagination.pageSize, params.pagination.pageSize * (params.pagination.current - 1)).then(async (res) => {
            const result = this.loadTableData(res)
            //console.log(result)

            this.setState({
                loading: false,
                data: result,
                pagination: {
                    ...params.pagination,
                    total: await getNomberDossier(),
                    // 200 is mock data, you should read it from server
                    // total: data.totalCount,
                },
            });
        }).catch(err => {
            console.log(err)
            this.setState({ loading: false })
        })

    };

    loadTableData = (historiqueData) => {
        const tab = []
        historiqueData.forEach(element => {
            //console.log(element)
            tab.push({
                _id: element._id,
                num: element.num,
                nom_prenom: element.client ? element.client.nom + " " + element.client.prenom : null,
                etat_actuel: element.etat_actuel ? element.etat_actuel.etatId.nom : null,
                signe: element.etat_actuel ? element.etat_actuel.signe : null,
                deleted_at: element.deleted_at ? getDateExact(element.deleted_at) : null,
                remarques: element.Remarques,
                full_dossier: element
            })
        });
        return tab
    }

    /***************************************sorting**************************************** */


    handleChange = (pagination, filters, sorter) => {
        //console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };


    /***************************************searching**************************************** */
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
          </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
          </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                    text
                ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    goToDossierDetails = async (dossier, client) => {
        //if (dossier == null)
        const fullClient = await getClient(client._id)
        history.push(paths.DASHBOARD, { dossier: dossier, client: fullClient, component: paths.DOSSIER_DETAILS })
    }


    closeModal = () => {
        this.setState({ openModifyModal: false })
        this.setState({ openChangeEtatModal: false })

    }

    /********************************************************************************************* */
    render() {
        const { data,
            pagination,
            loading,
            selectedRowKeys,
            openModifyModal,
            loadingEtatButton,
            openChangeEtatModal
        } = this.state;

        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};

        /* const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                ...this.getColumnSearchProps('name'),

            },
            {
                title: 'Age',
                dataIndex: 'age',
                ...this.getColumnSearchProps('nom'),

            },
            {
                title: 'Address',
                dataIndex: 'address',
                ...this.getColumnSearchProps('nom'),

            },
        ];
 */

        const columns = [
            {
                title: 'Numéro',
                dataIndex: 'num',
                width: '10%',
                key: 'num',
                sorter: (a, b) => a.num - b.num,
                sortOrder: sortedInfo.columnKey === 'num' && sortedInfo.order,
                ellipsis: true,
                ...this.getColumnSearchProps('num'),
            },
            {
                title: 'Client',
                dataIndex: 'nom_prenom',
                width: '15%',
                key: 'nom_prenom',
                sorter: (a, b) => a.nom_prenom.localeCompare(b.nom_prenom),
                sortOrder: sortedInfo.columnKey === 'nom_prenom' && sortedInfo.order,
                ellipsis: true,
                ...this.getColumnSearchProps('nom_prenom'),

            },
            {
                title: 'Etat actuel',
                dataIndex: 'etat_actuel',
                width: '15%',
                key: 'etat_actuel',
                sorter: (a, b) => a.etat_actuel.localeCompare(b.etat_actuel),
                sortOrder: sortedInfo.columnKey === 'etat_actuel' && sortedInfo.order,
                ellipsis: true,
                ...this.getColumnSearchProps('etat_actuel'),
                render: (text, record) => (
                    <> {record.etat_actuel === null ? (
                        <Tooltip title="Ce dossier est disponible" >
                            <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
                        </Tooltip>
                    ) : (
                            <> {record.etat_actuel} </>
                        )

                    }
                    </>
                ),
            },
            ,
            {
                title: 'Signe',
                dataIndex: 'signe',
                key: 'signe',
                width: '10%',
                render: (text, record) => (
                    <> {record.signe === null ? (
                        <Tooltip title="Ce dossier est disponible" >
                            <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
                        </Tooltip>
                    ) : (
                            <>
                                {record.signe === "positif" ? (
                                    <>Validé <CheckCircleOutlined style={{ color: 'green', fontSize: '20px', }} /> </>
                                ) : (
                                        <>Réfusé <StopOutlined style={{ color: 'red', fontSize: '20px', }} /> </>
                                    )}
                            </>
                        )

                    }
                    </>
                ),
            },
            {
                title: 'Description',
                dataIndex: 'remarques',
                width: '20%',
                key: 'remarques',
                ellipsis: true,
                ...this.getColumnSearchProps('remarques'),
            },
            {
                title: 'Date de suppression',
                dataIndex: 'deleted_at',
                key: 'deleted_at',
                width: '10%',
                render: (text, record) => (
                    <> {record.deleted_at === null ? (
                        <Tooltip title="Ce client est disponible" >
                            <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
                        </Tooltip>
                    ) : (
                            <> {record.deleted_at} </>
                        )

                    }
                    </>
                ),
            },
            {
                title: 'Actions',
                key: 'actions',
                width: "10%",
                render: (text, record) => (<>
                    {/* <Space size="middle"> */}
                    <Button type="link" onClick={() => {
                        //console.log(record.full_dossier.client);
                        this.goToDossierDetails(record.full_dossier, record.full_dossier.client);
                    }} >
                        Détails
                    </Button>
                    <br />
                    <Button key={record._id} type="link" style={{ color: 'green' }} onClick={(e) => {
                        this.setState({ openModifyModal: true, dossierData: record })
                    }} >
                        Modifier
                    </Button>
                    <br />
                    <Popconfirm title="Are you sure？" onConfirm={async () => {
                        message.loading('Action in progress..', 2).then(async () => {

                            await deleteDossier(record._id, getConnectedUser()).then((res) => {
                                //console.log("at delete function : " + res)
                                this.fetch({ pagination: this.state.pagination }).then(() => message.success('Dossier supprimé !'))

                            })
                        })
                    }}
                        okText="Yes" cancelText="No">
                        <Button type="link" style={{ color: 'red' }} >

                            {record.deleted_at === null && <>Supprimer</>}
                        </Button>
                    </Popconfirm>
                    {/*  </Space> */}
                </>),
            },

        ];
        //const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            /*  selections: [
                 Table.SELECTION_ALL,
                 Table.SELECTION_INVERT,
                 {
                     key: 'odd',
                     text: 'Select Odd Row',
                     onSelect: changableRowKeys => {
                         let newSelectedRowKeys = [];
                         newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                             if (index % 2 !== 0) {
                                 return false;
                             }
                             return true;
                         });
                         this.setState({ selectedRowKeys: newSelectedRowKeys });
                     },
                 },
                 {
                     key: 'even',
                     text: 'Select Even Row',
                     onSelect: changableRowKeys => {
                         let newSelectedRowKeys = [];
                         newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                             if (index % 2 !== 0) {
                                 return true;
                             }
                             return false;
                         });
                         this.setState({ selectedRowKeys: newSelectedRowKeys });
                     },
                 },
             ], */
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (<>
            {openModifyModal && <ModifyDossier data={this.state.dossierData}
                modalState={this.closeModal}
                refreshAfterUpdateDossier={() => this.fetch({ pagination: this.state.pagination })}
            />}

            {openChangeEtatModal && <ChangerEtat modalState={this.closeModal} listeDossier={selectedRowKeys}
                refreshAfterChangingEtat={() => { this.fetch({ pagination: this.state.pagination }) }}
            />}

            <Button style={{ marginBottom: 20, textAlign: "center" }} type="primary"
                onClick={() => {
                    this.setState({ loadingEtatButton: true })
                    this.setState({ openChangeEtatModal: true })
                    this.setState({ loadingEtatButton: false })
                }} disabled={!hasSelected} loading={loadingEtatButton}>
                Changer d'état  <CheckCircleOutlined style={{ fontSize: '16', }} />
            </Button>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                rowKey={record => record._id}
                dataSource={data}
                pagination={false}
                loading={loading}
                onChange={this.handleTableChange}
            />
            <Pagination
                style={{ display: 'flex', justifyContent: "flex-end" }}
                disabled={loading}
                defaultCurrent={pagination.current}
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onChange={(pageNumber, pageSize) => this.handleChangePagination(pageNumber, pageSize)}
            />
            {this.state.loading == false && <AddDossier listdossiers={data} refreshAfterAddDossier={() => this.fetch({ pagination: this.state.pagination })} />}

        </>);
    }
}
export default Display;