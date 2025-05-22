import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { PointHistory } from '../point.model';
import { PointModule } from '../point.module';
import { PointService } from '../point.service';

describe('point.controller.ts e2e 테스트 ', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PointModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    const initService = app.get<PointService>(PointService);

    // 기본값 설정
    for (let i = 0; i < 3; i++) {
      await initService.chargingPointAsync(1, 1000);
    }
  });

  //#region [GET /point/:id]
  it('/point/1 (GET) 이용하여 3000 원이 충전되어있는가?', async () => {
    const res = await request(app.getHttpServer()).get('/point/1');

    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.point).toBe(3000);
  });

  it('/point/-1 (GET) 있을 수 없는 유저 아이디를 검색할 경우 예외가 발생하는가?', async () => {
    const res = await request(app.getHttpServer()).get('/point/-1');

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });
  //#endregion

  //#region [GET /point/:id/histories]
  it('/point/1/histories (GET) 요청했을 때 3개의 내역이 있는가?', async () => {
    const res = await request(app.getHttpServer()).get('/point/1/histories');

    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.length).toBe(3);
    expect(
      res.body.reduce((acc: number, cur: PointHistory) => acc + cur.amount, 0),
    ).toBe(3000);
  });
  it('/point/c/histories (GET) 있을 수 없는 유저 아이디를 검색할 경우 예외가 발생', async () => {
    const res = await request(app.getHttpServer()).get('/point/c/histories');

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });
  //#endregion

  //#region [PATCH /point/:id/charge]
  it('/point/2/charge (PATCH) 10000원 충전 여부', async () => {
    const res = await request(app.getHttpServer())
      .patch('/point/2/charge')
      .send({
        amount: 10000,
      });

    expect(res.status).toBe(HttpStatus.OK);
    // 기존 3000 + 10000
    expect(res.body.point).toBe(10000);
  });
  it('/point/3/charge (PATCH) -3000원 충전시 예외가 발생하는가?', async () => {
    const res = await request(app.getHttpServer())
      .patch('/point/3/charge')
      .send({
        amount: -3000,
      });

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });
  //#endregion
  //#region [PATCH /point/:id/use]
  it('/point/1/use (PATCH) 3000 원 사용하기', async () => {
    const res = await request(app.getHttpServer()).patch('/point/1/use').send({
      amount: 3000,
    });

    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.point).toBe(0);
  });

  it('/point/2/use (PATCH) -3000 원 사용하기', async () => {
    const res = await request(app.getHttpServer()).patch('/point/2/use').send({
      amount: -3000,
    });

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });
  //#endregion
  afterAll(async () => {
    await app.close();
  });
});
