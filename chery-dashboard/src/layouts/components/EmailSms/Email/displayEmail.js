import React from "react"
import { Table, Button, Popconfirm, message, Space, Modal, Input, Tooltip } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined, CheckCircleOutlined, StopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getMails } from "../../../../api/EmailSMS";
import TextArea from 'antd/lib/input/TextArea';
import ModifyEmail from "./modifyEmail";




class DisplayEmail extends React.Component {
    state = {
        dataSource: [],
        loading: false,
        openModifyModal: false,
        emailData: {}

    };

    componentDidMount() {
        this.fetch();

    }

    fetch = async () => {
        this.setState({ loading: true });

        await getMails().then(res => {

            this.setState({
                loading: false,
                dataSource: res,
            });
        }).catch(err => {
            console.log(err)
            this.setState({ loading: false })
        })

    };



    handleChange = v => {
        this.setState({ inputValue: v.target.value })
    }
    closeModal = () => {
        this.setState({ openModifyModal: false })

    }

    /************************************************************************************************************* */
    render() {
        const { dataSource, loading, openModifyModal } = this.state;

        const columns = [

            {
                title: 'Ordre',
                width: '10%',
                render: (text, record) => (<>
                    {dataSource && dataSource.indexOf(record) + 1}
                </>)
            },
            {
                title: "Nom D'état",
                width: '20%',
                dataIndex: 'etat',
            },
            {
                width: '60%',
                title: 'Contenu du mail',
                dataIndex: 'description',

            },

            {
                title: 'Actions',
                width: '10%',
                render: (text, record) => (
                    <>
                        <a onClick={() => {
                            this.setState({ openModifyModal: true, emailData: record })
                        }}
                        >Modifier</a>
                    </>
                ),
            }
        ];
        return (<>
            {openModifyModal && <ModifyEmail data={this.state.emailData}
                modalState={this.closeModal}
                refreshAfterUpdateEmail={() => this.fetch()}
            />}


            <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                rowKey={record => record._id}

            />

        </>);
    }
}

export default DisplayEmail