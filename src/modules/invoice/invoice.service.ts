import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { DataSource, Repository } from 'typeorm';
import { MercadopagoService } from '../mercadopago/mercadopago.service';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { config, configType } from 'src/common/config/config';
import { reservationTime } from 'src/common/constants/reservationTime';
import { formatDateWithOffset } from 'src/common/utils/formatDateWithOffset';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    private readonly mercadopagoService: MercadopagoService,
    @Inject(config.KEY)
    private readonly configService: configType,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async create(data: CreateInvoiceDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.startTransaction();
    try {
      const items: Items[] = [
        {
          title: `Tickets para ${data.screening.movie.name} - ${data.screening.theater.name} - ${data.screening.startTime}`,
          quantity: data.seatReservations.length,
          unit_price: data.screening.price * 1.21,
          id: `${data.screening.id}-${data.userId}-${Date.now()}`,
        },
      ];
      const now = new Date();
      const preference = await this.mercadopagoService.createPreference({
        items,
        back_urls: {
          success:
            this.configService.api.frontUrl +
            `/invoice/?statusMP=success&temporalTransactionId=${data.temporalTransactionId}`,
          failure:
            this.configService.api.frontUrl +
            `/invoice/?statusMP=failure&temporalTransactionId=${data.temporalTransactionId}`,
          pending:
            this.configService.api.frontUrl +
            `/invoice/?statusMP=pending&temporalTransactionId=${data.temporalTransactionId}`,
        },
        expires: true,
        expiration_date_to: formatDateWithOffset(
          new Date(now.getTime() + (reservationTime + 10) * 1000),
        ),
        // taxes: [{ type: 'OTRO', value: 21 }],
        auto_return: 'approved',
      });
      // console.log('preference', preference);
      const invoice = qr.manager.create(Invoice, {
        external_id: preference.id,
        init_point: preference.init_point,
        seatReservations: data.seatReservations,
        operation_type: preference.operation_type,
        back_urls: preference.back_urls,
        redirect_urls: preference.redirect_urls,
        auto_return: preference.auto_return,
        notification_url: preference.notification_url,
        client_id: preference.client_id,
        additional_info: preference.additional_info,
        collector_id: preference.collector_id,
        date_created: preference.date_created,
        date_of_expiration: preference.date_of_expiration,
        expiration_date_from: preference.expiration_date_from,
        expiration_date_to: preference.expiration_date_to,
        expires: preference.expires,
        marketplace_fee: preference.marketplace_fee,
        taxes: preference.taxes,
        user: { id: data.userId },
        total: data.screening.price * 1.21 * data.seatReservations.length,
      });
      const res = await qr.manager.save(invoice);
      await qr.commitTransaction();
      return res;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  async getOneByExternalId(external_id: string) {
    const invoice = await this.invoiceRepo.findOne({ where: { external_id } });
    if (!invoice) {
      throw new NotFoundException('Invoice no encontrado');
    }
    return invoice;
  }

  // async
}
