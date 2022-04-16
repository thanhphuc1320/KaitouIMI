import React from 'react';
import Hammer from 'hammerjs';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import dicomLoader from './dcmLoader';

class DicomViewer extends React.Component {
  componentWillMount() {
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    dicomLoader(cornerstone, this.props.url);
  }
  componentDidMount() {
    this.loadImage();
  }
  dicomImage = null;
  loadImage = () => {
    const element = this.dicomImage;
    const imageId = 'example://1';
    cornerstone.enable(element);
    cornerstone.loadImage(imageId).then(image => {
      cornerstone.displayImage(element, image);
    });
  };

  dicomImageRef = el => {
    this.dicomImage = el;
  };

  getImageData = () => {
    const cornerstoneCanvas = document.querySelector('.cornerstone-canvas');
    return cornerstoneCanvas.toDataURL();
  };

  getSize = () => {
    const cornerstoneCanvas = document.querySelector('.cornerstone-canvas');
    return {
      width: cornerstoneCanvas.width,
      height: cornerstoneCanvas.height,
    };
  };

  render() {
    return (
      <div
        style={{ display: 'hidden', position: 'fixed', left: -4000 }}
        onClick={this.props.openModal}
      >
        <div
          ref={this.dicomImageRef}
          style={{
            width: 512,
            height: 512,
          }}
          onClick={this.getImageData}
        />
      </div>
    );
  }
}

export default DicomViewer;
