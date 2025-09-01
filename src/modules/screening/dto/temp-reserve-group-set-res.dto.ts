import { Invoice } from 'src/modules/invoice/entities/invoice.entity';

export class TempReserveGroupSeatRes {
  success: boolean;
  message: string;
  invoice: Invoice;
}
