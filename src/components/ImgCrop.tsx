import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  forwardRef,
} from 'react';
// @ts-ignore
import Cropper from 'react-easy-crop';
import Modal from 'antd/es/modal';
import {
  BorderHorizontalOutlined,
  BorderVerticleOutlined,
} from '@ant-design/icons';
import '../index.less';
import { RotateSlider } from './RotateSlider';
import { ZoomSlider } from './ZoomSlider';

export const pkg = 'antd-img-crop';
const noop = () => {};

const MEDIA_CLASS = `${pkg}-media`;

export const ZOOM_STEP = 0.1;

export const MIN_ROTATE = 0;
export const MAX_ROTATE = 360;
export const ROTATE_STEP = 1;

interface EasyCropProps {
  src: any;
  aspect: any;
  shape: any;
  grid: any;

  hasZoom: any;
  zoomVal: any;
  rotateVal: any;
  rotateYDeg: any;
  rotateXDeg: any;
  setZoomVal: any;
  setRotateVal: any;

  minZoom: any;
  maxZoom: any;
  onComplete: any;

  cropperProps: any;
}

const EasyCrop = forwardRef((props: EasyCropProps, ref) => {
  const {
    src,
    aspect,
    shape,
    grid,

    hasZoom,
    zoomVal,
    rotateVal,
    rotateYDeg,
    rotateXDeg,
    setZoomVal,
    setRotateVal,

    minZoom,
    maxZoom,
    onComplete,

    cropperProps,
  } = props;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });

  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      onComplete(croppedAreaPixels);
    },
    [onComplete]
  );

  const onMediaLoaded = useCallback(
    mediaSize => {
      const { width, height } = mediaSize;
      const ratioWidth = height * aspect;

      if (width > ratioWidth) {
        setCropSize({ width: ratioWidth, height });
      } else {
        setCropSize({ width, height: width / aspect });
      }
    },
    [aspect]
  );

  return (
    <Cropper
      {...cropperProps}
      ref={ref}
      image={src}
      crop={crop}
      cropSize={cropSize}
      onCropChange={setCrop}
      aspect={aspect}
      cropShape={shape}
      showGrid={grid}
      zoomWithScroll={hasZoom}
      zoom={zoomVal}
      rotation={rotateVal}
      onZoomChange={setZoomVal}
      onRotationChange={setRotateVal}
      minZoom={minZoom}
      maxZoom={maxZoom}
      onCropComplete={onCropComplete}
      onMediaLoaded={onMediaLoaded}
      classes={{
        containerClassName: `${pkg}-container`,
        mediaClassName: MEDIA_CLASS,
      }}
      transform={`translate(${crop.x}px, ${crop.y}px) rotateZ(${rotateVal}deg) rotateY(${rotateYDeg}deg) rotateX(${rotateXDeg}deg) scale(${zoomVal})`}
    />
  );
});

interface ImgCropProps {
  aspect?: any;
  shape?: any;
  grid?: any;
  quality?: any;

  flip?: any;
  zoom?: any;
  rotate?: any;
  minZoom?: any;
  maxZoom?: any;
  fillColor?: any;

  modalTitle?: any;
  modalWidth?: any;
  modalOk?: any;
  modalCancel?: any;

  beforeCrop?: any;
  children?: any;

  cropperProps?: any;
}

const ImgCrop = forwardRef((props: ImgCropProps, ref) => {
  const {
    aspect = 1,
    shape = 'rect',
    grid = false,
    quality = 0.4,

    flip = true,
    zoom = true,
    rotate = false,
    minZoom = 1,
    maxZoom = 3,
    fillColor = 'white',

    modalTitle,
    modalWidth,
    modalOk,
    modalCancel,

    beforeCrop,
    children,

    cropperProps,
  } = props;

  const hasZoom = zoom === true;
  const hasRotate = rotate === true;
  const hasFlip = flip === true;
  const [src, setSrc] = useState('');
  const [zoomVal, setZoomVal] = useState(1);
  const [rotateVal, setRotateVal] = useState(0);
  const [horizonFlip, setHorizonFlip] = useState(false);
  const [verticalFlip, setVerticalFlip] = useState(false);
  const reset = () => {
    setHorizonFlip(false);
    setVerticalFlip(false);
  };

  const rotateYDeg = horizonFlip ? 180 : 0;
  const rotateXDeg = verticalFlip ? 180 : 0;

  const beforeUploadRef = useRef();
  const fileRef = useRef();
  const resolveRef = useRef<(v) => void>(noop);
  const rejectRef = useRef<(v) => void>(noop);

  const cropPixelsRef = useRef();

  /**
   * Upload
   */
  const renderUpload = useCallback(() => {
    const upload = Array.isArray(children) ? children[0] : children;
    const { beforeUpload, accept, ...restUploadProps } = upload.props;
    beforeUploadRef.current = beforeUpload;

    return {
      ...upload,
      props: {
        ...restUploadProps,
        accept: accept || 'image/*',
        beforeUpload: (file, fileList) =>
          new Promise(async (resolve, reject) => {
            if (beforeCrop && !(await beforeCrop(file, fileList))) {
              reject();
              return;
            }

            fileRef.current = file;
            resolveRef.current = resolve as any;
            rejectRef.current = reject;

            const reader = new FileReader();
            reader.addEventListener('load', () => {
              setSrc(reader.result as string);
            });
            reader.readAsDataURL(file);
          }),
      },
    };
  }, [beforeCrop, children]);

  /**
   * EasyCrop
   */
  const onComplete = useCallback(croppedAreaPixels => {
    cropPixelsRef.current = croppedAreaPixels;
  }, []);

  /**
   * Controls
   */
  const isMinZoom = zoomVal - ZOOM_STEP < minZoom;
  const isMaxZoom = zoomVal + ZOOM_STEP > maxZoom;
  const isMinRotate = rotateVal === MIN_ROTATE;
  const isMaxRotate = rotateVal === MAX_ROTATE;

  const handleFlipHorizon = useCallback(() => {
    setHorizonFlip(v => !v);
  }, []);

  const handleFlipVertical = useCallback(() => {
    setVerticalFlip(v => !v);
  }, []);

  const subZoomVal = useCallback(() => {
    if (!isMinZoom) setZoomVal(zoomVal - ZOOM_STEP);
  }, [isMinZoom, zoomVal]);

  const addZoomVal = useCallback(() => {
    if (!isMaxZoom) setZoomVal(zoomVal + ZOOM_STEP);
  }, [isMaxZoom, zoomVal]);

  const subRotateVal = useCallback(() => {
    if (!isMinRotate) setRotateVal(rotateVal - ROTATE_STEP);
  }, [isMinRotate, rotateVal]);

  const addRotateVal = useCallback(() => {
    if (!isMaxRotate) setRotateVal(rotateVal + ROTATE_STEP);
  }, [isMaxRotate, rotateVal]);

  /**
   * Modal
   */
  const modalProps = useMemo(() => {
    const obj = { width: modalWidth, okText: modalOk, cancelText: modalCancel };
    Object.keys(obj).forEach(key => {
      if (!obj[key]) delete obj[key];
    });
    return obj;
  }, [modalCancel, modalOk, modalWidth]);

  const onClose = useCallback(() => {
    setSrc('');
    setZoomVal(1);
    setRotateVal(0);
  }, []);

  const onOk = useCallback(async () => {
    onClose();

    const naturalImg: HTMLImageElement = document.querySelector(
      `.${MEDIA_CLASS}`
    );
    const { naturalWidth, naturalHeight } = naturalImg;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // create a max canvas to cover the source image after rotated
    const maxLen = Math.sqrt(
      Math.pow(naturalWidth, 2) + Math.pow(naturalHeight, 2)
    );
    canvas.width = maxLen;
    canvas.height = maxLen;

    const { width, height, x, y } = cropPixelsRef.current as any;

    // mirror the image
    if (horizonFlip) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    if (verticalFlip) {
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
    }

    // rotate the image
    if (hasRotate && rotateVal > 0 && rotateVal < 360) {
      const halfMax = maxLen / 2;
      ctx.translate(halfMax, halfMax);
      ctx.rotate((rotateVal * Math.PI) / 180);
      ctx.translate(-halfMax, -halfMax);
    }

    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw the source image in the center of the max canvas
    const left = (maxLen - naturalWidth) / 2;
    const top = (maxLen - naturalHeight) / 2;
    ctx.drawImage(naturalImg, left, top);

    // shrink the max canvas to the crop area size, then align two center points
    const maxImgData = ctx.getImageData(0, 0, maxLen, maxLen);

    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(maxImgData, Math.round(-left - x), Math.round(-top - y));

    // get the new image
    const { type, name, uid } = fileRef.current as any;

    canvas.toBlob(imageTransformer(name, type, uid), type, quality);
    reset();
  }, [
    hasRotate,
    onClose,
    quality,
    rotateVal,
    fillColor,
    horizonFlip,
    verticalFlip,
  ]);

  const imageTransformer = (name, type, uid) => {
    return async (blob: Blob): Promise<void> => {
      let newFile: any = new File([blob], name, { type });
      newFile.uid = uid;

      if (typeof beforeUploadRef.current !== 'function')
        return resolveRef.current(newFile);
      // @ts-ignore
      const res = beforeUploadRef.current(newFile, [newFile]);

      if (typeof res !== 'boolean' && !res) {
        console.error('beforeUpload must return a boolean or Promise');
        return;
      }

      if (res === true) return resolveRef.current(newFile);
      if (res === false) return rejectRef.current('not upload');
      if (res && typeof res.then === 'function') {
        try {
          const passedFile = await res;
          const type = Object.prototype.toString.call(passedFile);
          if (type === '[object File]' || type === '[object Blob]')
            newFile = passedFile;
          resolveRef.current(newFile);
        } catch (err) {
          rejectRef.current(err);
        }
      }
    };
  };

  const renderComponent = titleOfModal => (
    <>
      {renderUpload()}
      {src && (
        <Modal
          visible={true}
          wrapClassName={`${pkg}-modal`}
          title={titleOfModal}
          onOk={onOk}
          onCancel={onClose}
          maskClosable={false}
          destroyOnClose
          {...modalProps}
        >
          <EasyCrop
            ref={ref}
            src={src}
            aspect={aspect}
            shape={shape}
            grid={grid}
            hasZoom={hasZoom}
            zoomVal={zoomVal}
            rotateVal={rotateVal}
            setZoomVal={setZoomVal}
            setRotateVal={setRotateVal}
            minZoom={minZoom}
            maxZoom={maxZoom}
            onComplete={onComplete}
            cropperProps={cropperProps}
            rotateYDeg={rotateYDeg}
            rotateXDeg={rotateXDeg}
          />
          {hasZoom && (
            <ZoomSlider
              zoomVal={zoomVal}
              setZoomVal={setZoomVal}
              subZoomVal={subZoomVal}
              isMinZoom={isMinZoom}
              addZoomVal={addZoomVal}
              isMaxZoom={isMaxZoom}
              minZoom={minZoom}
              maxZoom={maxZoom}
            />
          )}
          {hasRotate && (
            <RotateSlider
              rotateVal={rotateVal}
              setRotateVal={setRotateVal}
              subRotateVal={subRotateVal}
              isMinRotate={isMinRotate}
              addRotateVal={addRotateVal}
              isMaxRotate={isMaxRotate}
            />
          )}
          {hasFlip && (
            <div className={`${pkg}-control flip`}>
              <BorderHorizontalOutlined
                className="iconButton"
                onClick={handleFlipHorizon}
              />
              <BorderVerticleOutlined
                className="iconButton"
                onClick={handleFlipVertical}
              />
            </div>
          )}
        </Modal>
      )}
    </>
  );
  return renderComponent(modalTitle || 'Edit Image');
});

export default ImgCrop;
