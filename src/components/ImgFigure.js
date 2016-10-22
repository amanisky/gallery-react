import React from 'react';

export default class ImgFigure extends React.Component {
  render() {
    return (
		<figure className="img-figure" style={this.props.arrange}>
			<img src={this.props.data.imageUrl} alt={this.props.data.title} />
			<figcaption>
				<h2 className="img-title">{this.props.data.title}</h2>
			</figcaption>
		</figure>
    );
  }
}

ImgFigure.defaultProps = {
};

