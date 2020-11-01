import React from 'react';

import { Table, Pagination, Button, Space, Input } from 'antd';
import reqwest from 'reqwest';
import { getHistoryByDossier, getNombreHistoryByDossier } from '../../../../api/historiques';
import { getDateExact } from '../../../../helpers/userdata';
import { SearchOutlined, StopOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';




/**
 *  {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        render: name => `${name.first} ${name.last}`,
        width: '20%',
    },
 */



const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        render: name => `${name.first} ${name.last}`,
        width: '20%',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        filters: [
            { text: 'Male', value: 'male' },
            { text: 'Female', value: 'female' },
        ],
        width: '20%',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
];


class dosserHistorique extends React.Component {
    state = {
        data: [],
        pagination: {
            current: 1,
            pageSize: 5,
            total: 1,

        },
        loading: false,
        filteredInfo: null,
        sortedInfo: null,
        searchText: '',
        searchedColumn: '',
    };

    componentDidMount() {
        const { pagination } = this.state;
        this.fetch({ pagination });


    }
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
    /************************************************************************************** */

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

    fetch = async (params = {}) => {

        this.setState({ loading: true });
        // await getDossier(this.props.dossier._id).then(async (ress) => {

        await getHistoryByDossier(this.props.dossier._id, params.pagination.pageSize, params.pagination.pageSize * (params.pagination.current - 1)).then(async (res) => {
            const result = this.loadTableData(res)
            result.client = result.client ? result.client : null
            result.etat = result.etat ? result.etat : null

            this.setState({
                loading: false,
                data: result,
                pagination: {
                    ...params.pagination,
                    total: await getNombreHistoryByDossier(this.props.dossier._id),
                    // 200 is mock data, you should read it from server
                    // total: data.totalCount,
                },
            });
        })
            .catch(err => {
                console.log(err)
                this.setState({ loading: false })
            })
        // })


    };

    loadTableData = (historiqueData) => {
        const tab = []
        historiqueData.forEach(element => {
            tab.push({
                _id: element._id,
                nom_prenom: element.client ? element.client.nom + " " + element.client.prenom : null,
                etat: element.etat.nom,
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
        const columnss = [
            /*  {
                 title: 'Client',
                 dataIndex: 'nom_prenom',
                 sorter: true,
                 width: '20%',
             }, */
            {
                title: 'Etat',
                dataIndex: 'etat',
                sorter: (a, b) => a.etat.localeCompare(b.etat),
                // sortOrder: sortedInfo.columnKey === 'etat' && sortedInfo.order,
                ...this.getColumnSearchProps('etat'),
                ellipsis: true,
                width: '20%',
                render: (text, record) => (
                    <>
                        {record.etat === null ? (
                            <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
                        ) : (<>
                            {record.etat}
                        </>)
                        }
                    </>
                )
            },
            {
                title: 'Description',
                dataIndex: 'desc',
                sorter: (a, b) => a.desc.localeCompare(b.desc),
                ...this.getColumnSearchProps('desc'),
                width: '50%',
            },
            {
                title: 'Agent',
                dataIndex: 'user',
                width: '10%',
                render: (text, record) => (
                    <>
                        {record.user === null ? (
                            <StopOutlined size={20} style={{ color: 'red', position: "absolute", left: '30%' }} />
                        ) : (<>
                            {record.user}
                        </>)
                        }
                    </>
                )

            },
            {
                title: 'Date de modification',
                dataIndex: 'created_at',
                width: '20%',
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
        </>);
    }
}
export default dosserHistorique;