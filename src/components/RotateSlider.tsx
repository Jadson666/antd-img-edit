import { Slider } from 'antd';
import React from 'react';
import { MAX_ROTATE, MIN_ROTATE, pkg, ROTATE_STEP } from './ImgCrop';

const Component = ({
  rotateVal,
  setRotateVal,
  subRotateVal,
  isMinRotate,
  addRotateVal,
  isMaxRotate,
}) => (
  <div className={`${pkg}-control rotate`}>
    <button onClick={subRotateVal} disabled={isMinRotate}>
      ↺
    </button>
    <Slider
      min={MIN_ROTATE}
      max={MAX_ROTATE}
      step={ROTATE_STEP}
      value={rotateVal}
      onChange={setRotateVal}
    />
    <button onClick={addRotateVal} disabled={isMaxRotate}>
      ↻
    </button>
  </div>
);

export const RotateSlider = React.memo(Component);
