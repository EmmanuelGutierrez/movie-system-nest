export class ColumnNumberTransformer {
  defaultDate: boolean | undefined;
  constructor(defaultDate?: boolean) {
    this.defaultDate = defaultDate;
  }

  to(data: number | undefined): number | undefined {
    if (this.defaultDate && !data) {
      return Math.floor(new Date().getTime() / 1000);
    }
    return data;
  }

  from(data: string | null) {
    return data ? parseInt(data) : data;
  }
}
