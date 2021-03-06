/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { setMockValues, setMockActions, rerender } from '../../../__mocks__';
import '../../../__mocks__/shallow_useeffect.mock';

import React from 'react';

import { shallow, ShallowWrapper } from 'enzyme';

import { EuiPageHeader } from '@elastic/eui';

import { Loading } from '../../../shared/loading';
import { LogRetentionCallout, LogRetentionTooltip } from '../log_retention';

import { ApiLogs } from './';

describe('ApiLogs', () => {
  const values = {
    dataLoading: false,
    apiLogs: [],
    meta: { page: { current: 1 } },
  };
  const actions = {
    fetchApiLogs: jest.fn(),
    pollForApiLogs: jest.fn(),
  };

  let wrapper: ShallowWrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    setMockValues(values);
    setMockActions(actions);
    wrapper = shallow(<ApiLogs engineBreadcrumb={['some engine']} />);
  });

  it('renders', () => {
    expect(wrapper.find(EuiPageHeader).prop('pageTitle')).toEqual('API Logs');
    // TODO: Check for ApiLogsTable + NewApiEventsPrompt when those get added

    expect(wrapper.find(LogRetentionCallout).prop('type')).toEqual('api');
    expect(wrapper.find(LogRetentionTooltip).prop('type')).toEqual('api');
  });

  it('renders a loading screen', () => {
    setMockValues({ ...values, dataLoading: true, apiLogs: [] });
    rerender(wrapper);

    expect(wrapper.find(Loading)).toHaveLength(1);
  });

  describe('effects', () => {
    it('calls a manual fetchApiLogs on page load and pagination', () => {
      expect(actions.fetchApiLogs).toHaveBeenCalledTimes(1);

      setMockValues({ ...values, meta: { page: { current: 2 } } });
      rerender(wrapper);

      expect(actions.fetchApiLogs).toHaveBeenCalledTimes(2);
    });

    it('starts pollForApiLogs on page load', () => {
      expect(actions.pollForApiLogs).toHaveBeenCalledTimes(1);
    });
  });
});
