import { Inject, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config, configType } from 'src/common/config/config';

@Injectable()
export class MercadopagoProvider {
  constructor(
    @Inject(config.KEY)
    private readonly configService: configType,
  ) {
    this.mercadoPago = new MercadoPagoConfig({
      accessToken: this.configService.mercadopago.accessToken as string,
      options: {},
    });
    this.mercadoPagoPreference = new Preference(this.mercadoPago);
  }

  mercadoPago: MercadoPagoConfig;
  mercadoPagoPreference: Preference;
}
