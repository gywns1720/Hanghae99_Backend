export class FindOneProductQuery {
  constructor(
    public readonly id: string,
    public readonly ttl: number = 5,
  ) {}
}
