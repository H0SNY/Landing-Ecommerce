import React from 'react';
import classes from '../css/CaresoulHOC.module.css';
import mainClasses from '../../MainCss/MainClasses.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronLeft , faChevronRight} from '@fortawesome/free-solid-svg-icons'
export default class CareesoulHOC extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			selected: 0,
		};
		this.handleBack = this.handleBack.bind(this);
		this.handleForward = this.handleForward.bind(this);
	}
	handleBack() {
		if (this.state.selected === 0) this.setState({ selected: this.props.components?.length - 1 });
		else this.setState({ selected: this.state.selected - 1 });
	}
	handleForward() {
		if (this.state.selected === this.props?.components?.length - 1) this.setState({ selected: 0 });
		else this.setState({ selected: this.state.selected + 1 });
	}

	render() {
		return (
			<div className={`${mainClasses.container} ${classes.root}`}>
				<div className={classes.component}>{this.props.components[this.state.selected]}</div>
				<div className={`${classes.backbuttonroot}`}>
					<button onClick={this.handleBack} className={`${classes.button}`}>
						<FontAwesomeIcon className = {classes.icon} icon = {faChevronLeft}/>
					</button>
				</div>
				<div className={`${classes.forwardbuttonroot}`}>
					<button  onClick={this.handleForward} className={`${classes.button}`}>
						<FontAwesomeIcon className = {classes.icon} icon = {faChevronRight}/>
					</button>
				</div>
			</div>
		);
	}
}
