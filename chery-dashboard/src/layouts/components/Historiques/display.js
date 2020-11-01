import { Table, Button, Space, Input, Tooltip, Pagination } from 'antd';
import React from 'react'

import Highlighter from 'react-highlight-words';
import { SearchOutlined, StopOutlined } from '@ant-design/icons';

import { clients } from '../../../api/clients'
import { getAllHistory, getNombreHistory } from '../../../api/historiques';
import { getDateExact } from '../../../helpers/userdata';



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
    loading: false,
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
    //console.log(pagination)
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
  /* fetch = async(params = {}) => {
    // console.log(params)
   this.setState({ loading: true });

   await clients().then(res=> {
      // console.log(res)
       this.setState({
        loading: false,
        data: res,
        pagination: {
          ...params.pagination,
          total: res.length,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
   })
   
 }; */

  /***************************************sorting**************************************** */


  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
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

  /*********************************************************************************************************** */
  fetch = async (params = {}) => {

    this.setState({ loading: true });
    await getAllHistory(params.pagination.pageSize, params.pagination.pageSize * (params.pagination.current - 1)).then(async (res) => {

      const result = this.loadTableData(res)
      this.setState({
        loading: false,
        data: result,
        pagination: {
          ...params.pagination,
          total: await getNombreHistory(),
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    })

  };

  loadTableData = (historiqueData) => {
    const tab = []
    historiqueData.forEach(element => {
      tab.push({
        _id: element._id,
        nom_prenom: element.client ? element.client.nom + " " + element.client.prenom : null,
        dossier: element.dossier ? element.dossier.num : null,
        etat: element.etat ? element.etat.nom : null,
        desc: element.desc,
        user: element.user ? element.user.role + " : " + element.user.username : null,
        created_at: getDateExact(element.created_at)
      })
    });
    return tab
  }


  render() {
    const { data, pagination, loading } = this.state;


    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    //console.log(sortedInfo)

    const columnss = [
      {
        title: 'Client',
        dataIndex: 'nom_prenom',
        key: 'nom_prenom',
        width: '10%',
        sorter: (a, b) => a.nom_prenom.localeCompare(b.nom_prenom),
        sortOrder: sortedInfo.columnKey === 'nom_prenom' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('nom_prenom'),
        render: (text, record) => (
          <>
            {record.nom_prenom === null ? (<Tooltip title="Cet infromation ne concerne pas les clients" >
              <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
            </Tooltip>) : (<>
              {record.nom_prenom}
            </>)
            }
          </>
        )
      },
      {
        title: 'Numéro dossier',
        dataIndex: 'dossier',
        sorter: true,
        width: '10%',
        key: 'dossier',
        sorter: (a, b) => a.dossier - b.dossier,
        sortOrder: sortedInfo.columnKey === 'dossier' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('dossier'),
        render: (text, record) => (
          <>
            {record.dossier === null ? (<Tooltip title="Cet infromation ne concerne pas les dossiers" >
              <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
            </Tooltip>) : (
                <>
                  {record.dossier}
                </>
              )
            }
          </>
        )
      },
      {
        title: 'Etat',
        dataIndex: 'etat',
        sorter: true,
        key: 'etat',
        width: '20%',
        sorter: (a, b) => a.etat.localeCompare(b.etat),
        sortOrder: sortedInfo.columnKey === 'etat' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('etat'),
        render: (text, record) => (
          <>
            {record.etat === null ? (<Tooltip title="Cet infromation ne concerne pas les états" >
              <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
            </Tooltip>) : (<>
              {record.etat}
            </>)
            }
          </>
        )
      },
      {
        title: 'Description',
        dataIndex: 'desc',
        sorter: true,
        key: 'desc',
        width: '30%',
        sorter: (a, b) => a.desc.localeCompare(b.desc),
        sortOrder: sortedInfo.columnKey === 'desc' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('desc'),
      },
      {
        title: 'Agent',
        dataIndex: 'user',
        sorter: true,
        key: 'user',
        width: '15%',
        sorter: (a, b) => a.user.localeCompare(b.user),
        sortOrder: sortedInfo.columnKey === 'user' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('user'),
        render: (text, record) => (
          <>
            {record.user === null ? (<Tooltip title="Cet infromation ne concerne pas les conseillers clients" >
              <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
            </Tooltip>) : (<>
              {record.user}
            </>)
            }
          </>
        )
      },
      {
        title: 'Date de création',
        dataIndex: 'created_at',
        width: '15%',
      },

    ];
    const columns = [
      {
        title: 'Nom',
        dataIndex: 'nom',
        width: '20%',
        key: 'nom',
        sorter: (a, b) => a.nom.length - b.nom.length,
        sortOrder: sortedInfo.columnKey === 'nom' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('nom'),
      },
      {
        title: 'CIN',
        dataIndex: 'CIN',
        width: '20%',
        key: 'CIN',
        sorter: (a, b) => a.CIN - b.CIN,
        sortOrder: sortedInfo.columnKey === 'CIN' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('CIN'),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.length - b.email.length,
        sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('email'),
      },
    ];



    return (<>
      <Table
        columns={columnss}
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

      {/*  <Table columns={columns} dataSource={data} onChange={this.handleChange} /> */}
    </>);
  }
}

export default Display