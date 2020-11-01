import { Table, Button, Space, Input, Popconfirm, message, Tooltip, List, Pagination } from 'antd';
import React from 'react';
import './etats.css'

import Highlighter from 'react-highlight-words';
import { SearchOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { listconseillers, deleteUser } from '../../../api/conseillers';
import { getDateExact, getConnectedUser } from '../../../helpers/userdata';
import { listEtatsSupprimes, getNomberEtatSupprimes } from '../../../api/etats';
import { getDossiersMemeEtat } from '../../../api/dossiers';
import ChangerEtat from '../Dossiers/DetailsDossier/changerEtat';
import { element } from 'prop-types';

class DisplayEtatsSupprimes extends React.Component {
    state = {
        filteredInfo: null,
        sortedInfo: null,
        searchText: '',
        searchedColumn: '',

        data: [],
        listDossiersInclues: [],
        pagination: {
            current: 1,
            pageSize: 5,
            total: 1,
        },
        loading: false,
        conseillersData: {},
        openChangeEtatModal: false,
        doss: {}

    };
    componentDidMount() {
        const { pagination } = this.state;
        this.fetch({ pagination });

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

    /***************************************sorting**************************************** */


    handleChange = (pagination, filters, sorter) => {
        //  console.log('Various parameters', pagination, filters, sorter);
        //console.log(sorter)
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
    /******************************************************************************************** */

    fetch = async (params = {}) => {
        this.setState({ loading: true });

        await listEtatsSupprimes(params.pagination.pageSize, params.pagination.pageSize * (params.pagination.current - 1)).then(res => {
            this.loadListDossiersInclues(res).then(async (ress) => {
                this.setState({
                    loading: false,
                    data: res,
                    listDossiersInclues: ress,
                    pagination: {
                        ...params.pagination,
                        total: await getNomberEtatSupprimes(),
                        // 200 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            }).catch(err => {
                console.log(err)
                this.setState({ loading: false })
            })

        }).catch(err => {
            console.log(err)
            this.setState({ loading: false })
        })
    }

    loadListDossiersInclues = async (etats) => {
        const tab = []
        // console.log(etats)
        for (let index = 0; index < etats.length; index++) {

            let tabdossier = await getDossiersMemeEtat(etats[index]._id)
            console.log(tabdossier)
            tab.push({
                etat: etats[index]._id,
                dossiers: tabdossier ? tabdossier : []
            })
        }

        return tab
    }
    closeModal = () => {
        this.setState({ openChangeEtatModal: false })

    }
    render() {
        let { sortedInfo,
            filteredInfo,
            loading,
            pagination,
            data,
            openChangeEtatModal,
            doss
        } = this.state;

        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const columns = [
            {
                title: "Nom",
                dataIndex: 'nom',
                key: 'nom',
                width: '15%',
                sorter: (a, b) => a.nom.localeCompare(b.nom),
                sortOrder: sortedInfo.columnKey === 'nom' && sortedInfo.order,
                ellipsis: true,
                ...this.getColumnSearchProps('nom'),

            },
            {
                title: 'Titre',
                dataIndex: 'titre',
                width: '15%',
                key: 'titre',
                sorter: (a, b) => a.titre.localeCompare(b.titre),
                sortOrder: sortedInfo.columnKey === 'titre' && sortedInfo.order,
                ellipsis: true,
                ...this.getColumnSearchProps('titre'),
            },
            {
                title: 'Date de suppression',
                dataIndex: 'deleted_at',
                width: '15%',
                key: 'deleted_at',
                render: (text, record) => (
                    <> {getDateExact(record.deleted_at)} </>
                ),
            },
            {
                title: "Liste des dossiers inclues",
                width: '55%',
                render: (text, record) => (
                    <>
                        {this.state.listDossiersInclues &&
                            this.state.listDossiersInclues.filter((value) => { return value.etat === record._id }).map((value, key) => (
                                <>
                                    {value.dossiers.length > 0 ? (
                                        <div className="list-container" key={key} >
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={value.dossiers}
                                                renderItem={(item) => (<>
                                                    <List.Item key={item._id}
                                                        actions={[<Button key="changer-etat" onClick={() => {
                                                            this.setState({ doss: item })
                                                            this.setState({ openChangeEtatModal: true })
                                                        }} >Changer l'état</Button>
                                                        ]}
                                                    >
                                                        <List.Item.Meta
                                                            style={{ float: "left", width: '20%' }}
                                                            title="Numéro du dossier"
                                                            description={item.num}
                                                        />
                                                        <List.Item.Meta
                                                            style={{ float: "left", width: '30%' }}
                                                            title="Signe d'état"
                                                            description={item.etat_actuel.signe === "positif" ? (
                                                                <>Validé <CheckCircleOutlined style={{ color: 'green', fontSize: '20px', }} /> </>
                                                            ) : (
                                                                    <>Réfusé <StopOutlined style={{ color: 'red', fontSize: '20px', }} /> </>
                                                                )}
                                                        />
                                                    </List.Item>


                                                </>)}
                                            />
                                        </div>) : (<>
                                            <Tooltip title="Pas de dossiers inclues" key={key} >
                                                <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
                                            </Tooltip>
                                        </>)
                                    }




                                </>
                            ))
                        }
                    </>
                ),
            },

        ];
        return (
            <>
                {openChangeEtatModal && doss && <ChangerEtat modalState={this.closeModal} dossier={doss}
                    refreshAfterChangingEtat={() => { this.fetch({ pagination: this.state.pagination }) }}
                />}
                <Table columns={columns}
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
            </>

        );
    }
}
export default DisplayEtatsSupprimes;