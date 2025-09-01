import { Injectable } from '@nestjs/common';
import { MercadopagoProvider } from './mercadopago.provider';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';

@Injectable()
export class MercadopagoService {
  constructor(private readonly mercadoPagoProvider: MercadopagoProvider) {}
  async createPreference(data: PreferenceRequest) {
    const newPreference =
      await this.mercadoPagoProvider.mercadoPagoPreference.create({
        body: data,
        requestOptions: {},
      });
    return newPreference;
  }

  async getPreference(preferenceId: string) {
    const newPreference =
      await this.mercadoPagoProvider.mercadoPagoPreference.get({
        preferenceId,
        requestOptions: {},
      });
    return newPreference;
  }
}
