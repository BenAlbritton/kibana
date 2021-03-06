/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import Boom from '@hapi/boom';
import { i18n } from '@kbn/i18n';
import * as t from 'io-ts';
import { isActivePlatinumLicense } from '../../common/license_check';
import { getCorrelationsForFailedTransactions } from '../lib/correlations/errors/get_correlations_for_failed_transactions';
import { getOverallErrorTimeseries } from '../lib/correlations/errors/get_overall_error_timeseries';
import { getCorrelationsForSlowTransactions } from '../lib/correlations/latency/get_correlations_for_slow_transactions';
import { getOverallLatencyDistribution } from '../lib/correlations/latency/get_overall_latency_distribution';
import { setupRequest } from '../lib/helpers/setup_request';
import { createRoute } from './create_route';
import { environmentRt, kueryRt, rangeRt } from './default_api_types';

const INVALID_LICENSE = i18n.translate(
  'xpack.apm.significanTerms.license.text',
  {
    defaultMessage:
      'To use the correlations API, you must be subscribed to an Elastic Platinum license.',
  }
);

export const correlationsLatencyDistributionRoute = createRoute({
  endpoint: 'GET /api/apm/correlations/latency/overall_distribution',
  params: t.type({
    query: t.intersection([
      t.partial({
        serviceName: t.string,
        transactionName: t.string,
        transactionType: t.string,
      }),
      environmentRt,
      kueryRt,
      rangeRt,
    ]),
  }),
  options: { tags: ['access:apm'] },
  handler: async ({ context, request }) => {
    if (!isActivePlatinumLicense(context.licensing.license)) {
      throw Boom.forbidden(INVALID_LICENSE);
    }
    const setup = await setupRequest(context, request);
    const {
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
    } = context.params.query;

    return getOverallLatencyDistribution({
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      setup,
    });
  },
});

export const correlationsForSlowTransactionsRoute = createRoute({
  endpoint: 'GET /api/apm/correlations/latency/slow_transactions',
  params: t.type({
    query: t.intersection([
      t.partial({
        serviceName: t.string,
        transactionName: t.string,
        transactionType: t.string,
      }),
      t.type({
        durationPercentile: t.string,
        fieldNames: t.string,
        maxLatency: t.string,
        distributionInterval: t.string,
      }),
      environmentRt,
      kueryRt,
      rangeRt,
    ]),
  }),
  options: { tags: ['access:apm'] },
  handler: async ({ context, request }) => {
    if (!isActivePlatinumLicense(context.licensing.license)) {
      throw Boom.forbidden(INVALID_LICENSE);
    }
    const setup = await setupRequest(context, request);
    const {
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      durationPercentile,
      fieldNames,
      maxLatency,
      distributionInterval,
    } = context.params.query;

    return getCorrelationsForSlowTransactions({
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      durationPercentile: parseInt(durationPercentile, 10),
      fieldNames: fieldNames.split(','),
      setup,
      maxLatency: parseInt(maxLatency, 10),
      distributionInterval: parseInt(distributionInterval, 10),
    });
  },
});

export const correlationsErrorDistributionRoute = createRoute({
  endpoint: 'GET /api/apm/correlations/errors/overall_timeseries',
  params: t.type({
    query: t.intersection([
      t.partial({
        serviceName: t.string,
        transactionName: t.string,
        transactionType: t.string,
      }),
      environmentRt,
      kueryRt,
      rangeRt,
    ]),
  }),
  options: { tags: ['access:apm'] },
  handler: async ({ context, request }) => {
    if (!isActivePlatinumLicense(context.licensing.license)) {
      throw Boom.forbidden(INVALID_LICENSE);
    }
    const setup = await setupRequest(context, request);
    const {
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
    } = context.params.query;

    return getOverallErrorTimeseries({
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      setup,
    });
  },
});

export const correlationsForFailedTransactionsRoute = createRoute({
  endpoint: 'GET /api/apm/correlations/errors/failed_transactions',
  params: t.type({
    query: t.intersection([
      t.partial({
        serviceName: t.string,
        transactionName: t.string,
        transactionType: t.string,
      }),
      t.type({
        fieldNames: t.string,
      }),
      environmentRt,
      kueryRt,
      rangeRt,
    ]),
  }),
  options: { tags: ['access:apm'] },
  handler: async ({ context, request }) => {
    if (!isActivePlatinumLicense(context.licensing.license)) {
      throw Boom.forbidden(INVALID_LICENSE);
    }
    const setup = await setupRequest(context, request);
    const {
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      fieldNames,
    } = context.params.query;

    return getCorrelationsForFailedTransactions({
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      fieldNames: fieldNames.split(','),
      setup,
    });
  },
});
