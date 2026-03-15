import { MessageService } from 'primeng/api';

const toasterHandler = (
  messageService: MessageService,
  severity: 'success' | 'error',
  detail: string
) => {
  messageService.add({
    severity,
    summary: severity.toUpperCase(),
    detail,
  });
};

export default toasterHandler;
