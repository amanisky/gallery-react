require('normalize.css/normalize.css');
require('styles/App.css');
import React from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from './ImgFigure';

/**
 * 左分区取值范围
 * x > -ImgFigure.width / 2 并且 x < stage.width / 2 - ImgFigure.width / 2 * 3
 * y > -ImgFigure.height / 2 并且 y < stage.height - ImgFigure.height / 2
 *
 * 右分区取值范围
 * x > stage.width / 2 + ImgFigure.width / 2 并且 x < stage.width - ImgFigure.width / 2
 * y > 0 - ImgFigure.height / 2 并且 y < stage.height - ImgFigure.height / 2
 *
 * 上分区取值范围
 * x > stage.width / 2 - ImgFigure.width 并且 x < stage.width / 2
 * y > -ImgFigure.height / 2 并且 y < stage.height / 2 - ImgFigure.height / 2 * 3
 */


// 获取图片相关数据
let imageDatas = require('../data/images.json');

// 根据图片名称生成图片 URL 地址
imageDatas = imageDatas.map((item) => {
	item.imageUrl = require('../images/' + item.fileName);
	return item;
});

export default class AppComponent extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	imgsArrangeArr: []
	    };
	    this.config = {
			// 中心坐标
			centerPos: {
				left: 0,
				right: 0
			},
			// 水平坐标取值范围
			hPosRange: {
				leftSide: [0, 0],
				rightSide: [0, 0],
				top: [0, 0]
			},
			// 垂直坐标取值范围
			vPosRange: {
				left: [0, 0],
				top: [0, 0]
			}
		};
	}

	/**
	 * 返回指定区间的随机数
	 * @parm low 最小值
	 * @param high 最大值
	 * @return {Number}
	 */
	posRange(low, high) {
		return Math.floor(Math.random() * (high - low)) + low;
	}

	/**
	 * 获取 -30 ~ 30 之前的随机数
	 */
	randomDeg() {
		return (Math.random() > 0.5 ? '-1' : '1') * Math.floor(Math.random() * 30);
	}

	/**
	 * 重新布局所有图片
	 * @param centerIndex 指定居中排布的那个图片下标
	 */
	rearrange(centerIndex) {
		var imgsStateArr = this.state.imgsArrangeArr,				// 所有图片状态信息
			constant = this.config,									// 各种区域配置
			topImgNum = Math.floor(Math.random() * 2),				// 上侧区域存放图片数量，要么 0 张，要么 1 张
			topIndex = 0,											// 上侧区域存放图片在数组中的坐标位置
			topImg = null,											// 上侧区域图片
			centerImg = imgsStateArr.splice(centerIndex, 1)[0];		// 从数组中取出居中的那张图片
			centerImg = {
				pos: constant.centerPos,
				isCenter: true
			};
			
		if (topImgNum) {
			// 上区域图片随机下标
			topIndex = Math.floor(Math.random() * (imgsStateArr.length - topImgNum));
			topImg = imgsStateArr.splice(topIndex, topImgNum)[0];
			topImg = {
				pos: {
					left: this.posRange(constant.vPosRange.left[0], constant.vPosRange.left[1]),
					top: this.posRange(constant.vPosRange.top[0], constant.vPosRange.top[1]),
					transform: 'rotate(' + this.randomDeg() + 'deg)'
				},
				isCenter: false
			};
		}

		// 左右两侧图片排列
		for (var x = 0, y = imgsStateArr.length, z = y / 2; x < y; x++) {
			if (x < z) {
				imgsStateArr[x] = {
					pos: {
						left: this.posRange(constant.hPosRange.leftSide[0], constant.hPosRange.leftSide[1]),
						top: this.posRange(constant.hPosRange.top[0], constant.hPosRange.top[1]),
						transform: 'rotate(' + this.randomDeg() + 'deg)'
					},
					isCenter: false
				};
			}
			else {
				imgsStateArr[x] = {
					pos: {
						left: this.posRange(constant.hPosRange.rightSide[0], constant.hPosRange.rightSide[1]),
						top: this.posRange(constant.hPosRange.top[0], constant.hPosRange.top[1]),
						transform: 'rotate(' + this.randomDeg() + 'deg)'
					},
					isCenter: false
				};
			}
		}

		
		// 将上侧图片状态放回原状态数组
		if (topImgNum > 0) {
			imgsStateArr.splice(topIndex, 0, topImg);
		}

		// 将中间图片状态放回原状态数组
		imgsStateArr.splice(centerIndex, 0, centerImg);
		
		this.setState({imgsArrangeArr: imgsStateArr});
		console.log(this.state.imgsArrangeArr, 1111, topImgNum);
	}

	/**
	 * 利用 rearrange 函数，居中对应的 index 的图片
	 * @param index 需要被居中的图片对应的图片信息数组 index 值
	 * @return {Function}
	 */
	 center(index) {
	 	return function() {
	 		this.rearrange(index);
	 	}.bind(this);
	 }

	/**
	 * 翻转图片
	 * @param index 当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @return {Function} 返回一个闭包函数，其内 return 一个真正被执行的函数
	 */
	inverse(index) {
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	}

	// 渲染
	render() {
		var controllerUnits = [],	// 保存所有按钮组件
			imgFigures = [];		// 保存所有图片组件

		imageDatas.forEach(function(value, index) {
			// 初始化状态
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						top: 0,
						left: 0,
						transform: 'rotate(0deg)'
					},
					// true 反面 false 正面
					isInverse: false,
					// true 居中 false 不居中
					isCenter: false
				};
			}

			imgFigures.push(<ImgFigure arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} key={index} data={value} ref={'imgFigure' + index} />);
		}.bind(this));

		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}

	// 组件加载以后，为每张图片计算其位置的范围
	componentDidMount() {
		// 拿到舞台大小
		var stageDom = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 拿到图片的大小
		var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDom.scrollWidth,
			imgH = imgFigureDom.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 计算中心图片坐标点
		this.config.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH,
			zIndex: 101
		};

		// 计算左右两侧图片的坐标点范围
		this.config.hPosRange = {
			leftSide: [-halfImgW, halfStageW - halfImgW * 3],
			rightSide: [halfStageW + halfImgW, stageW - halfImgW],
			top: [-halfImgH, stageH - halfImgH]
		};

		// 计算上侧区域图片的坐标点范围
		this.config.vPosRange = {
			left: [halfStageW - imgW, halfStageW],
			top: [-halfImgH, halfStageH - halfImgH * 3]
		};

		// 第一张图片默认居中
		this.rearrange(0);
	}
}

AppComponent.defaultProps = {
};