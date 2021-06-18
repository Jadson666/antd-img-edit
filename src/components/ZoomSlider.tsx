import { Slider } from 'antd';
import React from 'react';
import { pkg, ZOOM_STEP } from './ImgCrop';

const Component = ({
  zoomVal,
  setZoomVal,
  subZoomVal,
  isMinZoom,
  addZoomVal,
  isMaxZoom,
  minZoom,
  maxZoom,
}) => (
  <div className={`${pkg}-control zoom`}>
    <button onClick={subZoomVal} disabled={isMinZoom}>
      －
    </button>
    <Slider min={minZoom} max={maxZoom} step={ZOOM_STEP} value={zoomVal} onChange={setZoomVal} />
    <button onClick={addZoomVal} disabled={isMaxZoom}>
      ＋
    </button>
  </div>
);

export const ZoomSlider = React.memo(Component);
