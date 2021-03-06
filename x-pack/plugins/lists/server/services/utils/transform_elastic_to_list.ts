/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { estypes } from '@elastic/elasticsearch';

import { ListArraySchema, SearchEsListSchema } from '../../../common/schemas';

import { encodeHitVersion } from './encode_hit_version';

export interface TransformElasticToListOptions {
  response: estypes.SearchResponse<SearchEsListSchema>;
}

export const transformElasticToList = ({
  response,
}: TransformElasticToListOptions): ListArraySchema => {
  // @ts-expect-error created_at is incompatible
  return response.hits.hits.map((hit) => {
    return {
      _version: encodeHitVersion(hit),
      id: hit._id,
      ...hit._source,
    };
  });
};
