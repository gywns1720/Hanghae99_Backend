const fs = require('fs-extra');
const path = require('path');

// .env 파일 읽기
require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

// 템플릿 읽기
const template = fs.readFileSync(
  path.join(__dirname, 'redis.conf.template'),
  'utf8',
);

const Keys = ['Master', 'Node1', 'Node2', 'Node3'];

// .env 값으로 대체

for (let i = 0; i < Keys.length; i++) {
  try {
    const result = template.replace(/\{([A-Z0-9_]+)\}/g, (_, key) => {
      const value = process.env[`${Keys[i]}_${key}`];
      if (value === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
      }
      return value;
    });
    // 폴더 생성
    const dir = path.resolve(__dirname, Keys[i].toLowerCase());
    fs.ensureDirSync(dir, { mode: 0o755 });
    fs.writeFileSync(
      path.join(dir, `redis.${Keys[i].toLowerCase()}.conf`),
      result,
      'utf8',
    );
  } catch (err) {
    console.error('===============================');
    console.error(Keys[i], 'Error');
    console.error(err);
    console.error('===============================');
  }
}

// 결과 저장

console.log('✅ redis.conf 생성 완료');
