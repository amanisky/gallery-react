import React from 'react';

export default class ControllerUnit extends React.Component {
	// 构造函数
	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	}

	// 单击处理函数
	handleClick(e) {
		// 判断是否居中；居中就执行翻转操作；否则执行居中操作
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		}
		else {
			this.props.center();
		}

		e.preventDefault();
        e.stopPropagation();
	}

	// 控制组件
	render() {;
		var controllerUnitClassName = 'controller-unit';
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';
		}

		if (this.props.arrange.isInverse) {
			controllerUnitClassName += ' is-inverse';
		}

		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}
}

ControllerUnit.defaultProps = {
};

