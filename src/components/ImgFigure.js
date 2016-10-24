import React from 'react';

export default class ImgFigure extends React.Component {
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

	// 单个图片组件
	render() {
		var ImgFigureClassName = 'img-figure';
			ImgFigureClassName += this.props.arrange.isInverse ? ' inverse' : '';
		return (
			<figure className={ImgFigureClassName} style={this.props.arrange.pos} onClick={this.handleClick}>
				<img src={this.props.data.imageUrl} alt={this.props.data.title} />
				<figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back">
                      <p>
                        {this.props.data.desc}
                      </p>
                    </div>
                </figcaption>
			</figure>
		);
	}
}

ImgFigure.defaultProps = {
};

