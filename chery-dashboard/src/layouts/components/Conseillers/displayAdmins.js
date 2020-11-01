import { Table, Button, Space, Input } from 'antd';
import React from 'react';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { listadmins } from '../../../api/conseillers';
import { getDateExact } from '../../../helpers/userdata';
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
]; */

class DisplayAdmins extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    searchText: '',
    searchedColumn: '',

    data: [],
    pagination: {
      current: 1,
      pageSize: 5,
    },
    loading: false,


  };


  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });

  }
  handleTableChange = (pagination, filters, sorter) => {
    //console.log(pagination)
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

    await listadmins().then(res => {

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
    }).catch(err => {
      console.log(err)
      this.setState({ loading: false })
    })
  }
  render() {
    let { sortedInfo,
      filteredInfo,
      loading,
      pagination, data
    } = this.state;

    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: "Nom d'utilisateur",
        dataIndex: 'username',
        key: 'username',
        sorter: (a, b) => a.username.length - b.username.length,
        sortOrder: sortedInfo.columnKey === 'username' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('username'),

      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email - b.email,
        sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('email'),
      },
      {
        title: "Date d'ajout",
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: (a, b) => a.created_at.length - b.created_at.length,
        sortOrder: sortedInfo.columnKey === 'created_at' && sortedInfo.order,
        ellipsis: true,
        ...this.getColumnSearchProps('created_at'),
        render: (text, record) => (
          <> {getDateExact(record.created_at)} </>
        ),
      },
    ];
    return (
      <>
        <Table columns={columns}
          dataSource={data}
          rowKey={record => record._id}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange} />
      </>
    );
  }
}
export default DisplayAdmins;