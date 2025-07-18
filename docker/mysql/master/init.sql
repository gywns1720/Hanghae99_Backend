
-- Create repl User
CREATE USER 'repl'@'%' IDENTIFIED BY 'repl123';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;


--- User
create table if not exists user
(
    u_id    varchar(36)                 not null comment '유저 고유 PK',
    u_name  varchar(50)                 not null comment '유저 이름',
    u_email varchar(255)                not null comment '유저 이메일',
    u_point decimal(10, 2) default 0.00 not null comment '현재 포인트'
)
    comment 'User';

create index user_u_email_index
    on user (u_email)
    comment '유저 계정 이메일';

alter table user
    add primary key (u_id);

