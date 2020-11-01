import { Table, Button, Space, Input, Popconfirm, message, Tooltip, Pagination } from 'antd';
import React from 'react'

import Highlighter from 'react-highlight-words';
import { SearchOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';

import { clients, deleteClient, deleteDeffClient, getNomberClient } from '../../../api/clients'
import { getEtatById } from '../../../api/etats'

import ModifyClient from './modifyClient'
import Details from './Details'
import { connect } from 'react-redux';
import { getConnectedUser, getDateExact } from '../../../helpers/userdata';
import AddClient from './addClient'

import './display.css'


class Display extends React.Component {
  state = {
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

    //current: 2,
    loading: false,

    openModifyModal: false,
    openDetailsDrawer: false,
    clientData: {},
    etatsDossiersClient: []
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
    //console.log(pagination)
    // this.setState({openModifyModal  : false})
  }

  handleTableChange = (paginations, filters, sorter) => {
    let pagination = { current: this.state.pagination.current, pageSize: this.state.pagination.pageSize }
    //console.log(pagination)

    if (pagination.current != this.state.pagination.current || pagination.pageSize != this.state.pagination.pageSize)
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
      });
    console.log('Various parameters', pagination, filters, sorter);
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
    //console.log(params)
    this.setState({ loading: true/* , total: await getNomberClient()  */ });
    //console.log(this.props.getClients())
    //console.log(this.props)


    await clients(params.pagination.pageSize, params.pagination.pageSize * (params.pagination.current - 1)).then(async (res) => {

      // let nbr = await getNomberClient()
      this.setState({
        loading: false,
        data: res,
        pagination: {
          ...params.pagination,
          total: await getNomberClient(),
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    }).catch(err => {
      console.log(err)
      this.setState({ loading: false })
    })

  };

  /***************************************sorting**************************************** */


  handleChange = (pagination, filters, sorter) => {
    //console.log('Various parameters', pagination, filters, sorter);
    console.log(pagination);

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
  /************************************************************************************************** */
  closeModal = () => {
    this.setState({ openModifyModal: false })
  }
  closeDetailsDrawer = () => {
    this.setState({ openDetailsDrawer: false })
  }


  getListEtats = async (tab) => {
    this.setState({ loading: true })
    let etats = []
    for (let index = 0; index < tab.length; index++) {
      await getEtatById(tab[index].etat_actuel.etatId).then(res => {
        etats.push(res.nom)

      })
    }
    //console.log(etats)
    this.setState({ etatsDossiersClient: etats, loading: false })
  }

  refresh() {
    console.log("in refresh")
    /*  this.fetch({ pagination: this.state.pagination })
       .then(() => console.log("fetch finished"))
       .catch((e) => console.log(e)) */
  }


  render() {
    const { data, pagination, loading, openModifyModal, openDetailsDrawer, etatsDossiersClient } = this.state;


    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    //console.log(sortedInfo)

    const columns = [
      {
        title: 'Nom',
        dataIndex: 'nom',
        width: '15%',
        key: 'nom',
        sorter: (a, b) => a.nom.localeCompare(b.nom),
        sortOrder: sortedInfo.columnKey === 'nom' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('nom'),
      },
      {
        title: 'Prénom',
        dataIndex: 'prenom',
        width: '10%',
        key: 'prenom',
        sorter: (a, b) => a.prenom.localeCompare(b.prenom),
        sortOrder: sortedInfo.columnKey === 'prenom' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('prenom'),
      },
      {
        title: 'CIN',
        dataIndex: 'CIN',
        width: '10%',
        key: 'CIN',
        sorter: (a, b) => a.CIN - b.CIN,
        sortOrder: sortedInfo.columnKey === 'CIN' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('CIN'),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '25%',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
        sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('email'),
      },
      {
        title: 'Date de suppression',
        dataIndex: 'deleted_at',
        width: '15%',
        key: 'deleted_at',

        render: (text, record) => (
          <> {record.deleted_at === null ? (
            <Tooltip title="Ce client est disponible" >
              <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
            </Tooltip>
          ) : (
              <> {getDateExact(record.deleted_at)} </>
            )

          }
          </>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '25%',

        render: (text, record) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <a onClick={() => {

              this.setState({ openDetailsDrawer: true, clientData: record })
              this.getListEtats(record.dossiers)

            }}
              style={{ color: 'green' }} >Détails</a>
            <a onClick={() => { this.setState({ openModifyModal: true, clientData: record }) }}>Modifier</a>

            <Popconfirm title="Are you sure？" onConfirm={async () => {
              message.loading('Action in progress..', 2).then(async () => {
                console.log(record._id)

                await deleteClient(record._id, getConnectedUser()).then((res) => {
                  //console.log("at delete function : " + res)
                  this.fetch({ pagination: this.state.pagination }).then(() => message.success('Client supprimé !'))

                })
              })
            }}
              okText="Yes" cancelText="No">
              <a style={{ color: 'red' }} >

                {record.deleted_at === null ? (
                  <>Supprimer</>
                ) : (
                    <> Rajouter </>
                  )
                }
              </a>
            </Popconfirm>

            <Popconfirm title="Are you sure？" onConfirm={async () => {
              message.loading('Action in progress..', 2).then(async () => {

                await deleteDeffClient(record._id, getConnectedUser()).then((res) => {
                  //console.log("at delete function : " + res)
                  this.fetch({ pagination: this.state.pagination }).then(() => message.success('Client supprimé définitivement !'))

                })
              })
            }}
              okText="Yes" cancelText="No">
              <Tooltip title="Supprimer définitivement" placement="bottom" >
                <Button className="supp-deff-button" danger shape="circle" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </div>
        ),
      },
    ];



    return (
      <>

        {openModifyModal && <ModifyClient data={this.state.clientData}
          listclients={data}
          modalState={this.closeModal}
          refreshAfterUpdateClient={() => this.fetch({ pagination: this.state.pagination })}
        />}

        {openDetailsDrawer && //etatsDossiersClient.length > 0 &&
          <Details etats={etatsDossiersClient}
            data={this.state.clientData}
            detailsDrawerState={this.closeDetailsDrawer} props={this.props} />}


        <Table
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

        {this.state.loading == false && <AddClient listclients={data} refreshAfterAddClient={() => this.fetch({ pagination: this.state.pagination })} />}

        {/*  <Table columns={columns} dataSource={data} onChange={this.handleChange} /> */}
      </>);
  }
}

function mapStateToProps(state) {
  return {
    listclients: state.clients,
    load: state.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getClients: () => { dispatch({ type: 'GET_CLIENTS' }) }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Display)