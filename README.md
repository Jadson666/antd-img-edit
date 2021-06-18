develope base on https://www.npmjs.com/package/antd-img-crop
I add the functionality of mirror the image

# antd-img-edit


## Install

```sh
yarn add antd-img-edit
```

## Usage

```jsx harmony
import ImgCrop from 'antd-img-edit';
import { Upload } from 'antd';

const Demo = () => (
  <ImgCrop flip rotate>
    <Upload>+ Add image</Upload>
  </ImgCrop>
);
```

## Props

| Prop         | Type                 | Default        | Description                                                           |
| ------------ | -------------------- | -------------- | --------------------------------------------------------------------- |
| aspect       | `number`             | `1 / 1`        | Aspect of crop area , `width / height`                                |
| shape        | `string`             | `'rect'`       | Shape of crop area, `'rect'` or `'round'`                             |
| grid         | `boolean`            | `false`        | Show grid of crop area (third-lines)                                  |
| quality      | `number`             | `0.4`          | Image quality, `0 ~ 1`                                                |
| fillColor    | `string`             | `white`        | Fill color when cropped image smaller than canvas                     |
| zoom         | `boolean`            | `true`         | Enable zoom for image                                                 |
| flip         | `boolean`            | `true`         | enable horizontal flip and vertical flip of image                                                 |
| rotate       | `boolean`            | `false`        | Enable rotate for image                                               |
| minZoom      | `number`             | `1`            | Minimum zoom factor                                                   |
| maxZoom      | `number`             | `3`            | Maximum zoom factor                                                   |
| modalTitle   | `string`             | `'Edit image'` | Title of modal                                                        |
| modalWidth   | `number` \| `string` | `520`          | Width of modal in pixels number or percentages                        |
| modalOk      | `string`             | `'OK'`         | Text of confirm button of modal                                       |
| modalCancel  | `string`             | `'Cancel'`     | Text of cancel button of modal                                        |
| beforeCrop   | `function`           | -              | Call before modal open, if return `false`, it'll not open             |
| cropperProps | `object`             | -              | Props of [react-easy-crop] (\* [existing props] cannot be overridden) |

## Styles

To prevent overwriting the custom styles to `antd`, `antd-img-edit` does not import the style files of components.

Therefore, if your project configured `babel-plugin-import`, and not use `Modal` or `Slider`, you need to import the styles yourself:

```js
import 'antd/es/modal/style';
import 'antd/es/slider/style';
```

## License

[MIT License](https://github.com/nanxiaobei/antd-img-crop/blob/master/LICENSE) (c) [nanxiaobei](https://mrlee.me/)
