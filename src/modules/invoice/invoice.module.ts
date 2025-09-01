import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MercadopagoModule } from '../mercadopago/mercadopago.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [TypeOrmModule.forFeature([Invoice]), MercadopagoModule],
  exports: [InvoiceService],
})
export class InvoiceModule {}
