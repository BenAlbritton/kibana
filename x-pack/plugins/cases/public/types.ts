/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreStart } from 'kibana/public';
import { ReactElement } from 'react';
import { SecurityPluginSetup } from '../../security/public';
import {
  TriggersAndActionsUIPublicPluginSetup as TriggersActionsSetup,
  TriggersAndActionsUIPublicPluginStart as TriggersActionsStart,
} from '../../triggers_actions_ui/public';
import { AllCasesProps } from './components/all_cases';
import { CreateCaseProps } from './components/create';

export interface SetupPlugins {
  security: SecurityPluginSetup;
  triggersActionsUi: TriggersActionsSetup;
}

export interface StartPlugins {
  triggersActionsUi: TriggersActionsStart;
}

/**
 * TODO: The extra security service is one that should be implemented in the kibana context of the consuming application.
 * Security is needed for access to authc for the `useCurrentUser` hook. Security_Solution currently passes it via renderApp in public/plugin.tsx
 * Leaving it out currently in lieu of RBAC changes
 */

export type StartServices = CoreStart &
  StartPlugins & {
    security: SecurityPluginSetup;
  };

export interface CasesUiStart {
  getAllCases: (props: AllCasesProps) => ReactElement<AllCasesProps>;
  getCreateCase: (props: CreateCaseProps) => ReactElement<CreateCaseProps>;
}
