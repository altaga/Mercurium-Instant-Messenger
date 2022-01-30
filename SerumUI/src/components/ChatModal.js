import React from 'react';
import { Modal, Input, Button, Row } from 'antd';
import autoBind from 'react-autobind';

const chatURL = 'https://www.mercurium.site/';

class ChatModal extends React.Component {
  constructor(props) {
    super(props);
    this.provider = null;
    this.state = {
      visible: false,
      to: '',
      startVisibility: false,
    };
    autoBind(this);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible) {
      this.setState({
        visible: !this.state.visible,
      });
    }
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    this.setState({
      visible: false,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <>
        <Modal
          title="Chat Widget"
          visible={this.state.visible}
          width={'50%'}
          footer={[
            <Button
              key="back"
              onClick={this.handleCancel}
              type="primary"
              size="large"
            >
              Close Chat
            </Button>,
          ]}
        >
          <>
            <div style={{ fontSize: '16px' }}>Start Chat</div>
            <p></p>
            <Row>
              <Input
                placeholder="Chat with address"
                allowClear
                size="large"
                style={{ width: '70%' }}
                onChange={(e) => {
                  this.setState({
                    to: e.target.value,
                  });
                }}
              />
              <Button
                style={{ width: '30%' }}
                type="primary"
                size="large"
                onClick={() => window.open(chatURL + this.state.to, '_blank')}
                disabled={this.state.to.length !== 44}
              >
                Start Chat
              </Button>
            </Row>
          </>
        </Modal>
      </>
    );
  }
}

export default ChatModal;
