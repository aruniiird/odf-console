import * as React from 'react';
import { useCustomTranslation } from '@odf/shared/useCustomTranslationHook';
import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
// import { CSVStatusesContext, DRResourcesContext } from '../policy-dashboard-context';

export const StatusCard: React.FC = () => {
  const { t } = useCustomTranslation();
  // const { csvData, csvError, csvLoading } = React.useContext(CSVStatusesContext);
  // const { argoApplicationSetResources, loaded, loadError } = React.useContext(DRResourcesContext);

  return (
    <Card data-test="status-card">
      <CardHeader>
        <CardTitle>{t('Status')}</CardTitle>
      </CardHeader>
      <CardBody>{/** ToDo: add card here */}</CardBody>
    </Card>
  );
};