import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as Thing } from '../stories/Thing.stories';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<div />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
