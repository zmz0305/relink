import React from 'react';
import store from '../main.js'
import { withRouter } from 'react-router' 
import { persistStore } from 'redux-persist'

class LoadingStore extends React.Component {
	constructor(props) {
		super(props);
		this.state = { visible: true }
  }

	componentWillMount() {
		persistStore(store, {}, function() {
			var state = store.getState()
			if ((this.props.access == 'student' && !state.isStudent) ||
				(this.props.access == 'instructor' && !state.isInstructor) ||
				(this.props.access == 'any' && state.roomId == null)) {
				this.props.router.push('/')
			} else {
				this.setState({ visible: false })
			}
		}.bind(this))
	}

	render() {
		return (
			<div>
				{ this.state.visible ? <h3>Loading...</h3> : null }
			</div>
		);
	}
}

export default withRouter(LoadingStore);