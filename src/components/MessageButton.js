import React from 'react'
import { Button, Modal } from 'react-bootstrap'


export default class MessageButton extends React.Component {
	static propTypes = {
		buttonTitle: React.PropTypes.string,
		buttonDisabledTitle: React.PropTypes.string,
		enabled: React.PropTypes.bool,
		modalTitle: React.PropTypes.string,
		text: React.PropTypes.string,
		onClick: React.PropTypes.func
	}
	constructor(props) {
		super(props);
		this.state = { modalIsVisible: false };
	}
	showModal = () => {
		this.setState({ modalIsVisible: true })
	}
	closeModal = () => {
		this.setState({ modalIsVisible: false });
		this.props.onClick();
	}
	render() {
		if (this.state.modalIsVisible)
			return <Modal show={this.state.modalIsVisible} onHide={this.closeModal}>
				<Modal.Header closeButton>{this.props.modalTitle}</Modal.Header>
				<Modal.Body>{this.props.text}</Modal.Body>
				<Modal.Footer><Button bsStyle="primary" bsSize="large" onClick={this.closeModal}>OK</Button></Modal.Footer>
			</Modal>;
		else if (this.props.enabled)
			return <span className="tb-item" onClick={this.showModal}>{this.props.buttonTitle}</span>;
		else
			return <span className='tb-item disabled'>{this.props.buttonDisabledTitle}</span>;
	}

}