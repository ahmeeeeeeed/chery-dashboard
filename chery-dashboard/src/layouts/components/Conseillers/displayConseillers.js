import { Table, Button, Space, Input, Popconfirm, message, Tooltip, Pagination } from 'antd';
import React from 'react';

import Highlighter from 'react-highlight-words';
import { SearchOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { listconseillers, deleteUser, getNomberConseillers } from '../../../api/conseillers';
import { getDateExact, getConnectedUser } from '../../../helpers/userdata';
import AddConseiller from './addConseiller';
import ModifyConseiller from './modifyConseiller';

import './conseiller.css'

/* const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];
 */
class DisplayConseillers extends React.Component {
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
    loading: false,
    openModifyModal: false,
    conseillersData: {}

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

    await listconseillers(params.pagination.pageSize, params.pagination.pageSize * (params.pagination.current - 1)).then(async (res) => {
      this.setState({
        loading: false,
        data: res,
        pagination: {
          ...params.pagination,
          total: await getNomberConseillers(),
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    }).catch(err => {
      console.log(err)
      this.setState({ loading: false })
    })
  }
  closeModal = () => {
    this.setState({ openModifyModal: false })
  }
  render() {
    let { sortedInfo,
      filteredInfo,
      loading,
      pagination,
      data,
      openModifyModal
    } = this.state;

    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: "Nom d'utilisateur",
        dataIndex: 'username',
        key: 'username',
        width: '30%',

        sorter: (a, b) => a.username.localeCompare(b.username),
        sortOrder: sortedInfo.columnKey === 'username' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('username'),

      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '30%',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
        sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('email'),
      },
      /*  {
         title: 'Liste des priviléges',
         dataIndex: 'grants',
         key: 'grants',
         render: (text, record) => (
           <> {record.grants.length === 0 ? (
             <> Tous <CheckCircleOutlined style={{ color: 'green', fontSize: '20px', }} /> </>
           ) : (
               <> {record.grants.map((value, index) => (
                 <>{value}, </>
               ))} </>
             )
 
           }
           </>
         ),
       }, */
      {
        title: "Date d'ajout",
        dataIndex: 'created_at',
        width: '15%',
        key: 'created_at',
        /* sorter: (a, b) => a.created_at.length - b.created_at.length,
        sortOrder: sortedInfo.columnKey === 'created_at' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('created_at'), */
        render: (text, record) => (
          <> {getDateExact(record.created_at)} </>
        ),
      },
      {
        title: "Date de supprission",
        dataIndex: 'deleted_at',
        width: '15%',
        key: 'deleted_at',
        render: (text, record) => (
          <> {record.deleted_at === null ? (
            <Tooltip title="Cet agent est disponible" >
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
        title: "Actions",
        width: '10%',
        dataIndex: 'address',
        render: (text, record) => (<>
          {/* <Space size="middle"> */}

          <Button key={record._id} type="link" style={{ color: 'green' }} onClick={(e) => {
            this.setState({ openModifyModal: true, conseillersData: record })
          }} >
            Modifier
          </Button>
          <br />
          <Popconfirm title="Are you sure？" onConfirm={async () => {
            message.loading('Action in progress..', 2).then(async () => {

              await deleteUser(record._id).then((res) => {
                //console.log("at delete function : " + res)
                this.fetch({ pagination: this.state.pagination }).then(() => message.success('Agent supprimé !'))

              })
            })
          }}
            okText="Yes" cancelText="No">


            {record.deleted_at === null ? (
              <Button type="link" style={{ color: 'red' }} >

                Supprimer
              </Button>
            ) : (
                <Button type="link" style={{ color: 'blue' }} >

                  + Rajouter
              </Button>
              )
            }


          </Popconfirm>
          {/*  </Space> */}
        </>),

      }

    ];
    return (
      <>
        {openModifyModal && <ModifyConseiller data={this.state.conseillersData}
          modalState={this.closeModal}
          refreshAfterUpdateConseiller={() => this.fetch({ pagination: this.state.pagination })}
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
        {this.state.loading == false && <AddConseiller refreshAfterAddConseiller={() => this.fetch({ pagination: this.state.pagination })} />}

      </>

    );
  }
}
export default DisplayConseillers;